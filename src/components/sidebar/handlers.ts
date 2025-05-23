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
  ProductMetricsDocument,
  RepairMetricsDocument,
  ResultSafeBox,
  UserDocument,
} from "../../types";
import {
  catchHandlerErrorSafe,
  createDirectoryURLCacheKey,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  getCachedItemAsyncSafe,
  parseSyncSafe,
  setCachedItemAsyncSafe,
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
    const parsedResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventMetricsFetchWorkerToMainInputZod,
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
      authDispatch,
      event,
      globalDispatch,
      isComponentMountedRef,
      metricsUrl,
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
      const safeErrorResult = createSafeErrorResult("No data found");
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const {
      metricsView,
      parsedServerResponse,
      decodedToken,
      productMetricCategory,
      repairMetricCategory,
      storeLocation,
    } = messageEventResult.val.val;
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
      return createSafeErrorResult("Logout triggered");
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
      return createSafeErrorResult(message);
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

        const setCachedItemResult = await setCachedItemAsyncSafe<
          BusinessMetricsDocument
        >(
          cacheKey,
          payload,
        );
        if (setCachedItemResult.err) {
          showBoundary(setCachedItemResult);
          return createSafeErrorResult("Error setting cached item");
        }
      },
    );

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
  } = parsedInputResult.val.val;

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
    const metricsDocumentResult = await getCachedItemAsyncSafe<
      BusinessMetricsDocument
    >(cacheKey);

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }
    if (metricsDocumentResult.err) {
      showBoundary(metricsDocumentResult.val);
      return metricsDocumentResult;
    }

    if (metricsDocumentResult.val.some) {
      if (metricsView === "customers") {
        globalDispatch({
          action: globalAction.setCustomerMetricsDocument,
          payload: metricsDocumentResult.val
            .val as CustomerMetricsDocument,
        });
      }

      if (metricsView === "financials") {
        globalDispatch({
          action: globalAction.setFinancialMetricsDocument,
          payload: metricsDocumentResult.val
            .val as FinancialMetricsDocument,
        });
      }

      if (metricsView === "products") {
        globalDispatch({
          action: globalAction.setProductMetricsDocument,
          payload: metricsDocumentResult.val
            .val as ProductMetricsDocument,
        });
      }

      if (metricsView === "repairs") {
        globalDispatch({
          action: globalAction.setRepairMetricsDocument,
          payload: metricsDocumentResult.val
            .val as RepairMetricsDocument,
        });
      }

      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });

      navigate(toLocation);

      return createSafeSuccessResult("Metrics fetch successful");
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
}): Promise<ResultSafeBox<string>> {
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
}): Promise<ResultSafeBox<string>> {
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
      const safeErrorResult = createSafeErrorResult("No data in input");
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
      const safeErrorResult = createSafeErrorResult("No data found");
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { parsedServerResponse } = messageEventResult.val.val;
    if (parsedServerResponse.kind === "error") {
      const safeErrorResult = createSafeErrorResult("Error in server response");
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
    navigate: NavigateFunction;
    showBoundary: (error: unknown) => void;
    storeLocation: AllStoreLocations;
    toLocation: string;
  },
): Promise<ResultSafeBox<string>> {
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
    department,
    directoryFetchWorker,
    directoryUrl,
    globalDispatch,
    isComponentMountedRef,
    navigate,
    showBoundary,
    storeLocation,
    toLocation,
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
    const userDocumentsResult = await getCachedItemAsyncSafe<
      UserDocument[]
    >(urlWithQuery.toString());

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }
    if (userDocumentsResult.err) {
      showBoundary(userDocumentsResult);
      return userDocumentsResult;
    }
    if (userDocumentsResult.val.some) {
      globalDispatch({
        action: globalAction.setDirectory,
        payload: userDocumentsResult.val.val as UserDocument[],
      });
      globalDispatch({
        action: globalAction.setIsFetching,
        payload: false,
      });
      navigate(toLocation);

      return createSafeSuccessResult(
        "Directory fetch successful",
      );
    }

    directoryFetchWorker?.postMessage({
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
  directoryUrl: string;
  event: MessageEventDirectoryFetchWorkerToMain;
  globalDispatch: React.Dispatch<GlobalDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  navigate?: NavigateFunction;
  showBoundary: (error: unknown) => void;
  toLocation?: string;
}): Promise<ResultSafeBox<string>> {
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
      directoryUrl,
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

    const { parsedServerResponse, decodedToken, department, storeLocation } =
      messageEventResult.val.val;

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
      return createSafeErrorResult("Logout triggered");
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
      const safeErrorResult = createSafeErrorResult(`Server error: ${message}`);
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const userDocuments = parsedServerResponse.data;
    const cacheKey = createDirectoryURLCacheKey({
      department,
      directoryUrl,
      storeLocation,
    });

    const setCachedItemResult = await setCachedItemAsyncSafe<UserDocument[]>(
      cacheKey,
      userDocuments,
    );
    if (setCachedItemResult.err) {
      showBoundary(setCachedItemResult);
      return createSafeErrorResult("Error setting cached item");
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
  handleMessageEventMetricsFetchWorkerToMain,
  handleMetricCategoryNavClick,
};
