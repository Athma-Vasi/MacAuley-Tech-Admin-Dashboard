import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import {
    BusinessMetricsDocument,
    DecodedToken,
    HttpServerResponse,
    SafeResult,
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
import { ProductMetricCategory } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
import { messageEventDashboardFetchMainToWorkerZod } from "./schemas";
import { AllStoreLocations, DashboardMetricsView } from "./types";

type MessageEventDashboardFetchMainToWorker = MessageEvent<
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

type MessageEventDashboardFetchWorkerToMain = MessageEvent<
    SafeResult<{
        decodedToken: DecodedToken;
        metricsView: Lowercase<DashboardMetricsView>;
        parsedServerResponse: HttpServerResponse<BusinessMetricsDocument>;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        storeLocation: AllStoreLocations;
    }>
>;

self.onmessage = async (
    event: MessageEventDashboardFetchMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventDashboardFetchMainToWorkerZod,
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
        metricsView,
        productMetricCategory,
        repairMetricCategory,
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
                createSafeErrorResult("Response not found"),
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
                createSafeErrorResult("JSON not found"),
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
                createSafeErrorResult("Parsed result not found"),
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
                createSafeErrorResult("Decoded token not found"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                decodedToken: decodedTokenResult.val.val,
                metricsView,
                parsedServerResponse: parsedResult.val.val,
                productMetricCategory,
                repairMetricCategory,
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
    console.error("Metrics Charts Worker error:", event);
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
    MessageEventDashboardFetchMainToWorker,
    MessageEventDashboardFetchWorkerToMain,
};
