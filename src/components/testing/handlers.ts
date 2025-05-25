import { ResponsePayloadSafe, UserDocument } from "../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
} from "../../utils";

async function postUsersToDB(
    {
        body,
        fetchAbortControllerRef,
        isComponentMountedRef,
        setIsSubmitting,
        showBoundary,
        url,
    }: {
        body: string;
        fetchAbortControllerRef: React.RefObject<AbortController | null>;
        isComponentMountedRef: React.RefObject<boolean>;
        setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
        showBoundary: (error: unknown) => void;
        url: string;
    },
) {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const requestInit: RequestInit = {
        body,
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        signal: fetchAbortController.signal,
    };

    const urlWithQuery = new URL(url);

    setIsSubmitting(true);

    try {
        const responseResult = await fetchResponseSafe(
            urlWithQuery,
            requestInit,
        );

        if (!isComponentMounted) {
            return createSafeErrorResult(
                "Component unmounted before response",
            );
        }

        if (responseResult.err) {
            showBoundary(responseResult);
            return responseResult;
        }
        if (responseResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data returned from server",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const responseUnwrapped = responseResult.val.val;

        const jsonResult = await extractJSONFromResponseSafe<
            ResponsePayloadSafe<UserDocument>
        >(responseUnwrapped);

        if (!isComponentMounted) {
            return createSafeErrorResult(
                "Component unmounted before response",
            );
        }

        if (jsonResult.err) {
            showBoundary(jsonResult);
            return jsonResult;
        }
        if (jsonResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data returned from server",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const serverResponse = jsonResult.val.val;
        if (serverResponse.kind === "error") {
            const safeErrorResult = createSafeErrorResult(
                serverResponse.message,
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        setIsSubmitting(false);

        return createSafeSuccessResult({
            responsePayloadSafe: serverResponse,
        });
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            { current: true },
            showBoundary,
        );
    }
}

export { postUsersToDB };
