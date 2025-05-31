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
    handleErrorResultAndNoneOptionInWorker,
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
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        const responseOption = handleErrorResultAndNoneOptionInWorker(
            responseResult,
            "Error fetching response",
        );
        if (responseOption.none) {
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            ResponsePayloadSafe<UserDocument>
        >(responseOption.val);
        const jsonOption = handleErrorResultAndNoneOptionInWorker(
            jsonResult,
            "Error extracting JSON from response",
        );
        if (jsonOption.none) {
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe<
            UserDocument
        >({
            object: jsonOption.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        const responsePayloadOption = handleErrorResultAndNoneOptionInWorker(
            responsePayloadSafeResult,
            "Error parsing server response",
        );
        if (responsePayloadOption.none) {
            return;
        }

        const { accessToken } = responsePayloadOption.val;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Access token not found in response",
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

        const responseWithoutAccessToken = {
            ...responsePayloadOption.val,
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
                decodedToken: decodedTokenOption,
                from: "fetch",
                responsePayloadSafe: responsePayloadOption.val,
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
