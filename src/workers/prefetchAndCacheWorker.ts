import { None, Option } from "ts-results";
import { z } from "zod";
import {
    FETCH_REQUEST_TIMEOUT,
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../constants";
import { DecodedToken, ResponsePayloadSafe, SafeResult } from "../types";
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
} from "../utils";

type MessageEventPrefetchAndCacheWorkerToMain = MessageEvent<
    SafeResult<{
        accessTokenOption: Option<string>;
        decodedTokenOption: Option<DecodedToken>;
    }>
>;

type MessageEventPrefetchAndCacheMainToWorker = MessageEvent<
    {
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventPrefetchAndCacheMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe(
        {
            object: event.data,
            zSchema: z.object(
                {
                    requestInit: z.any(),
                    routesZodSchemaMapKey: z.string(),
                    url: z.string(),
                },
            ),
        },
    );
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
        // check if the response is cached
        const cachedResponsePayloadSafeResult = await getCachedItemAsyncSafe<
            ResponsePayloadSafe<unknown>
        >(url);
        if (cachedResponsePayloadSafeResult.err) {
            self.postMessage(cachedResponsePayloadSafeResult);
            return;
        }
        // the response is already cached
        if (cachedResponsePayloadSafeResult.val.some) {
            self.postMessage(
                createSafeSuccessResult({
                    accessTokenOption: None, // No access token in cache
                    decodedTokenOption: None,
                }),
            );
            return;
        }
        // the response is not cached, proceed with fetching
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

        const jsonResult = await extractJSONFromResponseSafe(
            responseOption.val,
        );
        const jsonOption = handleErrorResultAndNoneOptionInWorker(
            jsonResult,
            "Error extracting JSON from response",
        );
        if (jsonOption.none) {
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe({
            object: jsonOption.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        const responsePayloadSafeOption =
            handleErrorResultAndNoneOptionInWorker(
                responsePayloadSafeResult,
                "Error parsing server response",
            );
        if (responsePayloadSafeOption.none) {
            return;
        }

        const { accessToken: accessTokenOption } =
            responsePayloadSafeOption.val;
        if (accessTokenOption.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No access token found in response",
                ),
            );
            return;
        }

        const decodedTokenResult = decodeJWTSafe(accessTokenOption.val);
        const decodedTokenOption = handleErrorResultAndNoneOptionInWorker(
            decodedTokenResult,
            "No decoded token received",
        );
        if (decodedTokenOption.none) {
            return;
        }

        const responseWithoutAccessAndDecodedTokens = {
            ...responsePayloadSafeOption.val,
            accessToken: None,
            decodedToken: None,
        };
        const setItemCacheResult = await setCachedItemAsyncSafe(
            url,
            responseWithoutAccessAndDecodedTokens,
        );
        if (setItemCacheResult.err) {
            self.postMessage(setItemCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                accessTokenOption,
                decodedTokenOption,
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
    console.error("Fetch Parse Worker error:", event);
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
    MessageEventPrefetchAndCacheMainToWorker,
    MessageEventPrefetchAndCacheWorkerToMain,
};
