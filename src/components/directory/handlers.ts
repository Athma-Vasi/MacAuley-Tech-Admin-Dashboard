import { SafeResult } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    parseSyncSafe,
} from "../../utils";
import { AllStoreLocations } from "../dashboard/types";
import { InvariantError } from "../error";
import { directoryAction } from "./actions";
import { handleDirectoryDepartmentAndLocationClicksInputZod } from "./schemas";
import { DepartmentsWithDefaultKey, DirectoryDispatch } from "./types";
import { createDirectoryURLCacheKey } from "./utils";

async function handleDirectoryDepartmentAndLocationClicks(
    input: {
        accessToken: string;
        department: DepartmentsWithDefaultKey;
        directoryDispatch: React.Dispatch<DirectoryDispatch>;
        directoryFetchWorker: Worker | null;
        directoryUrl: string;
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
                new InvariantError(
                    "Unexpected None option in input parsing",
                ),
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            accessToken,
            department,
            directoryDispatch,
            directoryFetchWorker,
            directoryUrl,
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

        directoryDispatch({
            action: directoryAction.setIsLoading,
            payload: true,
        });

        directoryFetchWorker?.postMessage({
            requestInit,
            routesZodSchemaMapKey: "directory",
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
