import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction, AuthDispatch } from "../../context/authProvider";
import { globalAction, GlobalDispatch } from "../../context/globalProvider";
import {
    BusinessMetricsDocument,
    CustomerMetricsDocument,
    FinancialMetricsDocument,
    HttpServerResponse,
    ProductMetricsDocument,
    RepairMetricsDocument,
} from "../../types";
import {
    createMetricsForageKey,
    decodeJWTSafe,
    fetchSafe,
    getForageItemSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
    setForageItemSafe,
} from "../../utils";
import { dashboardAction } from "./actions";
import { customerMetricsDocumentZod } from "./customer/schemas";
import { financialMetricsDocumentZod } from "./financial/schemas";
import { productMetricsDocumentZod } from "./product/schemas";
import { ProductMetricCategory } from "./product/types";
import { repairMetricsDocumentZod } from "./repair/schemas";
import { RepairMetricCategory } from "./repair/types";
import {
    AllStoreLocations,
    DashboardDispatch,
    DashboardMetricsView,
} from "./types";

async function handleStoreCategoryClick(
    {
        accessToken,
        authDispatch,
        dashboardDispatch,
        fetchAbortControllerRef,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl,
        navigateFn,
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        showBoundary,
        storeLocationView,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        fetchAbortControllerRef: React.RefObject<AbortController | null>;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        metricsView: Lowercase<DashboardMetricsView>;
        navigateFn: NavigateFunction;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        showBoundary: (error: any) => void;
        storeLocationView: AllStoreLocations;
    },
) {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    const requestInit: RequestInit = {
        method: "GET",
        signal: fetchAbortController.signal,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const storeLocationQuery = `&storeLocation[$eq]=${storeLocationView}`;

    const metricCategoryQuery = metricsView === "products"
        ? `&metricCategory[$eq]=${productMetricCategory}`
        : metricsView === "repairs"
        ? `&metricCategory[$eq]=${repairMetricCategory}`
        : "";

    const urlWithQuery = new URL(
        `${metricsUrl}/${metricsView}/?${storeLocationQuery}${metricCategoryQuery}`,
    );

    const forageKey = createMetricsForageKey({
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        storeLocationView,
    });

    dashboardDispatch({
        action: dashboardAction.setIsLoading,
        payload: true,
    });

    try {
        const metricsDocumentResult = await getForageItemSafe<
            BusinessMetricsDocument
        >(forageKey);

        if (metricsDocumentResult.err) {
            showBoundary(metricsDocumentResult.val.data);
            return;
        }
        const unwrapped = metricsDocumentResult.safeUnwrap();
        const metricsDocument = unwrapped.data;

        if (
            unwrapped.kind === "success"
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

            return;
        }

        const responseResult = await fetchSafe(urlWithQuery, requestInit);
        if (!isComponentMounted) {
            return;
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return;
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<BusinessMetricsDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return;
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
            showBoundary(new Error("No data returned from server"));
            return;
        }

        console.time("--PARSING--");
        const parsedResult = await parseServerResponseAsyncSafe({
            object: serverResponse,
            zSchema: metricsView === "customers"
                ? customerMetricsDocumentZod
                : metricsView === "financials"
                ? financialMetricsDocumentZod
                : metricsView === "products"
                ? productMetricsDocumentZod
                : repairMetricsDocumentZod,
        });
        console.timeEnd("--PARSING--");

        if (!isComponentMounted) {
            return;
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return;
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return;
        }

        const { accessToken, triggerLogout } = parsedServerResponse;

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
            return;
        }

        const decodedTokenResult = await decodeJWTSafe(accessToken);

        if (!isComponentMounted) {
            return;
        }

        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return;
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
            showBoundary(new Error("Invalid token"));
            return;
        }

        authDispatch({
            action: authAction.setAccessToken,
            payload: accessToken,
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

        await setForageItemSafe<BusinessMetricsDocument>(
            forageKey,
            payload,
        );

        dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
        });
    } catch (error: unknown) {
        if (
            !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
            return;
        }
        showBoundary(error);
    }
}

export { handleStoreCategoryClick };
