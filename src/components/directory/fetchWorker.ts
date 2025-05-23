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
import { AllStoreLocations } from "../dashboard/types";
import { messageEventDirectoryFetchMainToWorkerZod } from "./schemas";
import { DepartmentsWithDefaultKey } from "./types";

type MessageEventDirectoryFetchWorkerToMain = MessageEvent<
    ResultSafeBox<
        {
            decodedToken: DecodedToken;
            department: DepartmentsWithDefaultKey;
            parsedServerResponse: HttpServerResponse<UserDocument>;
            storeLocation: AllStoreLocations;
        }
    >
>;

type MessageEventDirectoryFetchMainToWorker = MessageEvent<
    {
        department: DepartmentsWithDefaultKey;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        storeLocation: AllStoreLocations;
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
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing input"),
        );
        return;
    }

    const {
        department,
        requestInit,
        routesZodSchemaMapKey,
        storeLocation,
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

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.val);
        if (jsonResult.err) {
            self.postMessage(jsonResult);
            return;
        }
        if (jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error extracting JSON from response"),
            );
            return;
        }

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (parsedResult.err) {
            self.postMessage(parsedResult);
            return;
        }
        if (parsedResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error parsing server response"),
            );
            return;
        }

        const { accessToken } = parsedResult.val.val;
        const decodedTokenResult = decodeJWTSafe(accessToken);
        if (decodedTokenResult.err) {
            self.postMessage(decodedTokenResult);
            return;
        }
        if (decodedTokenResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding JWT"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenResult.val.val,
                department,
                parsedServerResponse: parsedResult.val.val,
                storeLocation,
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
