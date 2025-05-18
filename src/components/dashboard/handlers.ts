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
    createSafeBoxResult,
    GetCachedItemSafeAsync,
    SetCachedItemSafeAsync,
} from "../../utils";
import { MessageEventMetricsWorkerToMain } from "../../workers/metricsParseWorker";
import { dashboardAction } from "./actions";
import { ProductMetricCategory } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
import {
    AllStoreLocations,
    DashboardDispatch,
    DashboardMetricsView,
} from "./types";

async function handleStoreAndCategoryClicks(
    {
        accessToken,
        dashboardDispatch,
        dashboardFetchWorker,
        getCachedItemSafeAsync,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl,
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        showBoundary,
        storeLocation,
    }: {
        accessToken: string;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        dashboardFetchWorker: Worker | null;
        getCachedItemSafeAsync: GetCachedItemSafeAsync;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        metricsView: Lowercase<DashboardMetricsView>;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        showBoundary: (error: any) => void;
        storeLocation: AllStoreLocations;
    },
) {
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

    try {
        const metricsDocumentResult = await getCachedItemSafeAsync<
            BusinessMetricsDocument
        >(cacheKey);

        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult.val.data);
            return createSafeBoxResult({
                message: metricsDocumentResult.val.message ??
                    "Unable to get forage item",
            });
        }
        const unwrapped = metricsDocumentResult.safeUnwrap();
        const metricsDocument = unwrapped.data;

        if (
            unwrapped.kind === "success" && metricsDocument !== undefined
        ) {
            if (metricsView === "customers") {
                globalDispatch({
                    action: globalAction.setCustomerMetricsDocument,
                    payload: metricsDocument as CustomerMetricsDocument,
                });
            }

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

            return createSafeBoxResult({
                data: {
                    newAccessToken: accessToken,
                    businessMetricsDocument: metricsDocument,
                },
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
            data: true,
            kind: "success",
        });
    } catch (error) {
        if (
            !isComponentMountedRef.current
        ) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            message: (error as Error)?.message ?? "Unknown error",
        });
    }
}

async function handleMessageEventStoreAndCategoryFetchWorkerToMain(
    {
        authDispatch,
        dashboardDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl,
        navigateFn,
        setCachedItemSafeAsync,
        showBoundary,
    }: {
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        event: MessageEventMetricsWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        navigateFn: NavigateFunction;
        setCachedItemSafeAsync: SetCachedItemSafeAsync;
        showBoundary: (error: unknown) => void;
    },
): Promise<ResultSafeBox<string>> {
    try {
        const messageEventResult = event.data;
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
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

        const setForageItemResult = await setCachedItemSafeAsync<
            BusinessMetricsDocument
        >(
            cacheKey,
            payload,
        );
        if (setForageItemResult.err) {
            showBoundary(setForageItemResult.val.data);
            return createResultSafeBox({
                data: Some("Unable to set forage item"),
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
            !isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        showBoundary(error);
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
