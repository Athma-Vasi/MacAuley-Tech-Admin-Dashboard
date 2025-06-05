import { None, Option } from "ts-results";
import { z } from "zod";
import { InvariantError } from "../components/error";
import { FETCH_REQUEST_TIMEOUT, RoutesZodSchemasMapKey } from "../constants";
import { DecodedToken, ResponsePayloadSafe, SafeResult } from "../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
    retryFetchSafe,
} from "../utils";

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
            createSafeErrorResult(
                new InvariantError("No data received"),
            ),
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
        skipTokenDecode,
        url,
    } = parsedMessageOption.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
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

        if (skipTokenDecode) {
            self.postMessage(
                createSafeSuccessResult({
                    responsePayloadSafe: responsePayloadSafeOption.val,
                    decodedToken: None,
                }),
            );
            return;
        }

        const responsePayloadSafe = responsePayloadSafeOption.val;
        const { accessToken } = responsePayloadSafe;
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

        const decodedTokenSafeResult = decodeJWTSafe(accessToken.val);
        const decodedTokenOption = handleErrorResultAndNoneOptionInWorker(
            decodedTokenSafeResult,
            "Error decoding token",
        );
        if (decodedTokenOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                responsePayloadSafe,
                decodedToken: decodedTokenOption,
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
