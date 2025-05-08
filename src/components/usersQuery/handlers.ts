import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { HttpServerResponse, SafeBoxResult, UserDocument } from "../../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    fetchSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
} from "../../utils";
import { usersQueryAction } from "./actions";
import { userDocumentOptionalsZod } from "./schemas";
import { UsersQueryMessageEvent, UsersQueryState } from "./types";

async function handleUsersQuerySubmitGETClick(
    {
        accessToken,
        url,
        usersFetchWorker,
        usersQueryDispatch,
        usersQueryState,
    }: {
        accessToken: string;
        url: RequestInfo | URL;
        usersFetchWorker: Worker | null;
        usersQueryDispatch: React.Dispatch<any>;
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
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    } = usersQueryState;

    const urlWithQuery = new URL(
        `${url}/user/${queryString}&totalDocuments=${totalDocuments}&newQueryFlag=${newQueryFlag}&page=${currentPage}`,
    );

    usersQueryDispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    usersFetchWorker?.postMessage({
        url: urlWithQuery.toString(),
        requestInit,
        routesZodSchemaMapKey: "users",
    });
}

async function handleUsersQueryOnmessageCallback(
    {
        authDispatch,
        event,
        isComponentMountedRef,
        navigate,
        showBoundary,
        usersQueryDispatch,
        usersQueryState,
    }: {
        authDispatch: React.Dispatch<AuthDispatch>;
        event: UsersQueryMessageEvent;
        usersQueryDispatch: React.Dispatch<any>;
        usersQueryState: UsersQueryState;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
    },
) {
    try {
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (event.data.err) {
            showBoundary(event.data.val.data);
            return createSafeBoxResult({
                message: event.data.val.message ?? "Error fetching response",
            });
        }

        const dataUnwrapped = event.data.val.data;
        if (dataUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        const { parsedServerResponse, decodedToken } = dataUnwrapped;
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
            return createSafeBoxResult({ message: "Logout triggered" });
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
                message,
                kind: "error",
            });
        }

        const { arrangeByDirection, arrangeByField, currentPage } =
            usersQueryState;

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

        usersQueryDispatch({
            action: usersQueryAction.setTotalDocuments,
            payload: parsedServerResponse.totalDocuments,
        });

        usersQueryDispatch({
            action: usersQueryAction.setIsLoading,
            payload: false,
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
            action: usersQueryAction.setCurrentPage,
            payload: currentPage,
        });

        return createSafeBoxResult({
            data: {
                userDocuments: sorted,
                newAccessToken,
            },
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }
        showBoundary(error);
        return createSafeBoxResult({
            message: "Error handling message",
        });
    }
}

async function handleUsersQuerySubmitGET(
    {
        accessToken,
        authDispatch,
        usersQueryDispatch,
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigate,
        showBoundary,
        url,
        usersQueryState,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        usersQueryDispatch: React.Dispatch<any>;
        fetchAbortControllerRef: React.RefObject<
            AbortController | null
        >;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        url: RequestInfo | URL;
        usersQueryState: UsersQueryState;
    },
): Promise<
    SafeBoxResult<
        {
            userDocuments: Array<UserDocument>;
            newAccessToken: string;
        }
    >
> {
    fetchAbortControllerRef.current?.abort(
        "Previous request cancelled",
    );
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    } = usersQueryState;

    const requestInit: RequestInit = {
        method: "GET",
        signal: fetchAbortController.signal,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
    };

    const urlWithQuery = new URL(
        `${url}/user/${queryString}&totalDocuments=${totalDocuments}&newQueryFlag=${newQueryFlag}&page=${currentPage}`,
    );

    usersQueryDispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    try {
        const responseResult = await fetchSafe(
            urlWithQuery,
            requestInit,
        );

        if (!isComponentMounted) {
            return createSafeBoxResult({ message: "Component unmounted" });
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return createSafeBoxResult({ message: "Error fetching data" });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<UserDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return createSafeBoxResult({ message: "Component unmounted" });
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return createSafeBoxResult({ message: "Error parsing response" });
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        console.time("--PARSING--");
        const parsedResult = await parseServerResponseAsyncSafe({
            object: serverResponse,
            zSchema: userDocumentOptionalsZod,
        });
        console.timeEnd("--PARSING--");

        if (!isComponentMounted) {
            return createSafeBoxResult({ message: "Component unmounted" });
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return createSafeBoxResult({
                message: "Error parsing server response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const { accessToken: newAccessToken, kind, message, triggerLogout } =
            parsedServerResponse;

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
            return createSafeBoxResult({ message: "Logout triggered" });
        }

        const decodedTokenResult = await decodeJWTSafe(
            newAccessToken,
        );

        if (!isComponentMounted) {
            return createSafeBoxResult({ message: "Component unmounted" });
        }

        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return createSafeBoxResult({ message: "Error decoding token" });
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (!decodedToken) {
            showBoundary(new Error("Invalid token"));
            return createSafeBoxResult({ message: "Invalid token" });
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
                message,
                kind: "error",
            });
        }

        const data = parsedServerResponse.data as unknown as UserDocument[];

        const sorted = data.sort((a, b) => {
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

        usersQueryDispatch({
            action: usersQueryAction.setTotalDocuments,
            payload: parsedServerResponse.totalDocuments,
        });

        usersQueryDispatch({
            action: usersQueryAction.setIsLoading,
            payload: false,
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
            action: usersQueryAction.setCurrentPage,
            payload: currentPage,
        });

        return createSafeBoxResult({
            data: {
                userDocuments: sorted,
                newAccessToken,
            },
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !isComponentMounted ||
            fetchAbortController.signal.aborted
        ) {
            return createSafeBoxResult({});
        }
        showBoundary(error);
        return createSafeBoxResult({});
    }
}

export {
    handleUsersQueryOnmessageCallback,
    handleUsersQuerySubmitGET,
    handleUsersQuerySubmitGETClick,
};
