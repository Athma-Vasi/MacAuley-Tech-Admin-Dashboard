import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { ResultSafeBox, UserDocument } from "../../types";
import {
    createResultSafeBox,
    createSafeBoxResult,
    createUsersURLCacheKey,
    getCachedItemSafeAsync,
    setCachedItemSafeAsync,
} from "../../utils";
import { MessageEventUsersQueryWorkerToMain } from "../../workers/usersQueryWorker";
import { usersQueryAction } from "./actions";
import { UsersQueryDispatch } from "./schemas";
import { UsersQueryState } from "./types";

async function handleUsersQuerySubmitGETClick(
    {
        accessToken,
        currentPage,
        isComponentMountedRef,
        newQueryFlag,
        showBoundary,
        url,
        usersFetchWorker,
        usersQueryDispatch,
        usersQueryState,
    }: {
        accessToken: string;
        currentPage: number;
        isComponentMountedRef: React.RefObject<boolean>;
        newQueryFlag: boolean;
        showBoundary: (error: unknown) => void;
        url: string;
        usersFetchWorker: Worker | null;
        usersQueryDispatch: React.Dispatch<UsersQueryDispatch>;
        usersQueryState: UsersQueryState;
    },
) {
    const requestInit: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const {
        queryString,
        totalDocuments,
    } = usersQueryState;

    const cacheKey = createUsersURLCacheKey({
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
        url,
    });

    console.log("handleUsersQuerySubmitGETClick cacheKey", cacheKey);

    usersQueryDispatch({
        action: usersQueryAction.setCurrentPage,
        payload: currentPage,
    });
    usersQueryDispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    try {
        const userDocumentsResult = await getCachedItemSafeAsync<
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
            const { arrangeByDirection, arrangeByField } = usersQueryState;
            const userDocuments = userDocumentsResult.safeUnwrap()
                .data as UserDocument[];

            const sorted = userDocuments.sort((a, b) => {
                const aValue = a[arrangeByField];
                const bValue = b[arrangeByField];

                if (aValue === undefined && bValue === undefined) return 0;
                if (aValue === undefined) return 1;
                if (bValue === undefined) return -1;

                if (arrangeByDirection === "ascending") {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            const withFUIAndPPUFieldsAdded = sorted.map(
                (userDocument) => {
                    return {
                        ...userDocument,
                        fileUploadId: userDocument.fileUploadId
                            ? userDocument.fileUploadId
                            : "",
                        profilePictureUrl: userDocument.profilePictureUrl
                            ? userDocument.profilePictureUrl
                            : "",
                    };
                },
            );

            usersQueryDispatch({
                action: usersQueryAction.setResourceData,
                payload: withFUIAndPPUFieldsAdded,
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

        usersFetchWorker?.postMessage({
            currentPage,
            newQueryFlag,
            queryString,
            requestInit,
            routesZodSchemaMapKey: "users",
            totalDocuments,
            url: cacheKey,
        });

        return createSafeBoxResult({
            data: true,
            kind: "success",
        });
    } catch (error: unknown) {
        return createSafeBoxResult({
            data: error,
            message: "Error handling submit click",
        });
    }
}

async function handleUsersQueryOnmessageCallback(
    {
        authDispatch,
        event,
        isComponentMountedRef,
        navigate,
        showBoundary,
        url,
        usersQueryDispatch,
        usersQueryState,
    }: {
        authDispatch: React.Dispatch<AuthDispatch>;
        event: MessageEventUsersQueryWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        url: string;
        usersQueryDispatch: React.Dispatch<UsersQueryDispatch>;
        usersQueryState: UsersQueryState;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const messageEventResult = event.data;
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createResultSafeBox({
                data: messageEventResult.val.data,
                message: messageEventResult.val.message,
            });
        }

        const {
            parsedServerResponse,
            decodedToken,
            currentPage,
            newQueryFlag,
            queryString,
            totalDocuments,
        } = messageEventResult.val.data.val;
        const {
            accessToken: newAccessToken,
            kind,
            message,
            triggerLogout,
            data: userDocuments,
        } = parsedServerResponse;

        if (triggerLogout) {
            authDispatch({
                action: authAction.setAccessToken,
                payload: "",
            });
            authDispatch({
                action: authAction.setIsLoggedIn,
                payload: false,
            });
            authDispatch({
                action: authAction.setDecodedToken,
                payload: Object.create(null),
            });
            authDispatch({
                action: authAction.setUserDocument,
                payload: Object.create(null),
            });

            await localforage.clear();
            navigate("/");
            return createResultSafeBox({
                data: Some("Logout triggered"),
            });
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: newAccessToken,
        });
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken,
        });

        if (kind === "error") {
            showBoundary(
                new Error(
                    `Server error: ${message}`,
                ),
            );
            return createResultSafeBox({
                data: Some(message),
            });
        }

        const { arrangeByDirection, arrangeByField } = usersQueryState;

        const sorted = userDocuments.sort((a, b) => {
            const aValue = a[arrangeByField];
            const bValue = b[arrangeByField];

            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            if (arrangeByDirection === "ascending") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        const withFUIAndPPUFieldsAdded = sorted.map(
            (userDocument) => {
                return {
                    ...userDocument,
                    fileUploadId: userDocument.fileUploadId
                        ? userDocument.fileUploadId
                        : "",
                    profilePictureUrl: userDocument.profilePictureUrl
                        ? userDocument.profilePictureUrl
                        : "",
                };
            },
        );

        const cacheKey = createUsersURLCacheKey({
            currentPage,
            newQueryFlag,
            queryString,
            totalDocuments,
            url,
        });

        const setItemCacheResult = await setCachedItemSafeAsync(
            cacheKey,
            withFUIAndPPUFieldsAdded,
        );
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }
        if (setItemCacheResult.err) {
            showBoundary(setItemCacheResult.val.data);
            return createResultSafeBox({
                data: Some("Error setting cached item"),
            });
        }

        usersQueryDispatch({
            action: usersQueryAction.setResourceData,
            payload: withFUIAndPPUFieldsAdded,
        });
        usersQueryDispatch({
            action: usersQueryAction.setTotalDocuments,
            payload: parsedServerResponse.totalDocuments,
        });
        usersQueryDispatch({
            action: usersQueryAction.setPages,
            payload: parsedServerResponse.pages,
        });
        usersQueryDispatch({
            action: usersQueryAction.setNewQueryFlag,
            payload: true,
        });
        usersQueryDispatch({
            action: usersQueryAction.setIsLoading,
            payload: false,
        });

        return createResultSafeBox({
            data: Some("User documents fetched successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
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

export { handleUsersQueryOnmessageCallback, handleUsersQuerySubmitGETClick };
