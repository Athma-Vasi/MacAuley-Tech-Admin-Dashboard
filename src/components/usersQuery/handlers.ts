import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { SafeResult, UserDocument } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
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
): Promise<SafeResult<string>> {
    const parsedInputResult = parseSyncSafe({
        object: input,
        zSchema: handleUsersQuerySubmitGETClickInputZod,
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
    } = parsedInputResult.val.val;

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
            return createSafeErrorResult("Component unmounted");
        }
        if (userDocumentsResult.err) {
            showBoundary(userDocumentsResult);
            return userDocumentsResult;
        }

        if (userDocumentsResult.val.some) {
            const userDocuments = userDocumentsResult.val.val;

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

            return createSafeSuccessResult(
                "User documents fetched successfully",
            );
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

        return createSafeSuccessResult(
            "Fetching data...",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
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
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleUsersQueryOnmessageCallbackInputZod,
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
            arrangeByDirection,
            arrangeByField,
            authDispatch,
            event,
            isComponentMountedRef,
            navigate,
            showBoundary,
            url,
            usersQueryDispatch,
        } = parsedInputResult.val.val;

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult(
                "No data in message event",
            );
        }
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component unmounted");
        }

        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data found",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const {
            parsedServerResponse,
            decodedToken,
            currentPage,
            newQueryFlag,
            queryString,
            totalDocuments,
        } = messageEventResult.val.val;
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
            return createSafeErrorResult("Logged out");
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
            const safeErrorResult = createSafeErrorResult(
                `Server error: ${message}`,
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
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
            return createSafeErrorResult("Component unmounted");
        }
        if (setItemCacheResult.err) {
            showBoundary(setItemCacheResult);
            return setItemCacheResult;
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

        return createSafeSuccessResult(
            "User documents fetched successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleUsersQueryOnmessageCallback, handleUsersQuerySubmitGETClick };
