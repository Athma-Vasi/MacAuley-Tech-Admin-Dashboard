import { None, Ok, Some } from "ts-results";
import { z } from "zod";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import {
    DecodedToken,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
    parseSyncSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

type MessageEventFetchWorkerToMain<Data = unknown> = MessageEvent<
    SafeBoxResult<
        {
            parsedServerResponse: HttpServerResponse<Data>;
            decodedToken: DecodedToken;
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
        self.postMessage(createSafeBoxResult({
            data: Some(new Error("No data received")),
            message: Some("No data received"),
        }));
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: z.object({
            requestInit: z.any(),
            routesZodSchemaMapKey: z.string(),
            skipTokenDecode: z.boolean().optional(),
            url: z.string(),
        }),
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: parsedMessageResult.val.message,
        }));
        return;
    }

    console.log(
        "Worker received message in self:",
        JSON.stringify(event.data, null, 2),
    );

    const {
        requestInit,
        routesZodSchemaMapKey,
        skipTokenDecode,
        url,
    } = parsedMessageResult.val.data.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: responseResult.val,
                    message: Some("Error fetching data"),
                }),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.safeUnwrap());
        if (jsonResult.err || jsonResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: jsonResult.val,
                    message: Some("Error extracting JSON from response"),
                }),
            );
            return;
        }

        // if (jsonResult.val.message === "Invalid credentials") {
        //     self.postMessage(
        //         new Ok({ data: None, kind: "success" }),
        //     );
        //     return;
        // }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.safeUnwrap(),
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });

        if (parsedResult.err || parsedResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: parsedResult.val.data,
                    message: Some("Error parsing server response"),
                }),
            );
            return;
        }

        if (skipTokenDecode) {
            self.postMessage(createSafeBoxResult({
                data: Some({ parsedServerResponse: parsedResult.val.data.val }),
                kind: "success",
            }));
            return;
        }

        const { accessToken } = parsedResult.val.data.val;

        const decodedTokenSafeResult = decodeJWTSafe(accessToken);
        if (decodedTokenSafeResult.err || decodedTokenSafeResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: decodedTokenSafeResult.val,
                    message: Some("Error decoding JWT"),
                }),
            );
            return;
        }

        self.postMessage(createSafeBoxResult({
            data: Some({
                parsedServerResponse: parsedResult.val.data.val,
                decodedToken: decodedTokenSafeResult.val.safeUnwrap(),
            }),
            kind: "success",
        }));
    } catch (error: unknown) {
        self.postMessage(
            createSafeBoxResult({
                data: Some(error),
                message: Some(
                    error instanceof Error
                        ? error.message
                        : typeof error === "string"
                        ? error
                        : "Unknown error",
                ),
            }),
        );
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Fetch Parse Worker error:", event);
    self.postMessage(createSafeBoxResult({
        data: Some(event),
        message: Some(
            event instanceof Error
                ? event.message
                : typeof event === "string"
                ? event
                : "Unknown error",
        ),
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeBoxResult({
        data: Some(event.reason),
        message: Some(
            event.reason instanceof Error
                ? event.reason.message
                : typeof event.reason === "string"
                ? event.reason
                : "Unknown error",
        ),
    }));
});

export type { MessageEventFetchMainToWorker, MessageEventFetchWorkerToMain };
