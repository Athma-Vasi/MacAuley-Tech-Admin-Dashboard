import { NavigateFunction } from "react-router-dom";
import { AuthDispatch } from "../../context/authProvider/types";
import { GlobalDispatch } from "../../context/globalProvider/types";
import { HttpServerResponse, UserDocument, UserSchema } from "../../types";
import { fetchSafe, responseToJSONSafe } from "../../utils";
import { registerAction } from "./actions";
import { RegisterDispatch } from "./types";

async function handleRegisterButtonClick(
    {
        fetchAbortControllerRef,
        isComponentMountedRef,
        navigateFn,
        navigateTo,
        registerDispatch,
        schema,
        showBoundary,
        url,
    }: {
        fetchAbortControllerRef: React.RefObject<AbortController | null>;
        isComponentMountedRef: React.RefObject<boolean>;
        registerDispatch: React.Dispatch<RegisterDispatch>;
        navigateFn: NavigateFunction;
        navigateTo: string;
        schema: UserSchema;
        showBoundary: (error: unknown) => void;
        url: RequestInfo | URL;
    },
) {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const requestInit: RequestInit = {
        body: JSON.stringify({ schema }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        signal: fetchAbortController.signal,
    };

    registerDispatch({
        action: registerAction.setIsSubmitting,
        payload: true,
    });

    try {
        const responseResult = await fetchSafe(url, requestInit);

        if (!isComponentMounted) {
            return;
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
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
            showBoundary(new Error("No data returned from server"));
            return;
        }

        if (serverResponse.kind === "error") {
            registerDispatch({
                action: registerAction.setIsSubmitting,
                payload: false,
            });
            registerDispatch({
                action: registerAction.setIsError,
                payload: true,
            });
            registerDispatch({
                action: registerAction.setErrorMessage,
                payload: serverResponse.message,
            });
            navigateFn("/register");
            return;
        }

        registerDispatch({
            action: registerAction.setIsSubmitting,
            payload: false,
        });
        registerDispatch({
            action: registerAction.setIsSuccessful,
            payload: true,
        });
        registerDispatch({
            action: registerAction.setIsError,
            payload: false,
        });
        registerDispatch({
            action: registerAction.setErrorMessage,
            payload: "",
        });

        navigateFn(navigateTo);
    } catch (error: unknown) {
        if (
            !isComponentMounted || fetchAbortController.signal.aborted
        ) {
            return;
        }
        showBoundary(error);
    }
}

export { handleRegisterButtonClick };
