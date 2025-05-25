import { None, Option } from "ts-results";
import { z } from "zod";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import { DecodedToken, ResponsePayloadSafe, SafeResult } from "../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseResponsePayloadAsyncSafe,
    parseSyncSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

type MessageEventFetchWorkerToMain<Data = unknown> = MessageEvent<
    SafeResult<
        {
            responsePayloadSafe: ResponsePayloadSafe<Data>;
            decodedToken: Option<DecodedToken>;
        }
    >
>;

type MessageEventFetchMainToWorker = MessageEvent<
    {
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        skipTokenDecode?: boolean;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventFetchMainToWorker,
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
                    skipTokenDecode: z.boolean().optional(),
                    url: z.string(),
                },
            ),
        },
    );
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing message"),
        );
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        skipTokenDecode,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
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

        const jsonResult = await extractJSONFromResponseSafe(
            responseResult.val.val,
        );
        if (jsonResult.err) {
            self.postMessage(jsonResult);
            return;
        }
        if (jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Error extracting JSON from response",
                ),
            );
            return;
        }

        console.log("jsonResult", jsonResult.val.val);

        // if (jsonResult.val.message === "Invalid credentials") {
        //     self.postMessage(
        //         new Ok({ data: None, kind: "success" }),
        //     );
        //     return;
        // }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        console.log("responsePayloadSafeResult", responsePayloadSafeResult);
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

        if (skipTokenDecode) {
            self.postMessage(
                createSafeSuccessResult({
                    responsePayloadSafe: responsePayloadSafeResult.val.val,
                    decodedToken: None,
                }),
            );
            return;
        }

        console.log(
            "responsePayloadSafeResult.val.val",
            responsePayloadSafeResult.val.val,
        );

        const responsePayloadSafe = responsePayloadSafeResult.val.val;
        const { accessToken } = responsePayloadSafe;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult("Access token not found"),
            );
            return;
        }

        const decodedTokenSafeResult = decodeJWTSafe(accessToken.val);
        if (decodedTokenSafeResult.err) {
            self.postMessage(decodedTokenSafeResult);
            return;
        }
        if (decodedTokenSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding token"),
            );
            return;
        }

        console.log(
            "decodedTokenSafeResult.val.val",
            decodedTokenSafeResult.val.val,
        );

        self.postMessage(
            createSafeSuccessResult({
                responsePayloadSafe,
                decodedToken: decodedTokenSafeResult.val,
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

export type { MessageEventFetchMainToWorker, MessageEventFetchWorkerToMain };
