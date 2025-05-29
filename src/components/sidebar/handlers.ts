import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  CustomerMetricsDocument,
  DecodedToken,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
  SafeResult,
  UserDocument,
} from "../../types";
import {
  catchHandlerErrorSafe,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  getCachedItemAsyncSafe,
  parseSyncSafe,
  setCachedItemAsyncSafe,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { MessageEventDashboardCacheWorkerToMain } from "../dashboard/cacheWorker";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { MessageEventDirectoryFetchWorkerToMain } from "../directory/fetchWorker";
import { DepartmentsWithDefaultKey } from "../directory/types";
import { createDirectoryURLCacheKey } from "../directory/utils";
import {
  handleDirectoryNavClickInputZod,
  handleLogoutClickInputZod,
  handleMessageEventDirectoryFetchWorkerToMainInputZod,
  handleMessageEventLogoutFetchWorkerToMainInputZod,
  handleMessageEventMetricsCacheWorkerToMainInputZod,
  handleMetricCategoryNavClickInputZod,
} from "./schemas";

async function handleMessageEventMetricsCacheWorkerToMain(input: {
  event: MessageEventDashboardCacheWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
  try {
    const parsedResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventMetricsCacheWorkerToMainInputZod,
    });
    if (parsedResult.err) {
      input?.showBoundary?.(parsedResult);
      return parsedResult;
    }
    if (parsedResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        "No data in message event",
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const {
      event,
      globalDispatch,
      isComponentMountedRef,
      navigate,
      showBoundary,
    } = parsedResult.val.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult("No data in message event");
    }

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        "No data found",
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const {
      metricsView,
      metricsDocument,
    } = messageEventResult.val.val;

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

    if (metricsView === "customers") {
      globalDispatch({
        action: globalAction.setCustomerMetricsDocument,
        payload: metricsDocument as CustomerMetricsDocument,
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

    navigate(`/dashboard/${metricsView}`);
    return createSafeSuccessResult("Metrics fetch successful");
  } catch (error) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMetricCategoryNavClick(
  input: {
    metricsCacheWorker: Worker | null;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    metricsUrl: string;
    metricsView: Lowercase<DashboardMetricsView>;
    productMetricCategory: ProductMetricCategory;
    repairMetricCategory: RepairMetricCategory;
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
  },
): Promise<SafeResult<string>> {
  const parsedInputResult = parseSyncSafe({
    object: input,
    zSchema: handleMetricCategoryNavClickInputZod,
  });
  if (parsedInputResult.err) {
    input?.showBoundary?.(parsedInputResult);
    return parsedInputResult;
  }
  if (parsedInputResult.val.none) {
    const safeErrorResult = createSafeErrorResult("No data in input");
    input?.showBoundary?.(safeErrorResult);
    return safeErrorResult;
  }

  const {
    metricsCacheWorker,
    globalDispatch,
    metricsUrl,
    metricsView,
    productMetricCategory,
    repairMetricCategory,
    storeLocation,
  } = parsedInputResult.val.val;

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
    metricsCacheWorker?.postMessage({
      metricsView,
      routesZodSchemaMapKey: metricsView === "products"
        ? "productMetrics"
        : metricsView === "repairs"
        ? "repairMetrics"
        : metricsView === "financials"
        ? "financialMetrics"
        : "customerMetrics",
      cacheKey,
    });

    return createSafeSuccessResult("Metrics fetch in progress");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleLogoutClick(input: {
  accessToken: string;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  logoutFetchWorker: Worker | null;
  logoutUrl: string;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
  const parsedInputResult = parseSyncSafe({
    object: input,
    zSchema: handleLogoutClickInputZod,
  });
  if (parsedInputResult.err) {
    input?.showBoundary?.(parsedInputResult);
    return parsedInputResult;
  }
  if (parsedInputResult.val.none) {
    const safeErrorResult = createSafeErrorResult("No data in input");
    input?.showBoundary?.(safeErrorResult);
    return safeErrorResult;
  }

  const { accessToken, globalDispatch, logoutFetchWorker, logoutUrl } =
    parsedInputResult.val.val;

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

    return createSafeSuccessResult("Logout request sent");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventLogoutFetchWorkerToMain(input: {
  event: MessageEventFetchWorkerToMain<boolean>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate: NavigateFunction;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
  try {
    const parsedResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventLogoutFetchWorkerToMainInputZod,
    });
    if (parsedResult.err) {
      input?.showBoundary?.(parsedResult);
      return parsedResult;
    }
    if (parsedResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        "No data in input",
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const {
      event,
      globalDispatch,
      isComponentMountedRef,
      navigate,
      showBoundary,
    } = parsedResult.val.val;

    const messageEventResult = event.data;
    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }
    if (messageEventResult.err) {
      showBoundary(messageEventResult.val);
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        "No data found",
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe } = messageEventResult.val.val;
    if (responsePayloadSafe.kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        "Error in server response",
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });

    await localforage.clear();
    navigate("/");

    return createSafeSuccessResult("Logout successful");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleDirectoryNavClick(
  input: {
    accessToken: string;
    decodedToken: DecodedToken;
    department: DepartmentsWithDefaultKey;
    directoryFetchWorker: Worker | null;
    directoryUrl: string;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
  },
): Promise<SafeResult<string>> {
  const parsedInputResult = parseSyncSafe({
    object: input,
    zSchema: handleDirectoryNavClickInputZod,
  });
  if (parsedInputResult.err) {
    input?.showBoundary?.(parsedInputResult);
    return parsedInputResult;
  }
  if (parsedInputResult.val.none) {
    const safeErrorResult = createSafeErrorResult("No data in input");
    input?.showBoundary?.(safeErrorResult);
    return safeErrorResult;
  }

  const {
    accessToken,
    decodedToken,
    department,
    directoryFetchWorker,
    directoryUrl,
    globalDispatch,
    storeLocation,
  } = parsedInputResult.val.val;

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
    directoryFetchWorker?.postMessage({
      accessToken,
      decodedToken,
      department,
      requestInit,
      routesZodSchemaMapKey: "directory",
      storeLocation,
      url: urlWithQuery.toString(),
    });

    return createSafeSuccessResult(
      "Directory fetch in progress",
    );
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventDirectoryFetchWorkerToMain(input: {
  authDispatch: React.Dispatch<AuthDispatch>;
  event: MessageEventDirectoryFetchWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: unknown) => void;
  toLocation?: string;
}): Promise<SafeResult<string>> {
  try {
    const parsedResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventDirectoryFetchWorkerToMainInputZod,
    });
    if (parsedResult.err) {
      input?.showBoundary?.(parsedResult);
      return parsedResult;
    }
    if (parsedResult.val.none) {
      const safeErrorResult = createSafeErrorResult("No data in input");
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const {
      authDispatch,
      event,
      globalDispatch,
      isComponentMountedRef,
      navigate,
      showBoundary,
      toLocation,
    } = parsedResult.val.val;

    const messageEventResult = event.data;
    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }
    if (!messageEventResult) {
      const safeErrorResult = createSafeErrorResult(
        "No data in message event",
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }
    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult("No data found");
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe, decodedToken } = messageEventResult.val.val;

    const { accessToken: newAccessToken, triggerLogout, kind, message } =
      responsePayloadSafe;

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
      const safeErrorResult = createSafeErrorResult(
        "Logout triggered",
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    if (kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        `Server error: ${message}`,
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const userDocuments = responsePayloadSafe.data;

    authDispatch({
      action: authAction.setAccessToken,
      payload: newAccessToken.none ? "" : newAccessToken.val,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken,
    });

    globalDispatch({
      action: globalAction.setDirectory,
      payload: userDocuments,
    });
    globalDispatch({
      action: globalAction.setIsFetching,
      payload: false,
    });
    navigate?.(toLocation ?? "/dashboard/directory");

    return createSafeSuccessResult("Directory fetch successful");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

export {
  handleDirectoryNavClick,
  handleLogoutClick,
  handleMessageEventDirectoryFetchWorkerToMain,
  handleMessageEventLogoutFetchWorkerToMain,
  handleMessageEventMetricsCacheWorkerToMain,
  handleMetricCategoryNavClick,
};
