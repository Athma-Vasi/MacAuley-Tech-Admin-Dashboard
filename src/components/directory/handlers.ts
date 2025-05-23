import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import { ResultSafeBox, UserDocument } from "../../types";
import {
    createDirectoryURLCacheKey,
    createSafeErrorResult,
    getCachedItemAsyncSafe,
    parseSyncSafe,
} from "../../utils";
import { AllStoreLocations } from "../dashboard/types";
import { handleDirectoryDepartmentAndLocationClicksInputZod } from "./schemas";
import { DepartmentsWithDefaultKey } from "./types";

async function handleDirectoryDepartmentAndLocationClicks(
    input: {
        accessToken: string;
        department: DepartmentsWithDefaultKey;
        directoryFetchWorker: Worker | null;
        directoryUrl: string;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        showBoundary: (error: unknown) => void;
        storeLocation: AllStoreLocations;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleDirectoryDepartmentAndLocationClicksInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.none) {
            return createSafeErrorResult("Error parsing input");
        }

        const {
            accessToken,
            department,
            directoryFetchWorker,
            directoryUrl,
            globalDispatch,
            isComponentMountedRef,
            showBoundary,
            storeLocation,
        } = parsedInputResult.val.safeUnwrap();

        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const cacheKey = createDirectoryURLCacheKey({
            department,
            directoryUrl,
            storeLocation,
        });

        globalDispatch({
            action: globalAction.setIsFetching,
            payload: true,
        });

        const userDocumentsResult = await getCachedItemAsyncSafe<
            UserDocument[]
        >(cacheKey);

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component unmounted");
        }
        if (userDocumentsResult.err) {
            showBoundary(userDocumentsResult);
            return userDocumentsResult;
        }

        if (userDocumentsResult.val.some) {
            globalDispatch({
                action: globalAction.setDirectory,
                payload: userDocumentsResult.val.safeUnwrap() as UserDocument[],
            });

            globalDispatch({
                action: globalAction.setIsFetching,
                payload: false,
            });

            return createSafeErrorResult("Data already fetched");
        }

        directoryFetchWorker?.postMessage({
            department,
            requestInit,
            routesZodSchemaMapKey: "directory",
            storeLocation,
            url: cacheKey,
        });

        return createSafeErrorResult("Data fetching started");
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createSafeErrorResult("Component unmounted");
        }

        const safeErrorResult = createSafeErrorResult(error);
        input.showBoundary(safeErrorResult);
        return safeErrorResult;
    }
}

export { handleDirectoryDepartmentAndLocationClicks };
