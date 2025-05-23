import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import {
    DecodedToken,
    HttpServerResponse,
    ResultSafeBox,
    UserDocument,
} from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
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
    ResultSafeBox<
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
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventUsersFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing message"),
        );
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
                createSafeErrorResult("Error fetching response"),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.safeUnwrap());
        if (jsonResult.err || jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error extracting JSON"),
            );
            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.safeUnwrap(),
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });

        if (parsedResult.err || parsedResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error parsing server response"),
            );
            return;
        }

        const { accessToken } = parsedResult.val.safeUnwrap();

        const decodedTokenResult = decodeJWTSafe(accessToken);
        if (decodedTokenResult.err || decodedTokenResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding JWT token"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult(
                {
                    currentPage,
                    decodedToken: decodedTokenResult.val.safeUnwrap(),
                    newQueryFlag,
                    parsedServerResponse: parsedResult.val.safeUnwrap(),
                    queryString,
                    totalDocuments,
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
    console.error("Users Query Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event.reason),
    );
});

export type {
    MessageEventUsersFetchMainToWorker,
    MessageEventUsersFetchWorkerToMain,
};
