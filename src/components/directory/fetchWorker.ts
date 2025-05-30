import { None, Option } from "ts-results";
import {
    FETCH_REQUEST_TIMEOUT,
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../constants";
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
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    getCachedItemAsyncSafe,
    parseResponsePayloadAsyncSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
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
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventDirectoryFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing input"),
        );
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
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

        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err) {
            self.postMessage(responseResult);
            return;
        }
        if (responseResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error fetching response"),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            ResponsePayloadSafe<UserDocument>
        >(responseResult.val.val);
        if (jsonResult.err) {
            self.postMessage(jsonResult);
            return;
        }
        if (jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error extracting JSON from response"),
            );
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe<
            UserDocument
        >({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (responsePayloadSafeResult.err) {
            self.postMessage(responsePayloadSafeResult);
            return;
        }
        if (responsePayloadSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Error parsing server response",
                ),
            );
            return;
        }

        const { accessToken } = responsePayloadSafeResult.val.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Access token not found in response",
                ),
            );
            return;
        }

        const decodedTokenResult = decodeJWTSafe(accessToken.val);
        if (decodedTokenResult.err) {
            self.postMessage(decodedTokenResult);
            return;
        }
        if (decodedTokenResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding JWT"),
            );
            return;
        }

        const responseWithoutAccessToken = {
            ...responsePayloadSafeResult.val.val,
            accessToken: None,
        };
        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            responseWithoutAccessToken,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenResult.val,
                from: "fetch",
                responsePayloadSafe: responsePayloadSafeResult.val.val,
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
