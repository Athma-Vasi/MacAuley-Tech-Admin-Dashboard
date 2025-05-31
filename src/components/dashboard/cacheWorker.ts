import {
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../constants";
import { BusinessMetricsDocument, SafeResult } from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
} from "../../utils";
import { messageEventDashboardFetchMainToWorkerZod } from "./schemas";
import { DashboardMetricsView } from "./types";

type MessageEventDashboardCacheMainToWorker = MessageEvent<
    {
        metricsView: Lowercase<DashboardMetricsView>;
        routesZodSchemaMapKey: RoutesZodSchemasMapKey;
        cacheKey: string;
    }
>;

type MessageEventDashboardCacheWorkerToMain = MessageEvent<
    SafeResult<{
        metricsDocument: BusinessMetricsDocument;
        metricsView: Lowercase<DashboardMetricsView>;
    }>
>;

self.onmessage = async (
    event: MessageEventDashboardCacheMainToWorker,
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
    const parsedMessageOption = handleErrorResultAndNoneOptionInWorker(
        parsedMessageResult,
        "Error parsing message",
    );
    if (parsedMessageOption.none) {
        return;
    }

    const {
        cacheKey,
        metricsView,
        routesZodSchemaMapKey,
    } = parsedMessageOption.val;

    try {
        const businessMetricsDocumentResult = await getCachedItemAsyncSafe<
            BusinessMetricsDocument
        >(cacheKey);
        const businessMetricsDocumentOption =
            handleErrorResultAndNoneOptionInWorker(
                businessMetricsDocumentResult,
                "Error fetching cached metrics document",
            );
        if (businessMetricsDocumentOption.none) {
            return;
        }

        const parsedResult = parseSyncSafe({
            object: businessMetricsDocumentOption.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        const parsedResultOption = handleErrorResultAndNoneOptionInWorker(
            parsedResult,
            "Parsed result not found",
        );
        if (parsedResultOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                metricsDocument: parsedResultOption.val,
                metricsView,
            }),
        );
    } catch (error: unknown) {
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Dashboard Cache Worker error:", event);
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
    MessageEventDashboardCacheMainToWorker,
    MessageEventDashboardCacheWorkerToMain,
};
