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
    SafeBoxResult,
} from "../../types";
import {
    createMetricsForageKey,
    createSafeBoxResult,
    decodeJWTSafe,
    fetchSafe,
    GetForageItemSafe,
    parseServerResponseAsyncSafe,
    responseToJSONSafe,
    SetForageItemSafe,
} from "../../utils";
import { MessageEventMetricsWorkerToMain } from "../../workers/metricsParseWorker";
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

    const storeLocationQuery = `&storeLocation[$eq]=${storeLocation}`;

    const metricCategoryQuery = metricsView === "products"
        ? `&metricCategory[$eq]=${productMetricCategory}`
        : metricsView === "repairs"
        ? `&metricCategory[$eq]=${repairMetricCategory}`
        : "";

    const urlWithQuery = new URL(
        `${metricsUrl}/${metricsView}/?${storeLocationQuery}${metricCategoryQuery}`,
    );

    dashboardDispatch({
        action: dashboardAction.setIsLoading,
        payload: true,
    });

    const forageKey = createMetricsForageKey({
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        storeLocation,
    });

    try {
        const metricsDocumentResult = await getForageItemSafe<
            BusinessMetricsDocument
        >(forageKey);

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
                url: urlWithQuery.toString(),
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

async function handleStoreAndCategoryClicksOnmessageCallback(
    {
        authDispatch,
        dashboardDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        navigateFn,
        setForageItemSafe,
        showBoundary,
    }: {
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        event: MessageEventMetricsWorkerToMain;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
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
            "handleStoreAndCategoryClicksOnmessageCallback dataUnwrapped",
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

        console.log(
            "handleStoreAndCategoryClicksOnmessageCallback",
            {
                metricsView,
                productMetricCategory,
                repairMetricCategory,
                storeLocation,
            },
        );

        const forageKey = createMetricsForageKey({
            metricsView,
            productMetricCategory,
            repairMetricCategory,
            storeLocation,
        });

        console.log({ forageKey });

        const setForageItemResult = await setForageItemSafe<
            BusinessMetricsDocument
        >(
            forageKey,
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

async function handleStoreCategoryClick(
    {
        accessToken,
        authDispatch,
        dashboardDispatch,
        fetchAbortControllerRef,
        getForageItemSafe,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl,
        navigateFn,
        metricsView,
        productMetricCategory,
        repairMetricCategory,
        setForageItemSafe,
        showBoundary,
        storeLocation,
    }: {
        accessToken: string;
        authDispatch: React.Dispatch<AuthDispatch>;
        dashboardDispatch: React.Dispatch<DashboardDispatch>;
        fetchAbortControllerRef: React.RefObject<AbortController | null>;
        getForageItemSafe: GetForageItemSafe;
        globalDispatch: React.Dispatch<GlobalDispatch>;
        isComponentMountedRef: React.RefObject<boolean>;
        metricsUrl: string;
        metricsView: Lowercase<DashboardMetricsView>;
        navigateFn: NavigateFunction;
        productMetricCategory: ProductMetricCategory;
        repairMetricCategory: RepairMetricCategory;
        setForageItemSafe: SetForageItemSafe;
        showBoundary: (error: any) => void;
        storeLocation: AllStoreLocations;
    },
): Promise<
    SafeBoxResult<
        {
            newAccessToken: string;
            businessMetricsDocument: BusinessMetricsDocument;
        }
    >
> {
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

    const storeLocationQuery = `&storeLocation[$eq]=${storeLocation}`;

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
        storeLocation,
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
                    newAccessToken: "",
                    businessMetricsDocument: metricsDocument,
                },
                kind: "success",
            });
        }

        const responseResult = await fetchSafe(urlWithQuery, requestInit);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (responseResult.err) {
            showBoundary(responseResult.val.data);
            return createSafeBoxResult({
                message: responseResult.val.message ??
                    "Unable to fetch data",
            });
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;
        if (responseUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        const jsonResult = await responseToJSONSafe<
            HttpServerResponse<BusinessMetricsDocument>
        >(
            responseUnwrapped,
        );

        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (jsonResult.err) {
            showBoundary(jsonResult.val.data);
            return createSafeBoxResult({
                message: jsonResult.val.message ??
                    "Unable to parse response",
            });
        }

        const serverResponse = jsonResult.safeUnwrap().data;
        if (serverResponse === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "No data returned from server",
            });
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
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }
        if (parsedResult.err) {
            showBoundary(parsedResult.val.data);
            return createSafeBoxResult({
                message: parsedResult.val.message ??
                    "Unable to parse response",
            });
        }

        const parsedServerResponse = parsedResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            showBoundary(
                new Error("No data returned from server"),
            );
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

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

        const decodedTokenResult = await decodeJWTSafe(newAccessToken);
        if (!isComponentMounted) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }
        if (decodedTokenResult.err) {
            showBoundary(decodedTokenResult.val.data);
            return createSafeBoxResult({
                message: decodedTokenResult.val.message ??
                    "Unable to decode token",
            });
        }

        const decodedToken = decodedTokenResult.safeUnwrap().data;
        if (decodedToken === undefined) {
            showBoundary(new Error("Invalid token"));
            return createSafeBoxResult({
                message: "Invalid token",
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

        const setForageItemResult = await setForageItemSafe<
            BusinessMetricsDocument
        >(
            forageKey,
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
    } catch (error: unknown) {
        if (
            !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
            return createSafeBoxResult({
                message: "Component unmounted or request aborted",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            message: (error as Error)?.message ?? "Unknown error",
        });
    }
}

export {
    handleStoreAndCategoryClicks,
    handleStoreAndCategoryClicksOnmessageCallback,
    handleStoreCategoryClick,
};
