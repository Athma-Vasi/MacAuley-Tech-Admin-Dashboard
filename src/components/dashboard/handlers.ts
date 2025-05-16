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
} from "../../types";
import {
    createMetricsURLCacheKey,
    createSafeBoxResult,
    GetForageItemSafe,
    SetForageItemSafe,
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
        getForageItemSafe,
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
        getForageItemSafe: GetForageItemSafe;
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
        const metricsDocumentResult = await getForageItemSafe<
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
        setForageItemSafe,
        showBoundary,
    }: {
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        event: MessageEventMetricsWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        navigateFn: NavigateFunction;
        setForageItemSafe: SetForageItemSafe;
        showBoundary: (error: any) => void;
    },
) {
    try {
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (event.data.err) {
            showBoundary(event.data.val.data);
            return createSafeBoxResult({
                message: event.data.val.message ?? "Error fetching response",
            });
        }

        const dataUnwrapped = event.data.val.data;
        if (dataUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        console.log(
            "handleMessageEventStoreAndCategoryFetchWorkerToMain dataUnwrapped",
            {
                dataUnwrapped,
            },
        );

        const {
            parsedServerResponse,
            decodedToken,
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        } = dataUnwrapped;

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
                message: "Logout triggered",
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

        const setForageItemResult = await setForageItemSafe<
            BusinessMetricsDocument
        >(
            cacheKey,
            payload,
        );
        if (setForageItemResult.err) {
            showBoundary(setForageItemResult.val.data);
            return createSafeBoxResult({
                message: setForageItemResult.val.message ??
                    "Unable to set forage item",
            });
        }

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });

        return createSafeBoxResult({
            data: { newAccessToken, businessMetricsDocument: payload },
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

export {
    handleMessageEventStoreAndCategoryFetchWorkerToMain,
    handleStoreAndCategoryClicks,
};
