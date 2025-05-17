import { z } from "zod";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import { DecodedToken, HttpServerResponse, SafeBoxResult } from "../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
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
    console.log(
        "Worker received message in self:",
        JSON.stringify(event.data, null, 2),
    );
    const {
        requestInit,
        routesZodSchemaMapKey,
        skipTokenDecode,
        url,
    } = event.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err) {
            console.log("err: responseResult.val", responseResult.val);
            console.log(
                "err: responseResult.val.data",
                responseResult.val.data,
            );
            self.postMessage(responseResult);
            return;
        }

        if (responseResult.val.data.none) {
            console.log(
                "none: responseResult.val.data",
                responseResult.val.data,
            );
            self.postMessage(responseResult);
            return;
        }

        console.log(
            "exists : responseResult.val.data",
            responseResult.val.data,
        );

        const zSchema = ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey];

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<
                z.infer<typeof zSchema>
            >
        >(responseResult.val.data.val);

        if (jsonResult.err) {
            self.postMessage(createSafeBoxResult({
                message: jsonResult.val.message ??
                    "Error parsing JSON",
            }));
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        if (serverResponse === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from server",
            }));
            return;
        }

        console.log("fetchParseWorker serverResponse", serverResponse);

        if (serverResponse.message === "Invalid credentials") {
            self.postMessage(createSafeBoxResult({
                message: serverResponse.message,
                data: serverResponse,
            }));

            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: serverResponse,
            zSchema,
        });

        if (parsedResult.err) {
            self.postMessage(createSafeBoxResult({
                message: parsedResult.val.message ??
                    "Error parsing server response",
            }));
            return;
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from server",
            }));
            return;
        }

        if (skipTokenDecode) {
            self.postMessage(createSafeBoxResult({
                data: { parsedServerResponse },
                kind: "success",
            }));
            return;
        }

        const { accessToken } = parsedServerResponse;

        const decodedTokenResult = await decodeJWTSafe(accessToken);
        if (decodedTokenResult.err) {
            self.postMessage(createSafeBoxResult({
                message: decodedTokenResult.val.message ??
                    "Error decoding JWT",
            }));
            return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from JWT",
            }));
            return;
        }

        self.postMessage(createSafeBoxResult({
            data: { parsedServerResponse, decodedToken },
            kind: "success",
        }));
    } catch (err) {
        self.postMessage(createSafeBoxResult({
            data: err,
            kind: "error",
        }));
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Worker error:", event);
    self.postMessage(createSafeBoxResult({
        data: event,
        kind: "error",
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeBoxResult({
        kind: "error",
        message: `Promise error: ${event.reason?.message || event.reason}`,
    }));
});

export type { MessageEventFetchMainToWorker, MessageEventFetchWorkerToMain };
