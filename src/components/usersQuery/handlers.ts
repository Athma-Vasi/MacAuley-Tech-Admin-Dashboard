import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { HttpServerResponse, UserDocument } from "../../types";
import {
    decodeJWTSafe,
    fetchSafe,
    parseServerResponseSafeAsync,
    responseToJSONSafe,
} from "../../utils";
import { usersQueryAction } from "./actions";
import { UsersQueryState } from "./types";
import { userDocumentZ } from "./zodSchema";

async function handleUsersQuerySubmitGET(
    {
        accessToken,
        authDispatch,
        dispatch,
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigate,
        showBoundary,
        url,
        usersQueryState,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        dispatch: React.Dispatch<any>;
        fetchAbortControllerRef: React.RefObject<
            AbortController | null
        >;
        isComponentMountedRef: React.RefObject<boolean>;
        navigate: NavigateFunction;
        showBoundary: (error: unknown) => void;
        url: RequestInfo | URL;
        usersQueryState: UsersQueryState;
    },
) {
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

    dispatch({
        action: usersQueryAction.setIsLoading,
        payload: true,
    });

    try {
        const responseResult = await fetchSafe(
            urlWithQuery,
            requestInit,
        );

        if (!isComponentMounted) {
            return;
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<UserDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return;
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        console.time("--PARSING--");
        const parsedResult = await parseServerResponseSafeAsync({
            object: serverResponse,
            zSchema: userDocumentZ,
        });
        console.timeEnd("--PARSING--");

        if (!isComponentMounted) {
            return;
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return;
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        const { accessToken, kind, message, triggerLogout } =
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
            return;
        }

        if (kind === "error") {
            showBoundary(
                new Error(
                    `Server error: ${message}`,
                ),
            );
            return;
        }

        const decodedTokenResult = await decodeJWTSafe(
            accessToken,
        );

        if (!isComponentMounted) {
            return;
        }

        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (!decodedToken) {
            showBoundary(new Error("Invalid token"));
            return;
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: accessToken,
        });
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken,
        });

        const data = parsedServerResponse.data as unknown as UserDocument[];

        const sorted = data.sort((a, b) => {
            if (arrangeByDirection === "ascending") {
                return a[arrangeByField] >
                        b[arrangeByField]
                    ? 1
                    : -1;
            } else {
                return a[arrangeByField] < b[arrangeByField] ? 1 : -1;
            }
        });

        dispatch({
            action: usersQueryAction.setResourceData,
            payload: sorted,
        });

        dispatch({
            action: usersQueryAction.setTotalDocuments,
            payload: serverResponse.totalDocuments,
        });

        dispatch({
            action: usersQueryAction.setIsLoading,
            payload: false,
        });

        dispatch({
            action: usersQueryAction.setPages,
            payload: serverResponse.pages,
        });

        dispatch({
            action: usersQueryAction.setNewQueryFlag,
            payload: true,
        });

        dispatch({
            action: usersQueryAction.setCurrentPage,
            payload: currentPage,
        });
    } catch (error: unknown) {
        if (
            !isComponentMounted ||
            fetchAbortController.signal.aborted
        ) {
            return;
        }
        showBoundary(error);
    }
}

export { handleUsersQuerySubmitGET };
