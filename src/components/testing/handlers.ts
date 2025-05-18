import { Err, Ok } from "ts-results";
import { HttpServerResponse, UserDocument } from "../../types";
import { fetchSafe, responseToJSONSafe } from "../../utils";

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
            showBoundary(
                new Error(
                    `Server error: ${serverResponse.message}`,
                ),
            );
            return;
        }

        const [userDocument] = serverResponse.data;

        if (userDocument === undefined) {
            showBoundary(new Error("No data returned from server"));
            return;
        }

        setIsSubmitting(false);

        return new Ok(userDocument);
    } catch (error: unknown) {
        if (
            !isComponentMounted || fetchAbortController.signal.aborted
        ) {
            return;
        }
        showBoundary(error);
        return new Err(error);
    }
}

export { postUsersToDB };
