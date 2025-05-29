import { Option } from "ts-results";
import { z } from "zod";
import {
    FETCH_REQUEST_TIMEOUT,
    METRICS_URL,
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../constants";
import {
    DecodedToken,
    FinancialMetricsDocument,
    ResponsePayloadSafe,
    SafeResult,
} from "../../types";
import {
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    decodeJWTSafe,
    extractJSONFromResponseSafe,
    fetchResponseSafe,
    getCachedItemAsyncSafe,
    parseResponsePayloadAsyncSafe,
    parseSyncSafe,
} from "../../utils";

type MessageEventLoginFetchWorkerToMain<Data = unknown> = MessageEvent<
    SafeResult<
        {
            financialMetricsDocument: FinancialMetricsDocument;
            responsePayloadSafe: ResponsePayloadSafe<Data>;
            decodedToken: Option<DecodedToken>;
        }
    >
>;

type MessageEventLoginFetchMainToWorker = MessageEvent<
    {
        requestInit: RequestInit;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        url: string;
    }
>;

self.onmessage = async (
    event: MessageEventLoginFetchMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe(
        {
            object: event.data,
            zSchema: z.object(
                {
                    requestInit: z.any(),
                    routesZodSchemaMapKey: z.string(),
                    url: z.string().url(),
                },
            ),
        },
    );
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing message"),
        );
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageResult.val.val;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_REQUEST_TIMEOUT);

    const cacheKey = createMetricsURLCacheKey({
        metricsUrl: METRICS_URL,
        metricsView: "financials",
        productMetricCategory: "All Products",
        repairMetricCategory: "All Repairs",
        storeLocation: "All Locations",
    });

    try {
        const [responseResultSettled, financialMetricsDocumentResultSettled] =
            await Promise.allSettled([
                fetchResponseSafe(url, {
                    ...requestInit,
                    signal: controller.signal,
                }),
                getCachedItemAsyncSafe<FinancialMetricsDocument>(cacheKey),
            ]);

        if (responseResultSettled.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    responseResultSettled.reason,
                ),
            );
            return;
        }
        if (financialMetricsDocumentResultSettled.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    financialMetricsDocumentResultSettled.reason,
                ),
            );
            return;
        }

        if (financialMetricsDocumentResultSettled.value.err) {
            self.postMessage(financialMetricsDocumentResultSettled.value);
            return;
        }
        if (financialMetricsDocumentResultSettled.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Financial metrics not found in cache",
                ),
            );
            return;
        }

        if (responseResultSettled.value.err) {
            self.postMessage(responseResultSettled.value);
            return;
        }
        if (responseResultSettled.value.val.none) {
            self.postMessage(
                createSafeErrorResult("Error fetching response"),
            );
            return;
        }

        const jsonResult = await extractJSONFromResponseSafe(
            responseResultSettled.value.val.val,
        );
        if (jsonResult.err) {
            self.postMessage(jsonResult);
            return;
        }
        if (jsonResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Error extracting JSON from response",
                ),
            );
            return;
        }

        const responsePayloadSafeResult = await parseResponsePayloadAsyncSafe({
            object: jsonResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (responsePayloadSafeResult.err) {
            self.postMessage(responsePayloadSafeResult);
            return;
        }
        if (responsePayloadSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Error parsing server response",
                ),
            );
            return;
        }

        const responsePayloadSafe = responsePayloadSafeResult.val.val;
        const { accessToken } = responsePayloadSafe;
        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult("Access token not found"),
            );
            return;
        }

        const decodedTokenSafeResult = decodeJWTSafe(accessToken.val);
        if (decodedTokenSafeResult.err) {
            self.postMessage(decodedTokenSafeResult);
            return;
        }
        if (decodedTokenSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Error decoding token"),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                financialMetricsDocument:
                    financialMetricsDocumentResultSettled.value.val.val,
                responsePayloadSafe,
                decodedToken: decodedTokenSafeResult.val,
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
    console.error("Fetch Parse Worker error:", event);
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
    MessageEventLoginFetchMainToWorker,
    MessageEventLoginFetchWorkerToMain,
};
