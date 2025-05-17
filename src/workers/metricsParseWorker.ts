import { z } from "zod";
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
    SafeBoxResult,
} from "../types";
import {
    createSafeBoxResult,
    decodeJWTSafe,
    fetchResponseSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
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
        if (responseResult.err) {
            self.postMessage(responseResult);
            return;
        }
        if (responseResult.val.data.none) {
            self.postMessage(responseResult);
            return;
        }

        const zSchema = ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey];

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<
                z.infer<typeof zSchema>
            >
        >(responseResult.val.data.val);

        if (jsonResult.err) {
            self.postMessage(createSafeBoxResult({
                message: jsonResult.val.message ??
                    "Error parsing JSON",
            }));
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        console.log("metricsParseWorker serverResponse", serverResponse);
        if (serverResponse === undefined) {
            self.postMessage(createSafeBoxResult({
                message: "No data returned from server",
            }));
            return;
        }

        if (serverResponse.message === "User not found") {
            self.postMessage(createSafeBoxResult({
                message: "User not found",
                data: serverResponse,
            }));

            return;
        }

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
                metricsView,
                parsedServerResponse,
                productMetricCategory,
                repairMetricCategory,
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

export type {
    MessageEventMetricsMainToWorker,
    MessageEventMetricsWorkerToMain,
};
