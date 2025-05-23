import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import { SafeResult, UserDocument } from "../../types";
import {
    catchHandlerErrorSafe,
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleDirectoryDepartmentAndLocationClicksInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
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
        } = parsedInputResult.val.val;

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
                payload: userDocumentsResult.val.val as UserDocument[],
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
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleDirectoryDepartmentAndLocationClicks };
