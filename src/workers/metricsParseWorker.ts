import { Some } from "ts-results";
import { ProductMetricCategory } from "../components/dashboard/product/types";
import { RepairMetricCategory } from "../components/dashboard/repair/types";
import {
    AllStoreLocations,
    DashboardMetricsView,
} from "../components/dashboard/types";
import { FETCH_REQUEST_TIMEOUT } from "../constants";
import {
    BusinessMetricsDocument,
    DecodedToken,
    HttpServerResponse,
    ResultSafeBox,
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

type MessageEventMetricsMainToWorker = MessageEvent<
    {
        metricsView: Lowercase<DashboardMetricsView>;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        storeLocation: AllStoreLocations;
        url: string;
    }
>;

type MessageEventMetricsWorkerToMain = MessageEvent<
    ResultSafeBox<{
        decodedToken: DecodedToken;
        metricsView: Lowercase<DashboardMetricsView>;
        parsedServerResponse: HttpServerResponse<BusinessMetricsDocument>;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        storeLocation: AllStoreLocations;
    }>
>;

self.onmessage = async (
    event: MessageEventMetricsMainToWorker,
) => {
    console.log(
        "Metrics Worker received message in self",
        event.data,
    );
    const {
        metricsView,
        productMetricCategory,
        repairMetricCategory,
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
                metricsView,
                parsedServerResponse,
                productMetricCategory,
                repairMetricCategory,
                storeLocation,
            }),
            kind: "success",
        }));
    } catch (err) {
        self.postMessage(createResultSafeBox({
            data: Some(err),
            message: Some(
                err instanceof Error
                    ? err.message
                    : typeof err === "string"
                    ? err
                    : "Unknown error",
            ),
        }));
    } finally {
        clearTimeout(timeout);
    }
};

self.onerror = (event: string | Event) => {
    console.error("Metrics Charts Worker error:", event);
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
    MessageEventMetricsMainToWorker,
    MessageEventMetricsWorkerToMain,
};
