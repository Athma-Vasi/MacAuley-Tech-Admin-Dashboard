import { Some } from "ts-results";
import { AllStoreLocations } from "../components/dashboard/types";
import { DepartmentsWithDefaultKey } from "../components/directory/types";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import {
    DecodedToken,
    HttpServerResponse,
    ResultSafeBox,
    UserDocument,
} from "../types";
import {
    createResultSafeBox,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

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
    console.log(
        "Directory Fetch Worker received message in self:",
        JSON.stringify(event.data, null, 2),
    );
    const {
        department,
        requestInit,
        routesZodSchemaMapKey,
        storeLocation,
        url,
    } = event.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.data.none) {
            self.postMessage(
                createResultSafeBox({
                    data: responseResult.val.data,
                    message: Some("Error fetching data"),
                }),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.data.val);
        if (jsonResult.err || jsonResult.val.data.none) {
            self.postMessage(
                createResultSafeBox({
                    data: jsonResult.val.data,
                    message: Some("Error extracting JSON from response"),
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
                createResultSafeBox({
                    data: parsedResult.val.data,
                    message: Some("Error parsing server response"),
                }),
            );
            return;
        }

        const { accessToken } = parsedResult.val.data.val;

        const decodedTokenResult = await decodeJWTSafe(accessToken);
        if (decodedTokenResult.err || decodedTokenResult.val.data.none) {
            self.postMessage(
                createResultSafeBox({
                    data: decodedTokenResult.val.data,
                    message: Some("Error decoding JWT"),
                }),
            );
            return;
        }

        self.postMessage(createResultSafeBox({
            data: Some({
                decodedToken: decodedTokenResult.val.data.val,
                department,
                parsedServerResponse: parsedResult.val.data.val,
                storeLocation,
            }),
            kind: "success",
        }));
    } catch (err) {
        self.postMessage(
            createResultSafeBox({
                data: Some(err),
                message: Some(
                    err instanceof Error
                        ? err.message
                        : typeof err === "string"
                        ? err
                        : "Unknown error",
                ),
            }),
        );
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Directory Fetch Worker error:", event);
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
    MessageEventDirectoryFetchMainToWorker,
    MessageEventDirectoryFetchWorkerToMain,
};
