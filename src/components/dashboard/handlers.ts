import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { authAction, AuthDispatch } from "../../context/authProvider";
import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import {
    BusinessMetricsDocument,
    CustomerMetricsDocument,
    FinancialMetricsDocument,
    ProductMetricsDocument,
    RepairMetricsDocument,
    SafeBoxResult,
} from "../../types";
import {
    createMetricsURLCacheKey,
    createSafeBoxResult,
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
): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleStoreAndCategoryClicksInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createSafeBoxResult({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
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
        } = parsedInputResult.val.data.val;

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
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }
        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult.val);
            return createSafeBoxResult({
                data: Some("Error getting cached data"),
            });
        }

        if (metricsDocumentResult.val.some) {
            if (metricsView === "customers") {
                globalDispatch({
                    action: globalAction.setCustomerMetricsDocument,
                    payload: metricsDocumentResult.val
                        .safeUnwrap() as CustomerMetricsDocument,
                });
            }

            if (metricsView === "financials") {
                globalDispatch({
                    action: globalAction.setFinancialMetricsDocument,
                    payload: metricsDocumentResult.val
                        .safeUnwrap() as FinancialMetricsDocument,
                });
            }

            if (metricsView === "products") {
                globalDispatch({
                    action: globalAction.setProductMetricsDocument,
                    payload: metricsDocumentResult.val
                        .safeUnwrap() as ProductMetricsDocument,
                });
            }

            if (metricsView === "repairs") {
                globalDispatch({
                    action: globalAction.setRepairMetricsDocument,
                    payload: metricsDocumentResult.val
                        .safeUnwrap() as RepairMetricsDocument,
                });
            }

            dashboardDispatch({
                action: dashboardAction.setIsLoading,
                payload: false,
            });

            return createSafeBoxResult({
                data: Some("Data fetched successfully"),
                kind: "success",
            });
        }

        dashboardFetchWorker?.postMessage(
            {
                metricsView,
                productMetricCategory,
                repairMetricCategory,
                requestInit,
                routesZodSchemaMapKey: "dashboard",
                storeLocation,
                url: cacheKey,
            },
        );

        return createSafeBoxResult({
            data: Some("Fetching data..."),
            kind: "success",
        });
    } catch (error) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createSafeBoxResult({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
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
): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema:
                handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createSafeBoxResult({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
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
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeBoxResult({
                data: Some("No data in message event"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createSafeBoxResult({
                data: messageEventResult.val.data,
                message: messageEventResult.val.message,
            });
        }

        const {
            parsedServerResponse,
            decodedToken,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        } = messageEventResult.val.data.val;

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
            return createSafeBoxResult({
                data: Some("Logout triggered"),
            });
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
            showBoundary(setCachedItemResult.val);
            return createSafeBoxResult({
                data: Some("Unable to set cached item"),
            });
        }

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });

        return createSafeBoxResult({
            data: Some("Data fetched successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createSafeBoxResult({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

export {
    handleMessageEventStoreAndCategoryFetchWorkerToMain,
    handleStoreAndCategoryClicks,
};
