import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  BusinessMetricsDocument,
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
  ResultSafeBox,
  UserDocument,
} from "../../types";
import {
  createDirectoryURLCacheKey,
  createMetricsURLCacheKey,
  createResultSafeBox,
  getCachedItemSafeAsync,
  parseSafeSync,
  setCachedItemSafeAsync,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { MessageEventDashboardFetchWorkerToMain } from "../dashboard/fetchWorker";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { MessageEventDirectoryFetchWorkerToMain } from "../directory/fetchWorker";
import { DepartmentsWithDefaultKey } from "../directory/types";
import {
  handleDirectoryNavClickInputZod,
  handleLogoutClickInputZod,
  handleMessageEventDirectoryFetchWorkerToMainInputZod,
  handleMessageEventLogoutFetchWorkerToMainInputZod,
  handleMessageEventMetricsFetchWorkerToMainInputZod,
  handleMetricCategoryNavClickInputZod,
} from "./schemas";

async function handleMessageEventMetricsFetchWorkerToMain(input: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: MessageEventDashboardFetchWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  metricsUrl: string;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
  try {
    const parsedResult = parseSafeSync({
      object: input,
      zSchema: handleMessageEventMetricsFetchWorkerToMainInputZod,
    });
    if (parsedResult.err || parsedResult.val.data.none) {
      return createResultSafeBox({
        data: parsedResult.val.data ?? Some("Error parsing input"),
      });
    }

    const {
      authDispatch,
      event,
      globalDispatch,
      isComponentMountedRef,
      metricsUrl,
      navigate,
      showBoundary,
    } = parsedResult.val.data.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createResultSafeBox({
        data: Some("No data in message event"),
      });
    }

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
      metricsView,
      parsedServerResponse,
      decodedToken,
      productMetricCategory,
      repairMetricCategory,
      storeLocation,
    } = messageEventResult.val.data.val;
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

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createResultSafeBox({
        data: Some(message),
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

        const cacheKey = createMetricsURLCacheKey({
          metricsView,
          metricsUrl,
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
            data: Some(setCachedItemResult.val.data),
          });
        }
      },
    );

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate(`/dashboard/${metricsView}`);
    return createResultSafeBox({
      data: Some("Metrics fetch successful"),
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

async function handleMetricCategoryNavClick(
  input: {
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
): Promise<ResultSafeBox<string>> {
  const parsedInputResult = parseSafeSync({
    object: input,
    zSchema: handleMetricCategoryNavClickInputZod,
  });
  if (parsedInputResult.err || parsedInputResult.val.data.none) {
    return createResultSafeBox({
      data: parsedInputResult.val.data ?? Some("Error parsing input"),
    });
  }

  const {
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
  } = parsedInputResult.val.data.val;

  const requestInit: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const cacheKey = createMetricsURLCacheKey({
    metricsView,
    metricsUrl,
    productMetricCategory,
    repairMetricCategory,
    storeLocation,
  });

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
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
        message: metricsDocumentResult.val.message ??
          Some("Error fetching response"),
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
          payload: metricsDocumentResult.val.data.val as ProductMetricsDocument,
        });
      }

      if (metricsView === "repairs") {
        globalDispatch({
          action: globalAction.setRepairMetricsDocument,
          payload: metricsDocumentResult.val.data.val as RepairMetricsDocument,
        });
      }

      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });

      navigate(toLocation);

      return createResultSafeBox({
        data: Some("Metrics fetch successful"),
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
      url: cacheKey,
    });

    return createResultSafeBox({
      data: Some("Metrics fetch in progress"),
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

async function handleLogoutClick(input: {
  accessToken: string;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  logoutFetchWorker: Worker | null;
  logoutUrl: string;
}): Promise<ResultSafeBox<string>> {
  const parsedInputResult = parseSafeSync({
    object: input,
    zSchema: handleLogoutClickInputZod,
  });
  if (parsedInputResult.err || parsedInputResult.val.data.none) {
    return createResultSafeBox({
      data: parsedInputResult.val.data ?? Some("Error parsing input"),
    });
  }
  const { accessToken, globalDispatch, logoutFetchWorker, logoutUrl } =
    parsedInputResult.val.data.val;

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

    return createResultSafeBox({
      data: Some("Logout successful"),
      kind: "success",
    });
  } catch (error: unknown) {
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

async function handleMessageEventLogoutFetchWorkerToMain(input: {
  event: MessageEventFetchWorkerToMain<boolean>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
  try {
    const parsedResult = parseSafeSync({
      object: input,
      zSchema: handleMessageEventLogoutFetchWorkerToMainInputZod,
    });
    if (parsedResult.err || parsedResult.val.data.none) {
      return createResultSafeBox({
        data: parsedResult.val.data ?? Some("Error parsing input"),
      });
    }
    const {
      event,
      globalDispatch,
      isComponentMountedRef,
      navigate,
      showBoundary,
    } = parsedResult.val.data.val;

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

    const { parsedServerResponse } = messageEventResult.val.data.val;

    if (parsedServerResponse.kind === "error") {
      showBoundary(new Error(parsedServerResponse.message));
      return createResultSafeBox({
        data: Some(parsedServerResponse.message),
      });
    }

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    await localforage.clear();
    navigate("/");

    return createResultSafeBox({
      data: Some("Logout successful"),
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

async function handleDirectoryNavClick(
  input: {
    accessToken: string;
    department: DepartmentsWithDefaultKey;
    directoryFetchWorker: Worker | null;
    directoryUrl: string;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    navigate: NavigateFunction;
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
    toLocation: string;
  },
): Promise<ResultSafeBox<string>> {
  const parsedInputResult = parseSafeSync({
    object: input,
    zSchema: handleDirectoryNavClickInputZod,
  });
  if (parsedInputResult.err || parsedInputResult.val.data.none) {
    return createResultSafeBox({
      data: parsedInputResult.val.data ?? Some("Error parsing input"),
    });
  }

  const {
    accessToken,
    department,
    directoryFetchWorker,
    directoryUrl,
    globalDispatch,
    isComponentMountedRef,
    navigate,
    showBoundary,
    storeLocation,
    toLocation,
  } = parsedInputResult.val.data.val;

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

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
    const userDocumentsResult = await getCachedItemSafeAsync<
      UserDocument[]
    >(urlWithQuery.toString());

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }
    if (userDocumentsResult.err) {
      showBoundary(userDocumentsResult.val.data);
      return createResultSafeBox({
        data: userDocumentsResult.val.data,
        message: userDocumentsResult.val.message ??
          Some("Error fetching response"),
      });
    }

    if (userDocumentsResult.val.data.some) {
      globalDispatch({
        action: globalAction.setDirectory,
        payload: userDocumentsResult.val.data.val as UserDocument[],
      });

      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });

      navigate(toLocation);

      return createResultSafeBox({
        data: Some("Directory fetch successful"),
        kind: "success",
      });
    }

    directoryFetchWorker?.postMessage({
      department,
      requestInit,
      routesZodSchemaMapKey: "directory",
      storeLocation,
      url: urlWithQuery.toString(),
    });

    return createResultSafeBox({
      data: Some("Directory fetch in progress"),
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

async function handleMessageEventDirectoryFetchWorkerToMain(input: {
  authDispatch: React.Dispatch<AuthDispatch>;
  directoryUrl: string;
  event: MessageEventDirectoryFetchWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: unknown) => void;
  toLocation?: string;
}): Promise<ResultSafeBox<string>> {
  try {
    const parsedResult = parseSafeSync({
      object: input,
      zSchema: handleMessageEventDirectoryFetchWorkerToMainInputZod,
    });
    if (parsedResult.err || parsedResult.val.data.none) {
      return createResultSafeBox({
        data: parsedResult.val.data ?? Some("Error parsing input"),
      });
    }

    const {
      authDispatch,
      directoryUrl,
      event,
      globalDispatch,
      isComponentMountedRef,
      navigate,
      showBoundary,
      toLocation,
    } = parsedResult.val.data.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createResultSafeBox({
        data: Some("No data in message event"),
      });
    }

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

    const { parsedServerResponse, decodedToken, department, storeLocation } =
      messageEventResult.val.data.val;

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

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return createResultSafeBox({
        data: Some(message),
      });
    }

    const userDocuments = parsedServerResponse.data;

    const cacheKey = createDirectoryURLCacheKey({
      department,
      directoryUrl,
      storeLocation,
    });

    const setCachedItemResult = await setCachedItemSafeAsync<UserDocument[]>(
      cacheKey,
      userDocuments,
    );
    if (setCachedItemResult.err) {
      showBoundary(setCachedItemResult.val.data);
      return createResultSafeBox({
        data: setCachedItemResult.val.data,
        message: setCachedItemResult.val.message ??
          Some("Error fetching response"),
      });
    }

    globalDispatch({
      action: globalAction.setDirectory,
      payload: userDocuments,
    });
    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    navigate?.(toLocation ?? "/dashboard/directory");

    return createResultSafeBox({
      data: Some("Directory fetch successful"),
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
  handleDirectoryNavClick,
  handleLogoutClick,
  handleMessageEventDirectoryFetchWorkerToMain,
  handleMessageEventLogoutFetchWorkerToMain,
  handleMessageEventMetricsFetchWorkerToMain,
  handleMetricCategoryNavClick,
};
