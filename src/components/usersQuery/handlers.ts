import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { HttpServerResponse, UserDocument } from "../../types";
import { decodeJWTSafe, fetchSafe, responseToJSONSafe } from "../../utils";
import { usersQueryAction } from "./actions";

async function handleUsersQuerySubmitGET(
    {
        accessToken,
        authDispatch,
        currentPage,
        dispatch,
        fetchAbortControllerRef,
        isComponentMountedRef,
        newQueryFlag,
        queryString,
        showBoundary,
        totalDocuments,
        url,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        currentPage: number;
        dispatch: React.Dispatch<any>;
        fetchAbortControllerRef: React.RefObject<
            AbortController | null
        >;
        isComponentMountedRef: React.RefObject<boolean>;
        newQueryFlag: boolean;
        queryString: string;
        totalDocuments: number;
        showBoundary: (error: unknown) => void;
        url: RequestInfo | URL;
    },
) {
    fetchAbortControllerRef.current?.abort(
        "Previous request cancelled",
    );
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

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

        if (serverResponse.kind === "error") {
            showBoundary(
                new Error(
                    `Server error: ${serverResponse.message}`,
                ),
            );
            return;
        }

        const { accessToken } = serverResponse;

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

        const userDocuments = serverResponse.data;

        dispatch({
            action: usersQueryAction.setResourceData,
            payload: userDocuments,
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
