import { BusinessMetricsDocument, SafeResult } from "../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    parseSyncSafe,
} from "../../utils";
import {
    ROUTES_ZOD_SCHEMAS_MAP,
    RoutesZodSchemasMapKey,
} from "../../workers/constants";
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
        cacheKey,
        metricsView,
        routesZodSchemaMapKey,
    } = parsedMessageResult.val.val;

    try {
        const businessMetricsDocumentResult = await getCachedItemAsyncSafe<
            BusinessMetricsDocument
        >(cacheKey);
        if (businessMetricsDocumentResult.err) {
            self.postMessage(businessMetricsDocumentResult);
            return;
        }
        if (businessMetricsDocumentResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No data received"),
            );
            return;
        }

        const parsedResult = parseSyncSafe({
            object: businessMetricsDocumentResult.val.val,
            zSchema: ROUTES_ZOD_SCHEMAS_MAP[routesZodSchemaMapKey],
        });
        if (parsedResult.err) {
            self.postMessage(parsedResult);
            return;
        }
        if (parsedResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Parsed result not found",
                ),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                metricsDocument: parsedResult.val.val,
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
