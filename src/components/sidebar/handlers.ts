import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  BusinessMetricsDocument,
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  HttpServerResponse,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
import {
  createForageKey,
  decodeJWTSafe,
  fetchSafe,
  getItemForageSafe,
  responseToJSONSafe,
  setItemForageSafe,
} from "../../utils";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";

async function handleMetricCategoryNavlinkClick(
  {
    accessToken,
    authDispatch,
    fetchAbortControllerRef,
    globalDispatch,
    isComponentMountedRef,
    metricsUrl,
    metricsView,
    navigateFn,
    navigateTo,
    productMetricCategory,
    repairMetricCategory,
    showBoundary,
    storeLocationView,
  }: {
    accessToken: string;
    authDispatch: React.Dispatch<AuthDispatch>;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    metricsUrl: string;
    metricsView: Lowercase<DashboardMetricsView>;
    navigateFn: NavigateFunction;
    navigateTo: string;
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

  const forageKey = createForageKey({
    metricsView,
    productMetricCategory,
    repairMetricCategory,
    storeLocationView,
  });

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
    const metricsDocumentResult = await getItemForageSafe<
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

      globalDispatch({
        action: globalAction.setIsFetching,
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

    const { accessToken, triggerLogout } = serverResponse;

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

    console.group("fetchMetrics");
    console.log("serverResponse", serverResponse);
    console.groupEnd();

    authDispatch({
      action: authAction.setAccessToken,
      payload: accessToken,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken,
    });

    const payload = serverResponse.data[0];

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

    const setDocResult = await setItemForageSafe<BusinessMetricsDocument>(
      forageKey,
      payload,
    );

    if (setDocResult.err) {
      showBoundary(setDocResult.val.data);
      return;
    }

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigateFn(navigateTo);
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

async function handleLogoutButtonClick({
  accessToken,
  fetchAbortControllerRef,
  globalDispatch,
  isComponentMountedRef,
  logoutUrl,
  navigateFn,
  showBoundary,
}: {
  accessToken: string;
  fetchAbortControllerRef: React.RefObject<AbortController | null>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  logoutUrl: string;
  navigateFn: NavigateFunction;
  showBoundary: (error: any) => void;
}) {
  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    mode: "cors",
    signal: fetchAbortController.signal,
  };

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
    const responseResult = await fetchSafe(logoutUrl, requestInit);

    if (!isComponentMounted) {
      return;
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return;
    }

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    await localforage.clear();
    navigateFn("/");
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

export { handleLogoutButtonClick, handleMetricCategoryNavlinkClick };
