import { z } from "zod";
import { AllStoreLocations } from "../components/dashboard/types";
import { DepartmentsWithDefaultKey } from "../components/directory/types";
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
    fetchSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
} from "../utils";
import { ROUTES_ZOD_SCHEMAS_MAP, RoutesZodSchemasMapKey } from "./constants";

type MessageEventDirectoryFetchWorkerToMain = MessageEvent<
    SafeBoxResult<
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
        const responseResult = await fetchSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err) {
            self.postMessage(createSafeBoxResult({
                message: responseResult.val.message ??
                    "Error fetching response",
            }));
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "Response is undefined",
            }));
            return;
        }

        const zSchema = ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey];

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<
                z.infer<typeof zSchema>
            >
        >(responseUnwrapped);

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

        console.log("directoryFetchWorker serverResponse", serverResponse);

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
            data: {
                decodedToken,
                department,
                parsedServerResponse,
                storeLocation,
            },
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

export type {
    MessageEventDirectoryFetchMainToWorker,
    MessageEventDirectoryFetchWorkerToMain,
};
