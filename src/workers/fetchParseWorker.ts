import { None, Option } from "ts-results";
import { z } from "zod";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import {
    DecodedToken,
    HttpServerResponse,
    ResultSafeBox,
    UserDocument,
} from "../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
    parseSyncSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

type MessageEventFetchWorkerToMain<Data = unknown> = MessageEvent<
    ResultSafeBox<
        {
            parsedServerResponse: HttpServerResponse<Data>;
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
        self.postMessage(createSafeErrorResult("No data received"));
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
    if (parsedMessageResult.err || parsedMessageResult.val.none) {
        self.postMessage(createSafeErrorResult("Error parsing input"));
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        skipTokenDecode,
        url,
    } = parsedMessageResult.val.safeUnwrap();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error fetching data"),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.safeUnwrap());
        if (jsonResult.err || jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error extracting JSON from response"),
            );
            return;
        }

        // if (jsonResult.val.message === "Invalid credentials") {
        //     self.postMessage(
        //         new Ok({ data: None, kind: "success" }),
        //     );
        //     return;
        // }

        const parsedResult = await parseServerResponseAsyncSafe(
            {
                object: jsonResult.val.safeUnwrap(),
                zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
            },
        );

        if (parsedResult.err || parsedResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error parsing server response"),
            );
            return;
        }

        if (skipTokenDecode) {
            self.postMessage(
                createSafeSuccessResult(
                    {
                        parsedServerResponse: parsedResult.val.safeUnwrap(),
                        decodedToken: None,
                    },
                ),
            );
            return;
        }

        const { accessToken } = parsedResult.val.safeUnwrap();

        const decodedTokenSafeResult = decodeJWTSafe(accessToken);
        if (decodedTokenSafeResult.err || decodedTokenSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding JWT"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult(
                {
                    parsedServerResponse: parsedResult.val.safeUnwrap(),
                    decodedToken: decodedTokenSafeResult.val,
                },
            ),
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
    self.postMessage(createSafeErrorResult(event));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeErrorResult(event.reason));
});

export type { MessageEventFetchMainToWorker, MessageEventFetchWorkerToMain };
