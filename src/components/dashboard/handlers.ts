import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction, AuthDispatch } from "../../context/authProvider";
import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import {
    BusinessMetricsDocument,
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
    getCachedItemAsyncSafe,
    parseSyncSafe,
    setCachedItemAsyncSafe,
} from "../../utils";
import { dashboardAction } from "./actions";
import { MessageEventDashboardFetchWorkerToMain } from "./fetchWorker";
import { ProductMetricCategory } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
import {
    handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod,
    handleStoreAndCategoryClicksInputZod,
} from "./schemas";
import {
    AllStoreLocations,
    DashboardDispatch,
    DashboardMetricsView,
} from "./types";

async function handleStoreAndCategoryClicks(
    input: {
        accessToken: string;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        dashboardFetchWorker: Worker | null;
        globalDispatch: React.Dispatch<GlobalDispatch>;
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
            accessToken,
            dashboardDispatch,
            dashboardFetchWorker,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocation,
        } = parsedInputResult.val.val;

        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

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

        const metricsDocumentResult = await getCachedItemAsyncSafe<
            BusinessMetricsDocument
        >(cacheKey);
        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component unmounted");
        }
        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult);
            return metricsDocumentResult;
        }

        if (metricsDocumentResult.val.some) {
            if (metricsView === "customers") {
                globalDispatch({
                    action: globalAction.setCustomerMetricsDocument,
                    payload: metricsDocumentResult.val
                        .val as CustomerMetricsDocument,
                });
            }

            if (metricsView === "financials") {
                globalDispatch({
                    action: globalAction.setFinancialMetricsDocument,
                    payload: metricsDocumentResult.val
                        .val as FinancialMetricsDocument,
                });
            }

            if (metricsView === "products") {
                globalDispatch({
                    action: globalAction.setProductMetricsDocument,
                    payload: metricsDocumentResult.val
                        .val as ProductMetricsDocument,
                });
            }

            if (metricsView === "repairs") {
                globalDispatch({
                    action: globalAction.setRepairMetricsDocument,
                    payload: metricsDocumentResult.val
                        .val as RepairMetricsDocument,
                });
            }

            dashboardDispatch({
                action: dashboardAction.setIsLoading,
                payload: false,
            });

            return createSafeSuccessResult("Data already fetched");
        }

        dashboardFetchWorker?.postMessage({
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            requestInit,
            routesZodSchemaMapKey: "dashboard",
            storeLocation,
            url: cacheKey,
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

async function handleMessageEventStoreAndCategoryFetchWorkerToMain(
    input: {
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        event: MessageEventDashboardFetchWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        navigateFn: NavigateFunction;
        showBoundary: (error: unknown) => void;
    },
): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema:
                handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod,
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
            authDispatch,
            dashboardDispatch,
            event,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl,
            navigateFn,
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

        const {
            parsedServerResponse,
            decodedToken,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        } = messageEventResult.val.val;

        const { accessToken: newAccessToken, triggerLogout } =
            parsedServerResponse;

        if (triggerLogout) {
            authDispatch({
                action: authAction.setAccessToken,
                payload: "",
            });
            authDispatch({
                action: authAction.setIsLoggedIn,
                payload: false,
            });
            authDispatch({
                action: authAction.setDecodedToken,
                payload: Object.create(null),
            });
            authDispatch({
                action: authAction.setUserDocument,
                payload: Object.create(null),
            });

            await localforage.clear();
            navigateFn("/");
            return createSafeErrorResult("Session expired");
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: newAccessToken,
        });
        authDispatch({
            action: authAction.setDecodedToken,
            payload: decodedToken,
        });

        const payload = parsedServerResponse.data[0];

        if (metricsView === "financials") {
            globalDispatch({
                action: globalAction.setFinancialMetricsDocument,
                payload: payload as FinancialMetricsDocument,
            });
        }

        if (metricsView === "products") {
            globalDispatch({
                action: globalAction.setProductMetricsDocument,
                payload: payload as ProductMetricsDocument,
            });
        }

        if (metricsView === "customers") {
            globalDispatch({
                action: globalAction.setCustomerMetricsDocument,
                payload: payload as CustomerMetricsDocument,
            });
        }

        if (metricsView === "repairs") {
            globalDispatch({
                action: globalAction.setRepairMetricsDocument,
                payload: payload as RepairMetricsDocument,
            });
        }

        const cacheKey = createMetricsURLCacheKey({
            metricsUrl,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        });

        const setCachedItemResult = await setCachedItemAsyncSafe<
            BusinessMetricsDocument
        >(
            cacheKey,
            payload,
        );
        if (setCachedItemResult.err) {
            showBoundary(setCachedItemResult);
            return setCachedItemResult;
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
    handleMessageEventStoreAndCategoryFetchWorkerToMain,
    handleStoreAndCategoryClicks,
};
