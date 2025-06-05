import { None, Ok, Option } from "ts-results";
import { z } from "zod";
import {
    FETCH_REQUEST_TIMEOUT,
    INVALID_CREDENTIALS,
    METRICS_URL,
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
    getCachedItemAsyncSafe,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
    retryFetchSafe,
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
    const parsedMessageOption = handleErrorResultAndNoneOptionInWorker(
        parsedMessageResult,
        "Error parsing message",
    );
    if (parsedMessageOption.none) {
        return;
    }

    const {
        requestInit,
        routesZodSchemaMapKey,
        url,
    } = parsedMessageOption.val;

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
        const [
            responsePayloadSafeResultSettled,
            financialMetricsDocumentResultSettled,
        ] = await Promise.allSettled([
            retryFetchSafe({
                init: requestInit,
                input: url,
                routesZodSchemaMapKey,
                signal: controller.signal,
            }),
            getCachedItemAsyncSafe<FinancialMetricsDocument>(cacheKey),
        ]);

        if (financialMetricsDocumentResultSettled.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    financialMetricsDocumentResultSettled.reason,
                ),
            );
            return;
        }
        const financialMetricsDocumentResultOption =
            handleErrorResultAndNoneOptionInWorker(
                financialMetricsDocumentResultSettled.value,
                "Error fetching financial metrics document",
            );
        if (financialMetricsDocumentResultOption.none) {
            return;
        }

        if (responsePayloadSafeResultSettled.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    responsePayloadSafeResultSettled.reason,
                ),
            );
            return;
        }
        const responsePayloadSafeOption =
            handleErrorResultAndNoneOptionInWorker(
                responsePayloadSafeResultSettled.value,
                "Error fetching or parsing response",
            );
        if (responsePayloadSafeOption.none) {
            return;
        }

        const responsePayloadSafe = responsePayloadSafeOption.val;
        const { accessToken, message, kind } = responsePayloadSafe;

        if (
            kind === "error" && message.some &&
            message.val === INVALID_CREDENTIALS
        ) {
            self.postMessage(new Ok(None));
            return;
        }

        if (accessToken.none) {
            self.postMessage(
                createSafeErrorResult("Access token not found"),
            );
            return;
        }

        const decodedTokenSafeResult = decodeJWTSafe(accessToken.val);
        const decodedTokenSafeOption = handleErrorResultAndNoneOptionInWorker(
            decodedTokenSafeResult,
            "Error decoding token",
        );
        if (decodedTokenSafeOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                financialMetricsDocument:
                    financialMetricsDocumentResultOption.val,
                responsePayloadSafe,
                decodedToken: decodedTokenSafeOption,
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
