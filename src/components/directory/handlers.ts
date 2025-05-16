import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import { UserDocument } from "../../types";
import {
    createDirectoryURLCacheKey,
    createSafeBoxResult,
    getForageItemSafe,
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
) {
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
        const userDocumentsResult = await getForageItemSafe<
            UserDocument[]
        >(cacheKey);

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }
        if (userDocumentsResult.err) {
            showBoundary(userDocumentsResult.val.data);
            return createSafeBoxResult({
                message: userDocumentsResult.val.message ??
                    "Error fetching response",
            });
        }

        if (
            userDocumentsResult.ok &&
            userDocumentsResult.safeUnwrap().kind === "success"
        ) {
            globalDispatch({
                action: globalAction.setDirectory,
                payload: userDocumentsResult.safeUnwrap()
                    .data as UserDocument[],
            });

            globalDispatch({
                action: globalAction.setIsFetching,
                payload: false,
            });

            return createSafeBoxResult({
                data: {
                    accessToken,
                    userDocuments: userDocumentsResult.safeUnwrap()
                        .data as UserDocument[],
                },
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
            data: true,
            kind: "success",
        });
    } catch (error: unknown) {
        return createSafeBoxResult({
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export { handleDirectoryDepartmentAndLocationClicks };
