import { Some } from "ts-results";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import {
    DecodedToken,
    HttpServerResponse,
    SafeBoxResult,
    UserDocument,
} from "../types";
import {
    createResultSafeBox,
    createSafeBoxResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

type MessageEventUsersQueryWorkerToMain = MessageEvent<
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

type MessageEventUsersQueryMainToWorker = MessageEvent<
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
    event: MessageEventUsersQueryMainToWorker,
) => {
    console.log(
        "UsersQueryWorker received message in self:",
        JSON.stringify(event.data, null, 2),
    );
    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    } = event.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.data.none) {
            self.postMessage(responseResult);
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.data.val);
        if (jsonResult.err || jsonResult.val.data.none) {
            self.postMessage(jsonResult);
            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.data.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
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

        const { accessToken } = parsedServerResponse;

        const decodedTokenResult = await decodeJWTSafe(accessToken);
        if (decodedTokenResult.err || decodedTokenResult.val.data.none) {
            self.postMessage(decodedTokenResult);
            return;
        }

        self.postMessage(createResultSafeBox({
            data: Some({
                currentPage,
                decodedToken: decodedTokenResult.val.data.val,
                newQueryFlag,
                parsedServerResponse,
                queryString,
                totalDocuments,
            }),
            kind: "success",
        }));
    } catch (error: unknown) {
        self.postMessage(createResultSafeBox({
            data: Some(error),
        }));
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Users Query Worker error:", event);
    self.postMessage(createResultSafeBox({
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
    self.postMessage(createResultSafeBox({
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
    MessageEventUsersQueryMainToWorker,
    MessageEventUsersQueryWorkerToMain,
};
