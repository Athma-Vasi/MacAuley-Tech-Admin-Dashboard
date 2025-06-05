import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { LOGIN_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import { SafeResult, UserDocument } from "../../types";
import {
  catchHandlerErrorSafe,
  createSafeErrorResult,
  createSafeSuccessResult,
  parseSyncSafe,
} from "../../utils";
import { MessageEventPrefetchAndCacheWorkerToMain } from "../../workers/prefetchAndCacheWorker";
import { MessageEventCustomerMetricsWorkerToMain } from "../dashboard/customer/metricsWorker";
import { MessageEventFinancialMetricsWorkerToMain } from "../dashboard/financial/metricsWorker";
import { MessageEventProductMetricsWorkerToMain } from "../dashboard/product/metricsWorker";
import { MessageEventRepairMetricsWorkerToMain } from "../dashboard/repair/metricsWorker";
import { AuthError, InvariantError } from "../error";
import { loginAction } from "./actions";
import { MessageEventLoginFetchWorkerToMain } from "./fetchWorker";
import {
  handleLoginClickInputZod,
  handleMessageEventCustomerMetricsWorkerToMainInputZod,
  handleMessageEventFinancialMetricsWorkerToMainInputZod,
  handleMessageEventLoginFetchWorkerToMainInputZod,
  handleMessageEventLoginPrefetchAndCacheWorkerToMainInputZod,
  handleMessageEventProductMetricsWorkerToMainInputZod,
  handleMessageEventRepairMetricsWorkerToMainInputZod,
  handleMessageEventTriggerPrefetchWorkerToMainInputZod,
  LoginDispatch,
} from "./schemas";

async function handleLoginClick(input: {
  isComponentMountedRef: React.RefObject<boolean>;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  loginDispatch: React.Dispatch<LoginDispatch>;
  loginFetchWorker: Worker | null;
  schema: { username: string; password: string };
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleLoginClickInputZod,
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
      isLoading,
      isSubmitting,
      isSuccessful,
      loginDispatch,
      loginFetchWorker,
      schema,
    } = parsedInputResult.val.val;

    if (isLoading || isSubmitting || isSuccessful) {
      return createSafeErrorResult(
        new InvariantError(
          "Login is already in progress or has been successful",
        ),
      );
    }

    loginDispatch({
      action: loginAction.setIsSubmitting,
      payload: true,
    });

    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schema }),
    };

    loginFetchWorker?.postMessage({
      requestInit,
      url: LOGIN_URL,
      routesZodSchemaMapKey: "login",
    });

    return createSafeSuccessResult("Login request sent");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function triggerMessageEventLoginPrefetchAndCacheMainToWorker(
  input: {
    isComponentMountedRef: React.RefObject<boolean>;
    isLoading: boolean;
    isSubmitting: boolean;
    isSuccessful: boolean;
    loginDispatch: React.Dispatch<LoginDispatch>;
    prefetchAndCacheWorker: Worker | null;
    schema: { username: string; password: string };
    showBoundary: (error: unknown) => void;
  },
) {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventTriggerPrefetchWorkerToMainInputZod,
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
      isLoading,
      isSubmitting,
      isSuccessful,
      loginDispatch,
      prefetchAndCacheWorker,
      schema,
    } = parsedInputResult.val.val;

    if (isLoading || isSubmitting || isSuccessful) {
      return createSafeErrorResult(
        new InvariantError("Already loading or submitting"),
      );
    }

    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schema }),
    };

    prefetchAndCacheWorker?.postMessage({
      requestInit,
      url: LOGIN_URL,
      routesZodSchemaMapKey: "login",
    });

    loginDispatch({
      action: loginAction.setIsLoading,
      payload: true,
    });

    return createSafeSuccessResult("Prefetch worker triggered");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventLoginPrefetchAndCacheWorkerToMain(
  input: {
    authDispatch: React.Dispatch<AuthDispatch>;
    event: MessageEventPrefetchAndCacheWorkerToMain;
    loginDispatch: React.Dispatch<LoginDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventLoginPrefetchAndCacheWorkerToMainInputZod,
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
      authDispatch,
      event,
      loginDispatch,
      isComponentMountedRef,
      showBoundary,
    } = parsedInputResult.val.val;
    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        "No data in message event",
      );
    }
    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError(
          "Component is not mounted",
        ),
      );
    }
    if (messageEventResult.err) {
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "No data received from the worker",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const {
      accessTokenOption,
      decodedTokenOption,
    } = messageEventResult.val.val;

    if (accessTokenOption.some) {
      authDispatch({
        action: authAction.setAccessToken,
        payload: accessTokenOption.val,
      });
    }
    if (decodedTokenOption.some) {
      authDispatch({
        action: authAction.setDecodedToken,
        payload: decodedTokenOption.val,
      });
    }

    loginDispatch({
      action: loginAction.setIsLoading,
      payload: false,
    });

    return createSafeSuccessResult(
      "User documents prefetched and cached successfully",
    );
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventLoginFetchWorkerToMain(
  input: {
    authDispatch: React.Dispatch<AuthDispatch>;
    event: MessageEventLoginFetchWorkerToMain<
      UserDocument
    >;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    loginDispatch: React.Dispatch<LoginDispatch>;
    navigate: NavigateFunction;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventLoginFetchWorkerToMainInputZod,
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
      authDispatch,
      event,
      globalDispatch,
      isComponentMountedRef,
      loginDispatch,
      navigate,
      showBoundary,
    } = parsedInputResult.val.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        new InvariantError(
          "No data in message event",
        ),
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
      loginDispatch({
        action: loginAction.setErrorMessage,
        payload: "Invalid credentials",
      });
      loginDispatch({
        action: loginAction.setIsSubmitting,
        payload: false,
      });
      loginDispatch({
        action: loginAction.setIsSuccessful,
        payload: false,
      });

      return createSafeErrorResult(
        new AuthError("Invalid credentials"),
      );
    }

    const { financialMetricsDocument, responsePayloadSafe, decodedToken } =
      messageEventResult.val.val;
    const { accessToken, data, triggerLogout } = responsePayloadSafe;

    if (triggerLogout || decodedToken.none) {
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
        new AuthError("Session expired"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    authDispatch({
      action: authAction.setAccessToken,
      payload: accessToken.none ? "" : accessToken.val,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken.val,
    });
    authDispatch({
      action: authAction.setIsLoggedIn,
      payload: true,
    });
    authDispatch({
      action: authAction.setUserDocument,
      payload: data[0],
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: financialMetricsDocument,
    });

    loginDispatch({
      action: loginAction.setIsSubmitting,
      payload: false,
    });
    loginDispatch({
      action: loginAction.setIsSuccessful,
      payload: true,
    });

    navigate("/dashboard/financials");

    return createSafeSuccessResult("Login successful");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventCustomerMetricsWorkerToMain(
  input: {
    event: MessageEventCustomerMetricsWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventCustomerMetricsWorkerToMainInputZod,
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
      event,
      isComponentMountedRef,
      showBoundary,
    } = parsedInputResult.val.val;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        new InvariantError("No data received from the worker"),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      return createSafeErrorResult(
        new InvariantError("No customer metrics data found"),
      );
    }

    return messageEventResult;
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventProductMetricsWorkerToMain(input: {
  event: MessageEventProductMetricsWorkerToMain;
  loginDispatch: React.Dispatch<LoginDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<boolean>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventProductMetricsWorkerToMainInputZod,
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
      event,
      loginDispatch,
      isComponentMountedRef,
      showBoundary,
    } = parsedInputResult.val.val;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError("Component unmounted"),
      );
    }

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        new InvariantError("No data received from the worker"),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No product metrics data found"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    loginDispatch({
      action: loginAction.setProductMetricsGenerated,
      payload: true,
    });

    return messageEventResult;
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventRepairMetricsWorkerToMain(input: {
  event: MessageEventRepairMetricsWorkerToMain;
  loginDispatch: React.Dispatch<LoginDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<boolean>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventRepairMetricsWorkerToMainInputZod,
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
      event,
      loginDispatch,
      isComponentMountedRef,
      showBoundary,
    } = parsedInputResult.val.val;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        new InvariantError("No data received from the worker"),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No repair metrics data found"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    loginDispatch({
      action: loginAction.setRepairMetricsGenerated,
      payload: true,
    });

    return messageEventResult;
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleMessageEventFinancialMetricsWorkerToMain(input: {
  event: MessageEventFinancialMetricsWorkerToMain;
  loginDispatch: React.Dispatch<LoginDispatch>;
  isComponentMountedRef: React.RefObject<boolean>;
  showBoundary: (error: unknown) => void;
}): Promise<SafeResult<boolean>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventFinancialMetricsWorkerToMainInputZod,
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
      event,
      loginDispatch,
      isComponentMountedRef,
      showBoundary,
    } = parsedInputResult.val.val;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError("Component is not mounted"),
      );
    }

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult(
        new InvariantError("No data received from the worker"),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError("No financial metrics data found"),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    loginDispatch({
      action: loginAction.setFinancialMetricsGenerated,
      payload: true,
    });

    return messageEventResult;
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

export {
  handleLoginClick,
  handleMessageEventCustomerMetricsWorkerToMain,
  handleMessageEventFinancialMetricsWorkerToMain,
  handleMessageEventLoginFetchWorkerToMain,
  handleMessageEventLoginPrefetchAndCacheWorkerToMain,
  handleMessageEventProductMetricsWorkerToMain,
  handleMessageEventRepairMetricsWorkerToMain,
  triggerMessageEventLoginPrefetchAndCacheMainToWorker,
};
