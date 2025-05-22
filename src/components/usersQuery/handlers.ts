import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { SafeBoxResult, UserDocument } from "../../types";
import {
    createSafeBoxResult,
    createUsersURLCacheKey,
    getCachedItemAsyncSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
import { SortDirection } from "../query/types";
import { usersQueryAction } from "./actions";
import { MessageEventUsersFetchWorkerToMain } from "./fetchWorker";
import {
    handleUsersQueryOnmessageCallbackInputZod,
    handleUsersQuerySubmitGETClickInputZod,
    UsersQueryDispatch,
} from "./schemas";

async function handleUsersQuerySubmitGETClick(
    input: {
        accessToken: string;
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        isComponentMountedRef: React.RefObject<boolean>;
        newQueryFlag: boolean;
        queryString: string;
        showBoundary: (error: unknown) => void;
        totalDocuments: number;
        url: string;
        usersFetchWorker: Worker | null;
        usersQueryDispatch: React.Dispatch<UsersQueryDispatch>;
    },
): Promise<SafeBoxResult<string>> {
    const parsedInputResult = parseSyncSafe({
        object: input,
        zSchema: handleUsersQuerySubmitGETClickInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.none) {
        return createSafeBoxResult({
            data: Some("Error parsing input"),
        });
    }

    const {
        accessToken,
        arrangeByDirection,
        arrangeByField,
        currentPage,
        isComponentMountedRef,
        newQueryFlag,
        queryString,
        showBoundary,
        totalDocuments,
        url,
        usersFetchWorker,
        usersQueryDispatch,
    } = parsedInputResult.val.safeUnwrap();

    const requestInit: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const cacheKey = createUsersURLCacheKey({
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
        url,
    });

    usersQueryDispatch({
        action: usersQueryAction.setCurrentPage,
        payload: currentPage,
    });
    usersQueryDispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    try {
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
                data: Some("Error getting cached item"),
            });
        }

        if (userDocumentsResult.val.some) {
            const userDocuments = userDocumentsResult.val.safeUnwrap();

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
                data: Some("User documents fetched successfully"),
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
            data: Some("Fetching user documents"),
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

async function handleUsersQueryOnmessageCallback(
    input: {
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        authDispatch: React.Dispatch<AuthDispatch>;
        event: MessageEventUsersFetchWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        url: string;
        usersQueryDispatch: React.Dispatch<UsersQueryDispatch>;
    },
): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleUsersQueryOnmessageCallbackInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.none) {
            return createSafeBoxResult({
                data: Some("Error parsing input"),
            });
        }

        const {
            arrangeByDirection,
            arrangeByField,
            authDispatch,
            event,
            isComponentMountedRef,
            navigate,
            showBoundary,
            url,
            usersQueryDispatch,
        } = parsedInputResult.val.safeUnwrap();

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeBoxResult({
                data: Some("No data in message event"),
            });
        }

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createSafeBoxResult({
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
            return createSafeBoxResult({
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
            return createSafeBoxResult({
                data: Some(message),
            });
        }

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

        const setItemCacheResult = await setCachedItemAsyncSafe(
            cacheKey,
            withFUIAndPPUFieldsAdded,
        );
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }
        if (setItemCacheResult.err) {
            showBoundary(setItemCacheResult.val);
            return createSafeBoxResult({
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

        return createSafeBoxResult({
            data: Some("User documents fetched successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (!input.isComponentMountedRef.current) {
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

export { handleUsersQueryOnmessageCallback, handleUsersQuerySubmitGETClick };
