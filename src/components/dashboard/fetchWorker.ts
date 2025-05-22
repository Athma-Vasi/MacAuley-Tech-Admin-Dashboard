import { Some } from "ts-results";
import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import {
    BusinessMetricsDocument,
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
    SafeBoxResult<{
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
        self.postMessage(createSafeBoxResult({
            data: Some(new Error("No data received")),
            message: Some("No data received"),
        }));
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventDashboardFetchMainToWorkerZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: Some("Error parsing message"),
        }));
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
    } = parsedMessageResult.val.data.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    try {
        const responseResult = await fetchResponseSafe(url, {
            ...requestInit,
            signal: controller.signal,
        });
        if (responseResult.err || responseResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: responseResult.val,
                    message: Some("Error fetching response"),
                }),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe<
            HttpServerResponse<UserDocument>
        >(responseResult.val.safeUnwrap());
        if (jsonResult.err || jsonResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: jsonResult.val,
                    message: Some("Error extracting JSON from response"),
                }),
            );
            return;
        }

        console.log(
            "jsonResult in dashboard fetch worker",
            jsonResult.val.safeUnwrap(),
        );

        const parsedResult = await parseServerResponseAsyncSafe({
            object: jsonResult.val.safeUnwrap(),
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });

        if (parsedResult.err || parsedResult.val.none) {
            self.postMessage(
                createSafeBoxResult({
                    data: Some("Error parsing server response"),
                }),
            );
            return;
        }

        const { accessToken } = parsedResult.val.safeUnwrap();

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

        console.log("SUCCESSFULLY DECODED JWT TOKEN", decodedTokenResult.val);

        self.postMessage(createSafeBoxResult({
            data: Some({
                decodedToken: decodedTokenResult.val.safeUnwrap(),
                metricsView,
                parsedServerResponse: parsedResult.val.safeUnwrap(),
                productMetricCategory,
                repairMetricCategory,
                storeLocation,
            }),
            kind: "success",
        }));
    } catch (err) {
        self.postMessage(createSafeBoxResult({
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
    MessageEventDashboardFetchMainToWorker,
    MessageEventDashboardFetchWorkerToMain,
};
