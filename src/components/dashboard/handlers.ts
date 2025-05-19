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
    ResultSafeBox,
} from "../../types";
import {
    createMetricsURLCacheKey,
    createResultSafeBox,
    getCachedItemSafeAsync,
    parseSafeSync,
    setCachedItemSafeAsync,
} from "../../utils";
import { MessageEventMetricsWorkerToMain } from "../../workers/metricsParseWorker";
import { dashboardAction } from "./actions";
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
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleStoreAndCategoryClicksInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
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

        const metricsDocumentResult = await getCachedItemSafeAsync<
            BusinessMetricsDocument
        >(cacheKey);

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }
        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult.val.data);
            return createResultSafeBox({
                data: metricsDocumentResult.val.data,
                message: metricsDocumentResult.val.message,
            });
        }

        if (metricsDocumentResult.val.data.some) {
            if (metricsView === "customers") {
                globalDispatch({
                    action: globalAction.setCustomerMetricsDocument,
                    payload: metricsDocumentResult.val.data
                        .val as CustomerMetricsDocument,
                });
            }

            if (metricsView === "financials") {
                globalDispatch({
                    action: globalAction.setFinancialMetricsDocument,
                    payload: metricsDocumentResult.val.data
                        .val as FinancialMetricsDocument,
                });
            }

            if (metricsView === "products") {
                globalDispatch({
                    action: globalAction.setProductMetricsDocument,
                    payload: metricsDocumentResult.val.data
                        .val as ProductMetricsDocument,
                });
            }

            if (metricsView === "repairs") {
                globalDispatch({
                    action: globalAction.setRepairMetricsDocument,
                    payload: metricsDocumentResult.val.data
                        .val as RepairMetricsDocument,
                });
            }

            dashboardDispatch({
                action: dashboardAction.setIsLoading,
                payload: false,
            });

            return createResultSafeBox({
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

        return createResultSafeBox({
            data: Some("Fetching data..."),
            kind: "success",
        });
    } catch (error) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
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
        event: MessageEventMetricsWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        navigateFn: NavigateFunction;
        showBoundary: (error: unknown) => void;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema:
                handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
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
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createResultSafeBox({
                data: Some("No data in message event"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createResultSafeBox({
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
            return createResultSafeBox({
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

        const setCachedItemResult = await setCachedItemSafeAsync<
            BusinessMetricsDocument
        >(
            cacheKey,
            payload,
        );
        if (setCachedItemResult.err) {
            showBoundary(setCachedItemResult.val.data);
            return createResultSafeBox({
                data: Some("Unable to set cached item"),
            });
        }

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });

        return createResultSafeBox({
            data: Some("Data fetched successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createResultSafeBox({
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
