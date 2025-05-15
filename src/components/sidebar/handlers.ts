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
  SafeBoxResult,
  UserDocument,
} from "../../types";
import {
  createMetricsForageKey,
  createSafeBoxResult,
  getForageItemSafe,
  setForageItemSafe,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { MessageEventMetricsWorkerToMain } from "../../workers/metricsParseWorker";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { DepartmentsWithDefaultKey } from "../directory/types";

async function handleMessageEventMetricsFetchWorkerToMain({
  authDispatch,
  event,
  globalDispatch,
  isComponentMountedRef,
  navigate,
  showBoundary,
}: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: MessageEventMetricsWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
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

    const {
      metricsView,
      parsedServerResponse,
      decodedToken,
      productMetricCategory,
      repairMetricCategory,
      storeLocation,
    } = dataUnwrapped;
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
          storeLocation,
        });

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
              "Error setting forage item",
          });
        }
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
      message: error instanceof Error ? error.message : "Unknown error",
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
    storeLocation,
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
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
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
    if (metricsDocumentResult.err) {
      showBoundary(metricsDocumentResult.val.data);
      return createSafeBoxResult({
        message: metricsDocumentResult.val.message ?? "Error fetching response",
      });
    }

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
      productMetricCategory,
      repairMetricCategory,
      requestInit,
      routesZodSchemaMapKey: metricsView === "products"
        ? "productMetrics"
        : metricsView === "repairs"
        ? "repairMetrics"
        : metricsView === "financials"
        ? "financialMetrics"
        : "customerMetrics",
      storeLocation,
      url: urlWithQuery.toString(),
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
      message: error instanceof Error ? error.message : "Unknown error",
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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleMessageEventLogoutFetchWorkerToMain({
  event,
  globalDispatch,
  isComponentMountedRef,
  localforage,
  navigate,
  showBoundary,
}: {
  event: MessageEventFetchWorkerToMain<boolean>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  localforage: LocalForage;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleDirectoryNavClick(
  {
    accessToken,
    department,
    directoryFetchWorker,
    directoryUrl,
    storeLocation,
  }: {
    accessToken: string;
    department: DepartmentsWithDefaultKey;
    directoryFetchWorker: Worker | null;
    directoryUrl: string;
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

async function handleMessageEventDirectoryFetchWorkerToMain({
  authDispatch,
  event,
  globalDispatch,
  isComponentMountedRef,
  navigate,
  showBoundary,
  toLocation = "/dashboard/directory",
}: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: MessageEventFetchWorkerToMain<UserDocument>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: unknown) => void;
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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export {
  handleDirectoryNavClick,
  handleLogoutClick,
  handleMessageEventDirectoryFetchWorkerToMain,
  handleMessageEventLogoutFetchWorkerToMain,
  handleMessageEventMetricsFetchWorkerToMain,
  handleMetricCategoryNavClick,
};
