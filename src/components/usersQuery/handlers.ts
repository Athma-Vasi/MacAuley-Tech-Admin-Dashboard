import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { ResponsePayloadSafe, SafeResult, UserDocument } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    createUsersURLCacheKey,
    makeTransition,
    parseSyncSafe,
} from "../../utils";
import { MessageEventPrefetchAndCacheWorkerToMain } from "../../workers/prefetchAndCacheWorker";
import { SortDirection } from "../query/types";
import { UsersQueryAction, usersQueryAction } from "./actions";
import { MessageEventUsersFetchWorkerToMain } from "./fetchWorker";
import {
    handleMessageEventUsersFetchWorkerToMainInputZod,
    handleMessageEventUsersPrefetchAndCacheWorkerToMainInputZod,
    triggerMessageEventFetchMainToWorkerUsersQueryInputZod,
    triggerMessageEventUsersPrefetchAndCacheMainToWorkerInputZod,
    UsersQueryDispatch,
} from "./schemas";

async function triggerMessageEventUsersPrefetchAndCacheMainToWorker(
    input: {
        accessToken: string;
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        isComponentMountedRef: React.RefObject<boolean>;
        newQueryFlag: boolean;
        prefetchAndCacheWorker: Worker | null;
        queryString: string;
        showBoundary: (error: unknown) => void;
        totalDocuments: number;
        url: string;
    },
) {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema:
                triggerMessageEventUsersPrefetchAndCacheMainToWorkerInputZod,
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
            newQueryFlag,
            queryString,
            totalDocuments,
            url,
            prefetchAndCacheWorker,
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

        prefetchAndCacheWorker?.postMessage({
            arrangeByDirection,
            arrangeByField,
            requestInit,
            routesZodSchemaMapKey: "users",
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

async function handleMessageEventUsersPrefetchAndCacheWorkerToMain(
    input: {
        authDispatch: React.Dispatch<AuthDispatch>;
        event: MessageEventPrefetchAndCacheWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        showBoundary: (error: unknown) => void;
    },
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema:
                handleMessageEventUsersPrefetchAndCacheWorkerToMainInputZod,
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
        const { authDispatch, event, isComponentMountedRef, showBoundary } =
            parsedInputResult.val.val;
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
            accessTokenOption,
            decodedTokenOption,
        } = messageEventResult.val.val;

        if (accessTokenOption.some) {
            authDispatch({
                action: authAction.setAccessToken,
                payload: accessTokenOption.val,
            });
        }
        if (decodedTokenOption.some) {
            authDispatch({
                action: authAction.setDecodedToken,
                payload: decodedTokenOption.val,
            });
        }

        return createSafeSuccessResult(
            "User documents prefetched and cached successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

async function triggerMessageEventFetchMainToWorkerUsersQuery(
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
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: triggerMessageEventFetchMainToWorkerUsersQueryInputZod,
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
            newQueryFlag,
            queryString,
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

        usersFetchWorker?.postMessage({
            arrangeByDirection,
            arrangeByField,
            requestInit,
            routesZodSchemaMapKey: "users",
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

async function handleMessageEventUsersFetchWorkerToMain(
    input: {
        authDispatch: React.Dispatch<AuthDispatch>;
        event: MessageEventUsersFetchWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        usersQueryDispatch: React.Dispatch<UsersQueryDispatch>;
    },
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventUsersFetchWorkerToMainInputZod,
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
            authDispatch,
            event,
            isComponentMountedRef,
            navigate,
            showBoundary,
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
            responsePayloadSafe,
            from,
            decodedToken,
        } = messageEventResult.val.val;
        const {
            accessToken: newAccessToken,
            kind,
            message,
            triggerLogout,
        } = responsePayloadSafe;

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

        if (from === "cache") {
            updateUsersQueryState(
                responsePayloadSafe,
                usersQueryAction,
                usersQueryDispatch,
            );
            return createSafeSuccessResult(
                "User documents retrieved from cache successfully",
            );
        }

        if (newAccessToken.none) {
            const safeErrorResult = createSafeErrorResult(
                "Access token is missing from parsed response from worker",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }
        authDispatch({
            action: authAction.setAccessToken,
            payload: newAccessToken.val,
        });

        if (decodedToken.none) {
            const safeErrorResult = createSafeErrorResult(
                "Decoded token is missing from parsed response from worker",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken.val,
        });

        if (kind === "error") {
            const safeErrorResult = createSafeErrorResult(
                `Server error: ${message}`,
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        updateUsersQueryState(
            responsePayloadSafe,
            usersQueryAction,
            usersQueryDispatch,
        );

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

function updateUsersQueryState(
    responsePayloadSafe: ResponsePayloadSafe<UserDocument>,
    usersQueryAction: UsersQueryAction,
    usersQueryDispatch: React.Dispatch<UsersQueryDispatch>,
): void {
    makeTransition(() => {
        usersQueryDispatch({
            action: usersQueryAction.setResourceData,
            payload: responsePayloadSafe.data,
        });
    });
    usersQueryDispatch({
        action: usersQueryAction.setTotalDocuments,
        payload: responsePayloadSafe.totalDocuments.none
            ? 0
            : responsePayloadSafe.totalDocuments.val,
    });
    usersQueryDispatch({
        action: usersQueryAction.setPages,
        payload: responsePayloadSafe.pages.none
            ? 0
            : responsePayloadSafe.pages.val,
    });
    usersQueryDispatch({
        action: usersQueryAction.setNewQueryFlag,
        payload: true,
    });
    usersQueryDispatch({
        action: usersQueryAction.setIsLoading,
        payload: false,
    });
}

export {
    handleMessageEventUsersFetchWorkerToMain,
    handleMessageEventUsersPrefetchAndCacheWorkerToMain,
    triggerMessageEventFetchMainToWorkerUsersQuery,
    triggerMessageEventUsersPrefetchAndCacheMainToWorker,
};
