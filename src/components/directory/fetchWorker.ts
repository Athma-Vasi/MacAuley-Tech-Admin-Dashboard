import { None, Option } from "ts-results";
import { FETCH_REQUEST_TIMEOUT, RoutesZodSchemasMapKey } from "../../constants";
import {
    DecodedToken,
    ResponsePayloadSafe,
    SafeResult,
    UserDocument,
} from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    getCachedItemAsyncSafe,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
    retryFetchSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
import { InvariantError } from "../error";
import { messageEventDirectoryFetchMainToWorkerZod } from "./schemas";

type MessageEventDirectoryFetchWorkerToMain = MessageEvent<
    SafeResult<
        {
            decodedToken: Option<DecodedToken>;
            from: "fetch" | "cache";
            responsePayloadSafe: ResponsePayloadSafe<UserDocument>;
        }
    >
>;

type MessageEventDirectoryFetchMainToWorker = MessageEvent<
    {
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventDirectoryFetchMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult(
                new InvariantError("No data received"),
            ),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventDirectoryFetchMainToWorkerZod,
    });
    const parsedMessageOption = handleErrorResultAndNoneOptionInWorker(
        parsedMessageResult,
        "Error parsing message",
    );
    if (parsedMessageOption.none) {
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageOption.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        // Check cache first
        const cachedResponsePayloadSafeResult = await getCachedItemAsyncSafe<
            ResponsePayloadSafe<UserDocument>
        >(url);
        if (cachedResponsePayloadSafeResult.err) {
            self.postMessage(cachedResponsePayloadSafeResult);
            return;
        }
        if (cachedResponsePayloadSafeResult.val.some) {
            self.postMessage(
                createSafeSuccessResult({
                    decodedToken: None,
                    from: "cache",
                    responsePayloadSafe:
                        cachedResponsePayloadSafeResult.val.val,
                }),
            );
            return;
        }

        // Proceed with fetch if no cache hit
        const responsePayloadSafeResult = await retryFetchSafe({
            init: requestInit,
            input: url,
            routesZodSchemaMapKey,
            signal: controller.signal,
        });
        const responsePayloadSafeOption =
            handleErrorResultAndNoneOptionInWorker(
                responsePayloadSafeResult,
                "Error fetching or parsing response",
            );
        if (responsePayloadSafeOption.none) {
            return;
        }

        const { accessToken } = responsePayloadSafeOption.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    new InvariantError(
                        "Access token is missing in response payload",
                    ),
                ),
            );
            return;
        }

        const decodedTokenResult = decodeJWTSafe(accessToken.val);
        const decodedTokenOption = handleErrorResultAndNoneOptionInWorker(
            decodedTokenResult,
            "Error decoding JWT",
        );
        if (decodedTokenOption.none) {
            return;
        }

        const responsePayloadWithoutAccessAndDecodedToken = {
            ...responsePayloadSafeOption.val,
            accessToken: None,
            decodedToken: None,
        };
        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            responsePayloadWithoutAccessAndDecodedToken,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenOption,
                from: "fetch",
                responsePayloadSafe: responsePayloadSafeOption.val,
            }),
        );
    } catch (error: unknown) {
        self.postMessage(
            createSafeErrorResult(error),
        );
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Directory Fetch Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event),
    );
});

export type {
    MessageEventDirectoryFetchMainToWorker,
    MessageEventDirectoryFetchWorkerToMain,
};
