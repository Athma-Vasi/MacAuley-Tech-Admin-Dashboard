import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { DecodedToken, SafeResult, UserDocument } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    createUsersURLCacheKey,
    parseSyncSafe,
} from "../../utils";
import { SortDirection } from "../query/types";
import { usersQueryAction } from "./actions";
import { MessageEventUsersFetchWorkerToMain } from "./fetchWorker";
import {
    handleMessageEventUsersFetchWorkerToMainInputZod,
    handleUsersQuerySubmitGETClickInputZod,
    UsersQueryDispatch,
} from "./schemas";

async function handleUsersQuerySubmitGETClick(
    input: {
        accessToken: string;
        arrangeByDirection: SortDirection;
        arrangeByField: keyof UserDocument;
        currentPage: number;
        decodedToken: DecodedToken;
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
            decodedToken,
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
            accessToken,
            arrangeByDirection,
            arrangeByField,
            currentPage,
            decodedToken,
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
            decodedToken,
        } = messageEventResult.val.val;
        const {
            accessToken: newAccessToken,
            kind,
            message,
            triggerLogout,
            data: userDocuments,
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

        authDispatch({
            action: authAction.setAccessToken,
            payload: newAccessToken.none ? "" : newAccessToken.val,
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

        usersQueryDispatch({
            action: usersQueryAction.setResourceData,
            payload: userDocuments,
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

export {
    handleMessageEventUsersFetchWorkerToMain,
    handleUsersQuerySubmitGETClick,
};
