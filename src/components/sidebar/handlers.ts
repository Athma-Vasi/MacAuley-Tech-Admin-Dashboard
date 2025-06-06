import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
  SafeResult,
} from "../../types";
import {
  catchHandlerErrorSafe,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  makeTransition,
  parseSyncSafe,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { MessageEventDashboardCacheWorkerToMain } from "../dashboard/cacheWorker";
import { ProductMetricCategory } from "../dashboard/product/types";
import { RepairMetricCategory } from "../dashboard/repair/types";
import { AllStoreLocations, DashboardMetricsView } from "../dashboard/types";
import { MessageEventDirectoryFetchWorkerToMain } from "../directory/fetchWorker";
import { DepartmentsWithDefaultKey } from "../directory/types";
import { AuthError, InvariantError, UnknownError } from "../error";
import {
  handleDirectoryNavClickInputZod,
  handleLogoutClickInputZod,
  handleMessageEventDirectoryFetchWorkerToMainInputZod,
  handleMessageEventLogoutFetchWorkerToMainInputZod,
  handleMessageEventMetricsCacheWorkerToMainInputZod,
  handleMetricCategoryNavClickInputZod,
  triggerMessageEventDirectoryPrefetchAndCacheMainToWorkerInputZod,
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
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
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
      return createSafeErrorResult(
        new InvariantError("No data received from worker"),
      );
    }

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No data received from the worker"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const {
      metricsView,
      metricsDocument,
    } = messageEventResult.val.val;

    if (metricsView === "financials") {
      makeTransition(() => {
        globalDispatch({
          action: globalAction.setFinancialMetricsDocument,
          payload: metricsDocument as FinancialMetricsDocument,
        });
      });
    }

    if (metricsView === "products") {
      makeTransition(() => {
        globalDispatch({
          action: globalAction.setProductMetricsDocument,
          payload: metricsDocument as ProductMetricsDocument,
        });
      });
    }

    if (metricsView === "customers") {
      makeTransition(() => {
        globalDispatch({
          action: globalAction.setCustomerMetricsDocument,
          payload: metricsDocument as CustomerMetricsDocument,
        });
      });
    }

    if (metricsView === "repairs") {
      makeTransition(() => {
        globalDispatch({
          action: globalAction.setRepairMetricsDocument,
          payload: metricsDocument as RepairMetricsDocument,
        });
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
    const safeErrorResult = createSafeErrorResult(
      new InvariantError(
        "Unexpected None option in input parsing",
      ),
    );
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
      routesZodSchemaMapKey: metricsView,
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
    const safeErrorResult = createSafeErrorResult(
      new InvariantError(
        "Unexpected None option in input parsing",
      ),
    );
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
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
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
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }
    if (messageEventResult.err) {
      showBoundary(messageEventResult.val);
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No data received from worker"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe } = messageEventResult.val.val;
    if (responsePayloadSafe.kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        new UnknownError("Error in server response"),
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
    const safeErrorResult = createSafeErrorResult(
      new InvariantError(
        "Unexpected None option in input parsing",
      ),
    );
    input?.showBoundary?.(safeErrorResult);
    return safeErrorResult;
  }

  const {
    accessToken,
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
      `${directoryUrl}/user/?&limit=200&newQueryFlag=true&totalDocuments=0`,
    )
    : new URL(
      `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=200&newQueryFlag=true&totalDocuments=0`,
    );

  globalDispatch({
    action: globalAction.setIsFetching,
    payload: true,
  });

  try {
    directoryFetchWorker?.postMessage({
      requestInit,
      routesZodSchemaMapKey: "directory",
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
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
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
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }
    if (!messageEventResult) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No data received from worker"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }
    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No data received from worker"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { decodedToken, from, responsePayloadSafe } =
      messageEventResult.val.val;

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
        new AuthError(
          "Logout triggered",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    if (from === "cache") {
      makeTransition(() => {
        globalDispatch({
          action: globalAction.setDirectory,
          payload: responsePayloadSafe.data,
        });
      });

      makeTransition(() => {
        globalDispatch({
          action: globalAction.setIsFetching,
          payload: false,
        });
      });

      navigate?.(toLocation ?? "/dashboard/directory");
      return createSafeSuccessResult(
        "Directory fetch successful from cache",
      );
    }

    if (newAccessToken.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Access token is missing in response payload",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }
    authDispatch({
      action: authAction.setAccessToken,
      payload: newAccessToken.val,
    });

    if (decodedToken.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Decoded token is missing in response payload",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken.val,
    });

    if (kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        new UnknownError(`Server error: ${message}`),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    makeTransition(() => {
      globalDispatch({
        action: globalAction.setDirectory,
        payload: responsePayloadSafe.data,
      });
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

async function triggerMessageEventDirectoryPrefetchAndCacheMainToWorker(
  input: {
    accessToken: string;
    department: DepartmentsWithDefaultKey;
    directoryUrl: string;
    isComponentMountedRef: React.RefObject<boolean>;
    prefetchAndCacheWorker: Worker | null;
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
  },
) {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: triggerMessageEventDirectoryPrefetchAndCacheMainToWorkerInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const {
      accessToken,
      department,
      directoryUrl,
      prefetchAndCacheWorker,
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
        `${directoryUrl}/user/?&limit=200&newQueryFlag=true&totalDocuments=0`,
      )
      : new URL(
        `${directoryUrl}/user/?&$and[storeLocation][$eq]=${storeLocation}&$and[department][$eq]=${department}&limit=200&newQueryFlag=true&totalDocuments=0`,
      );

    prefetchAndCacheWorker?.postMessage({
      requestInit,
      routesZodSchemaMapKey: "directory",
      url: urlWithQuery.toString(),
    });

    return createSafeSuccessResult(
      "Prefetch and cache data...",
    );
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
  triggerMessageEventDirectoryPrefetchAndCacheMainToWorker,
};
