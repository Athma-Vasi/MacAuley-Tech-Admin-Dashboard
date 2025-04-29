import { NavigateFunction } from "react-router-dom";
import { vi } from "vitest";
import { AuthDispatch } from "../../context/authProvider";
import { GlobalDispatch } from "../../context/globalProvider";
import { createSafeBoxResult } from "../../utils";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { handleLoginMock } from "../testing/utils";
import { SafeBoxResult } from "../../types";
import { handleMetricCategoryNavlinkClick } from "./handlers";

async function handleMetricCategoryNavlinkClickTestMock(): Promise<
    SafeBoxResult<[]>
> {
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const metricsUrl = "https://example.com/metrics";
    const metricsView = "products" as Lowercase<DashboardMetricsView>;
    const navigate = vi.fn() as NavigateFunction;
    const toLocation = "/metrics";
    const productMetricCategory = "All Products";
    const repairMetricCategory = "All Repairs";
    const showBoundary = vi.fn() as (error: any) => void;
    const storeLocationView = "All Store Locations" as AllStoreLocations;

    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({
                message: loginResult.val.message ?? "Login failed",
            });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const handleMetricCategoryNavlinkClickResult =
            await handleMetricCategoryNavlinkClick({
                accessToken,
                authDispatch,
                fetchAbortControllerRef,
                globalDispatch,
                isComponentMountedRef,
                metricsUrl,
                metricsView,
                navigate,
                toLocation,
                productMetricCategory,
                repairMetricCategory,
                showBoundary,
                storeLocationView,
            });

        if (handleMetricCategoryNavlinkClickResult.err) {
            return createSafeBoxResult({
                message: handleMetricCategoryNavlinkClickResult.val.message,
            });
        }
    } catch (error) {
    }
}

/**
 * async function handleMetricCategoryNavlinkClick(
  {
    accessToken,
    authDispatch,
    fetchAbortControllerRef,
    globalDispatch,
    isComponentMountedRef,
    metricsUrl,
    metricsView,
    navigate,
    toLocation,
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
    navigate: NavigateFunction;
    toLocation: string;
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

      navigate(toLocation);
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
    const parsedResult = await parseServerResponseSafeAsync({
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
      navigate("/");
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

    navigate(toLocation);
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}
 */
