import { Some } from "ts-results";
import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import { ResultSafeBox, UserDocument } from "../../types";
import {
    createDirectoryURLCacheKey,
    createResultSafeBox,
    getCachedItemSafeAsync,
} from "../../utils";
import { AllStoreLocations } from "../dashboard/types";
import { DepartmentsWithDefaultKey } from "./types";

async function handleDirectoryDepartmentAndLocationClicks(
    {
        accessToken,
        department,
        directoryFetchWorker,
        directoryUrl,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
        storeLocation,
    }: {
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
    if (!directoryFetchWorker) {
        return createResultSafeBox({
            data: Some("Worker not initialized"),
        });
    }

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

    try {
        const userDocumentsResult = await getCachedItemSafeAsync<
            UserDocument[]
        >(cacheKey);

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }
        if (userDocumentsResult.err) {
            showBoundary(userDocumentsResult.val.data);
            return createResultSafeBox({
                data: userDocumentsResult.val.data,
                message: userDocumentsResult.val.message,
            });
        }

        if (userDocumentsResult.val.data.some) {
            globalDispatch({
                action: globalAction.setDirectory,
                payload: userDocumentsResult.val.data.val as UserDocument[],
            });

            globalDispatch({
                action: globalAction.setIsFetching,
                payload: false,
            });

            return createResultSafeBox({
                data: Some("Data fetched successfully"),
                kind: "success",
            });
        }

        directoryFetchWorker.postMessage({
            department,
            requestInit,
            routesZodSchemaMapKey: "directory",
            storeLocation,
            url: cacheKey,
        });

        return createResultSafeBox({
            data: Some("Fetching data..."),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        showBoundary(error);
        return createResultSafeBox({
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
