import { Some } from "ts-results";
import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import {
    DecodedToken,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
    parseSyncSafe,
} from "../../utils";
import {
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../workers/constants";
import { messageEventUsersFetchMainToWorkerZod } from "./schemas";

type MessageEventUsersFetchWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentPage: number;
            decodedToken: DecodedToken;
            newQueryFlag: boolean;
            parsedServerResponse: HttpServerResponse<UserDocument>;
            queryString: string;
            totalDocuments: number;
        }
    >
>;

type MessageEventUsersFetchMainToWorker = MessageEvent<
    {
        currentPage: number;
        newQueryFlag: boolean;
        queryString: string;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        totalDocuments: number;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventUsersFetchMainToWorker,
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
        zSchema: messageEventUsersFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: parsedMessageResult.val.message,
        }));
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    } = parsedMessageResult.val.data.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: responseResult.val.data,
                    message: responseResult.val.message,
                }),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.data.val);
        if (jsonResult.err || jsonResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: jsonResult.val.data,
                    message: jsonResult.val.message,
                }),
            );
            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.data.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });

        if (parsedResult.err || parsedResult.val.data.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: parsedResult.val.data,
                    message: parsedResult.val.message,
                }),
            );
            return;
        }

        const { accessToken } = parsedResult.val.data.val;

        const decodedTokenResult = decodeJWTSafe(accessToken);
        if (decodedTokenResult.err || decodedTokenResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: decodedTokenResult.val,
                    message: Some("Error decoding JWT"),
                }),
            );
            return;
        }

        self.postMessage(createSafeBoxResult({
            data: Some({
                currentPage,
                decodedToken: decodedTokenResult.val.safeUnwrap(),
                newQueryFlag,
                parsedServerResponse: parsedResult.val.data.val,
                queryString,
                totalDocuments,
            }),
            kind: "success",
        }));
    } catch (error: unknown) {
        self.postMessage(createSafeBoxResult({
            data: Some(error),
            message: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        }));
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Users Query Worker error:", event);
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

export type {
    MessageEventUsersFetchMainToWorker,
    MessageEventUsersFetchWorkerToMain,
};
