import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import {
    CustomerMetricsDocument,
    FinancialMetricsDocument,
    ProductMetricsDocument,
    RepairMetricsDocument,
    SafeResult,
} from "../../types";
import {
    catchHandlerErrorSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    parseSyncSafe,
} from "../../utils";
import { dashboardAction } from "./actions";
import { MessageEventDashboardCacheWorkerToMain } from "./cacheWorker";
import { ProductMetricCategory } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
import {
    handleMessageEventDashboardCacheWorkerToMainInputZod,
    handleStoreAndCategoryClicksInputZod,
} from "./schemas";
import {
    AllStoreLocations,
    DashboardDispatch,
    DashboardMetricsView,
} from "./types";

async function handleStoreAndCategoryClicks(
    input: {
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        dashboardCacheWorker: Worker | null;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        metricsView: Lowercase<DashboardMetricsView>;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        showBoundary: (error: unknown) => void;
        storeLocation: AllStoreLocations;
    },
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleStoreAndCategoryClicksInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            dashboardDispatch,
            dashboardCacheWorker,
            metricsUrl,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        } = parsedInputResult.val.val;

        const cacheKey = createMetricsURLCacheKey({
            metricsUrl,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        });

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: true,
        });

        dashboardCacheWorker?.postMessage({
            metricsView,
            routesZodSchemaMapKey: "dashboard",
            cacheKey,
        });

        return createSafeSuccessResult("Data fetching started");
    } catch (error) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

async function handleMessageEventDashboardCacheWorkerToMain(
    input: {
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        event: MessageEventDashboardCacheWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        showBoundary: (error: unknown) => void;
    },
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventDashboardCacheWorkerToMainInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            dashboardDispatch,
            event,
            globalDispatch,
            isComponentMountedRef,
            showBoundary,
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component unmounted");
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult("No data received");
        }

        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }

        if (messageEventResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "No data received",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const { metricsDocument, metricsView } = messageEventResult.val.val;

        if (metricsView === "financials") {
            globalDispatch({
                action: globalAction.setFinancialMetricsDocument,
                payload: metricsDocument as FinancialMetricsDocument,
            });
        }

        if (metricsView === "products") {
            globalDispatch({
                action: globalAction.setProductMetricsDocument,
                payload: metricsDocument as ProductMetricsDocument,
            });
        }

        if (metricsView === "customers") {
            globalDispatch({
                action: globalAction.setCustomerMetricsDocument,
                payload: metricsDocument as CustomerMetricsDocument,
            });
        }

        if (metricsView === "repairs") {
            globalDispatch({
                action: globalAction.setRepairMetricsDocument,
                payload: metricsDocument as RepairMetricsDocument,
            });
        }

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });

        return createSafeSuccessResult("Data fetching completed");
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export {
    handleMessageEventDashboardCacheWorkerToMain,
    handleStoreAndCategoryClicks,
};
