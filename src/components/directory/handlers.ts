import { Some } from "ts-results";
import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import { SafeBoxResult, UserDocument } from "../../types";
import {
    createDirectoryURLCacheKey,
    createSafeBoxResult,
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
): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleDirectoryDepartmentAndLocationClicksInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.none) {
            return createSafeBoxResult({
                data: Some("Error parsing input"),
            });
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
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }
        if (userDocumentsResult.err) {
            showBoundary(userDocumentsResult.val);
            return createSafeBoxResult({
                data: Some("Error getting cached data"),
            });
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

            return createSafeBoxResult({
                data: Some("Data fetched successfully"),
                kind: "success",
            });
        }

        directoryFetchWorker?.postMessage({
            department,
            requestInit,
            routesZodSchemaMapKey: "directory",
            storeLocation,
            url: cacheKey,
        });

        return createSafeBoxResult({
            data: Some("Fetching data..."),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createSafeBoxResult({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

export { handleDirectoryDepartmentAndLocationClicks };
