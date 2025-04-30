import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { z } from "zod";
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
  SafeBoxResult,
} from "../../types";
import {
  createForageKey,
  createSafeBoxResult,
  decodeJWTSafe,
  fetchSafe,
  getItemForageSafe,
  parseServerResponseSafeAsync,
  responseToJSONSafe,
  setItemForageSafe,
} from "../../utils";
import { customerMetricsDocumentZod } from "../dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../dashboard/financial/schemas";
import { productMetricsDocumentZod } from "../dashboard/product/schemas";
import { ProductMetricCategory } from "../dashboard/product/types";
import { repairMetricsDocumentZod } from "../dashboard/repair/schemas";
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
    navigate,
    productMetricCategory,
    repairMetricCategory,
    showBoundary,
    storeLocationView,
    toLocation,
  }: {
    accessToken: string;
    authDispatch: React.Dispatch<AuthDispatch>;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    metricsUrl: string;
    metricsView: Lowercase<DashboardMetricsView>;
    navigate: NavigateFunction;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
    showBoundary: (error: any) => void;
    storeLocationView: AllStoreLocations;
    toLocation: string;
  },
): Promise<
  SafeBoxResult<{
    accessToken: string;
    businessMetricsDocument: BusinessMetricsDocument;
  }>
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

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    // if (metricsDocumentResult.err) {
    //   showBoundary(metricsDocumentResult.val.data);
    //   return createSafeBoxResult({
    //     message: metricsDocumentResult.val.message ?? "Error fetching response",
    //   });
    // }

    if (
      metricsDocumentResult.ok &&
      metricsDocumentResult.safeUnwrap().kind === "success"
    ) {
      if (metricsView === "customers") {
        globalDispatch({
          action: globalAction.setCustomerMetricsDocument,
          payload: metricsDocumentResult.safeUnwrap()
            .data as CustomerMetricsDocument,
        });
      }

      if (metricsView === "financials") {
        globalDispatch({
          action: globalAction.setFinancialMetricsDocument,
          payload: metricsDocumentResult.safeUnwrap()
            .data as FinancialMetricsDocument,
        });
      }

      if (metricsView === "products") {
        globalDispatch({
          action: globalAction.setProductMetricsDocument,
          payload: metricsDocumentResult.safeUnwrap()
            .data as ProductMetricsDocument,
        });
      }

      if (metricsView === "repairs") {
        globalDispatch({
          action: globalAction.setRepairMetricsDocument,
          payload: metricsDocumentResult.safeUnwrap()
            .data as RepairMetricsDocument,
        });
      }

      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });

      navigate(toLocation);

      return createSafeBoxResult({
        data: {
          accessToken,
          businessMetricsDocument: metricsDocumentResult.safeUnwrap()
            .data as BusinessMetricsDocument,
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
        message: responseResult.val.message ?? "Error fetching response",
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
        message: jsonResult.val.message ?? "Error parsing JSON",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;
    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    console.time("--parsing--");
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
    console.timeEnd("--parsing--");

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return createSafeBoxResult({
        message: parsedResult.val.message ?? "Error parsing response",
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

    const { accessToken: newAccessToken, triggerLogout, kind } =
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
      navigate("/");
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
        message: decodedTokenResult.val.message ?? "Error decoding JWT",
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

    if (serverResponse.kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${serverResponse.message}`,
        ),
      );
      return createSafeBoxResult({
        message: serverResponse.message,
        kind: "error",
      });
    }

    parsedServerResponse.data.forEach(
      async (payload: BusinessMetricsDocument) => {
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

        await setItemForageSafe<BusinessMetricsDocument>(
          forageKey,
          payload,
        );
      },
    );

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate(toLocation);
    return createSafeBoxResult({
      data: {
        accessToken: newAccessToken,
        businessMetricsDocument: parsedServerResponse
          .data[0] as BusinessMetricsDocument,
      },
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
      message: "Unknown error",
    });
  }
}

async function handleLogoutButtonClick({
  accessToken,
  fetchAbortControllerRef,
  globalDispatch,
  isComponentMountedRef,
  localforage,
  logoutUrl,
  navigate,
  showBoundary,
}: {
  accessToken: string;
  fetchAbortControllerRef: React.RefObject<AbortController | null>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  localforage: LocalForage;
  logoutUrl: string;
  navigate: NavigateFunction;
  showBoundary: (error: any) => void;
}): Promise<SafeBoxResult<HttpServerResponse>> {
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
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return createSafeBoxResult({
        message: responseResult.val.message ?? "Error fetching response",
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
      HttpServerResponse
    >(
      responseUnwrapped,
    );

    console.log("jsonResult", jsonResult);

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (jsonResult.err) {
      showBoundary(jsonResult.val.data);
      return createSafeBoxResult({
        message: jsonResult.val.message ?? "Error parsing JSON",
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
    const parsedResult = await parseServerResponseSafeAsync({
      object: serverResponse,
      zSchema: z.object({}),
    });
    console.timeEnd("--PARSING--");

    console.log("parsedResult", parsedResult);

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return createSafeBoxResult({
        message: parsedResult.val.message ?? "Error parsing response",
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

    if (parsedServerResponse.kind === "error") {
      showBoundary(new Error(parsedServerResponse.message));
      return createSafeBoxResult({
        message: parsedServerResponse.message,
        kind: "error",
      });
    }

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    await localforage.clear();
    navigate("/");
    return createSafeBoxResult({
      data: parsedServerResponse,
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
      message: "Unknown error",
    });
  }
}

export { handleLogoutButtonClick, handleMetricCategoryNavlinkClick };
