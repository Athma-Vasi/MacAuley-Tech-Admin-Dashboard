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
  UserDocument,
} from "../../types";
import {
  createMetricsForageKey,
  createSafeBoxResult,
  decodeJWTSafe,
  fetchSafe,
  getForageItemSafe,
  parseServerResponseAsyncSafe,
  responseToJSONSafe,
  setForageItemSafe,
} from "../../utils";
import { customerMetricsDocumentZod } from "../dashboard/customer/schemas";
import { financialMetricsDocumentZod } from "../dashboard/financial/schemas";
import { productMetricsDocumentZod } from "../dashboard/product/schemas";
import { ProductMetricCategory } from "../dashboard/product/types";
import { repairMetricsDocumentZod } from "../dashboard/repair/schemas";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { DepartmentsWithDefaultKey } from "../directory/types";
import { userDocumentOptionalsZod } from "../usersQuery/schemas";
import {
  DirectoryMessageEvent,
  LogoutMessageEvent,
  MetricsMessageEvent,
} from "./types";
import { createDirectoryForageKey } from "./utils";

async function handleMetricCategoryOnmessageCallback({
  authDispatch,
  event,
  globalDispatch,
  isComponentMountedRef,
  navigate,
  productMetricCategory,
  repairMetricCategory,
  showBoundary,
  storeLocationView,
}: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: MetricsMessageEvent;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate: NavigateFunction;
  productMetricCategory: ProductMetricCategory;
  repairMetricCategory: RepairMetricCategory;
  showBoundary: (error: any) => void;
  storeLocationView: AllStoreLocations;
}) {
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

    const { metricsView = "financials", parsedServerResponse, decodedToken } =
      dataUnwrapped;
    const { accessToken: newAccessToken, triggerLogout, kind, message } =
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

    authDispatch({
      action: authAction.setAccessToken,
      payload: newAccessToken,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken,
    });

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createSafeBoxResult({
        message,
        kind: "error",
      });
    }

    console.group("handleMetricCategoryOnmessageCallback");
    console.log("Worker received message in useEffect:", event.data);
    console.log("event.data.val.data", event.data.val.data);
    console.log({ dataUnwrapped });
    console.log("metricsView", metricsView);
    console.groupEnd();

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

        const forageKey = createMetricsForageKey({
          metricsView,
          productMetricCategory,
          repairMetricCategory,
          storeLocationView,
        });

        await setForageItemSafe<BusinessMetricsDocument>(
          forageKey,
          payload,
        );
      },
    );

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate(`/dashboard/${metricsView}`);
    return createSafeBoxResult({
      data: {
        accessToken: newAccessToken,
        businessMetricsDocument: parsedServerResponse
          .data[0] as BusinessMetricsDocument,
      },
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
      message: "Unknown error",
    });
  }
}

async function handleMetricCategoryNavClick(
  {
    accessToken,
    metricsFetchWorker,
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
    metricsFetchWorker: Worker | null;
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
) {
  const requestInit: RequestInit = {
    method: "GET",
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

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
    const metricsDocumentResult = await getForageItemSafe<
      BusinessMetricsDocument
    >(forageKey);

    if (!isComponentMountedRef.current) {
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

    metricsFetchWorker?.postMessage({
      metricsView,
      requestInit,
      url: urlWithQuery.toString(),
      routesZodSchemaMapKey: metricsView === "products"
        ? "productMetrics"
        : metricsView === "repairs"
        ? "repairMetrics"
        : metricsView === "financials"
        ? "financialMetrics"
        : "customerMetrics",
    });

    return createSafeBoxResult({
      data: true,
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Unknown error",
    });
  }
}

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

  const forageKey = createMetricsForageKey({
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
    const metricsDocumentResult = await getForageItemSafe<
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

    const { accessToken: newAccessToken, triggerLogout, kind, message } =
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

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createSafeBoxResult({
        message,
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

        await setForageItemSafe<BusinessMetricsDocument>(
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

async function handleLogoutClick({
  accessToken,
  globalDispatch,
  logoutFetchWorker,
  logoutUrl,
}: {
  accessToken: string;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  logoutFetchWorker: Worker | null;
  logoutUrl: string;
}): Promise<SafeBoxResult<boolean>> {
  try {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: true,
    });

    logoutFetchWorker?.postMessage({
      requestInit,
      routesZodSchemaMapKey: "logout",
      skipTokenDecode: true,
      url: logoutUrl,
    });

    return createSafeBoxResult({
      data: true,
      kind: "success",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
      message: "Unknown error",
    });
  }
}

async function handleLogoutClickOnmessageCallback({
  event,
  globalDispatch,
  isComponentMountedRef,
  localforage,
  navigate,
  showBoundary,
}: {
  event: LogoutMessageEvent;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  localforage: LocalForage;
  navigate: NavigateFunction;
  showBoundary: (error: any) => void;
}): Promise<SafeBoxResult<HttpServerResponse<boolean>>> {
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

    const { parsedServerResponse } = dataUnwrapped;

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
      !isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        message: "Component unmounted",
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
    const parsedResult = await parseServerResponseAsyncSafe({
      object: serverResponse,
      zSchema: z.object({}),
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

async function handleDirectoryNavClick(
  {
    accessToken,
    department,
    directoryFetchWorker,
    directoryUrl,
    globalDispatch,
    storeLocation,
  }: {
    accessToken: string;
    department: DepartmentsWithDefaultKey;
    directoryFetchWorker: Worker | null;
    directoryUrl: string;
    globalDispatch: React.Dispatch<GlobalDispatch>;
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

  const urlWithQuery = department === "All Departments"
    ? new URL(
      `${directoryUrl}/user/?&limit=1000&newQueryFlag=true&totalDocuments=0`,
    )
    : new URL(
      `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=1000&newQueryFlag=true&totalDocuments=0`,
    );

  directoryFetchWorker?.postMessage({
    requestInit,
    url: urlWithQuery.toString(),
    routesZodSchemaMapKey: "directory",
  });

  return createSafeBoxResult({
    data: true,
    kind: "success",
  });
}

async function handleDirectoryOnmessageCallback({
  authDispatch,
  event,
  globalDispatch,
  isComponentMountedRef,
  navigate,
  showBoundary,
  toLocation = "/dashboard/directory",
}: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: DirectoryMessageEvent;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: any) => void;
  toLocation?: string;
}) {
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

    const { parsedServerResponse, decodedToken } = dataUnwrapped;

    const { accessToken: newAccessToken, triggerLogout, kind, message } =
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
      navigate?.("/");
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

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createSafeBoxResult({
        message,
        kind: "error",
      });
    }

    const userDocuments = parsedServerResponse.data;

    globalDispatch({
      action: globalAction.setDirectory,
      payload: userDocuments,
    });
    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate?.(toLocation);

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
      message: "Unknown error",
    });
  }
}

async function handleDirectoryClicks({
  accessToken,
  authDispatch,
  department,
  directoryUrl,
  fetchAbortControllerRef,
  globalDispatch,
  isComponentMountedRef,
  navigate,
  showBoundary,
  storeLocation,
  toLocation = "/dashboard/directory",
}: {
  accessToken: string;
  authDispatch: React.Dispatch<AuthDispatch>;
  department: DepartmentsWithDefaultKey;
  directoryUrl: string;
  fetchAbortControllerRef: React.RefObject<AbortController | null>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: any) => void;
  storeLocation: AllStoreLocations;
  toLocation?: string;
}): Promise<
  SafeBoxResult<{ newAccessToken: string; userDocuments: UserDocument[] }>
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

  const urlWithQuery = department === "All Departments"
    ? new URL(
      `${directoryUrl}/user/?&limit=1000&newQueryFlag=true&totalDocuments=0`,
    )
    : new URL(
      `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=1000&newQueryFlag=true&totalDocuments=0`,
    );

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  const directoryKey = createDirectoryForageKey(
    department,
    storeLocation,
  );

  try {
    const forageResult = await getForageItemSafe<UserDocument[]>(
      directoryKey,
    );
    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (forageResult.ok && forageResult.safeUnwrap().kind === "success") {
      const unwrappedData = forageResult.safeUnwrap().data;
      if (unwrappedData === undefined) {
        return createSafeBoxResult({
          message: "Data is undefined",
        });
      }

      globalDispatch({
        action: globalAction.setDirectory,
        payload: unwrappedData,
      });

      await setForageItemSafe<UserDocument[]>(
        directoryKey,
        unwrappedData,
      );

      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });

      navigate?.(toLocation);
      return createSafeBoxResult({
        data: {
          newAccessToken: accessToken,
          userDocuments: unwrappedData,
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
      HttpServerResponse<UserDocument>
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
    const parsedResult = await parseServerResponseAsyncSafe({
      object: serverResponse,
      zSchema: userDocumentOptionalsZod,
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

    const { accessToken: newAccessToken, triggerLogout, kind, message } =
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
      navigate?.("/");
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

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createSafeBoxResult({
        message,
        kind: "error",
      });
    }

    const userDocuments = parsedServerResponse.data;

    globalDispatch({
      action: globalAction.setDirectory,
      payload: userDocuments,
    });

    await setForageItemSafe<UserDocument[]>(
      directoryKey,
      userDocuments,
    );

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate?.(toLocation);
    return createSafeBoxResult({
      data: {
        newAccessToken,
        userDocuments,
      },
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMountedRef.current ||
      fetchAbortControllerRef.current?.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or fetch aborted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Unknown error",
    });
  }
}

export {
  handleDirectoryClicks,
  handleDirectoryNavClick,
  handleDirectoryOnmessageCallback,
  handleLogoutButtonClick,
  handleLogoutClick,
  handleLogoutClickOnmessageCallback,
  handleMetricCategoryNavClick,
  handleMetricCategoryNavlinkClick,
  handleMetricCategoryOnmessageCallback,
};
