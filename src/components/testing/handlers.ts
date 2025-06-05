import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    retryFetchSafe,
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
        const responsePayloadSafeResult = await retryFetchSafe({
            init: requestInit,
            input: urlWithQuery.toString(),
            routesZodSchemaMapKey: "users",
            signal: fetchAbortController.signal,
        });
        if (responsePayloadSafeResult.err) {
            const safeErrorResult = createSafeErrorResult(
                responsePayloadSafeResult,
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }
        if (responsePayloadSafeResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data received from the server",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const serverResponse = responsePayloadSafeResult.val.val;
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
