import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { LOGIN_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  FinancialMetricsDocument,
  ResultSafeBox,
  UserDocument,
} from "../../types";
import {
  catchHandlerErrorSafe,
  createMetricsURLCacheKey,
  createSafeErrorResult,
  createSafeSuccessResult,
  parseSyncSafe,
  setCachedItemAsyncSafe,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { loginAction } from "./actions";
import {
  handleLoginClickInputZod,
  handleMessageEventLoginFetchWorkerToMainInputZod,
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
}): Promise<ResultSafeBox<string>> {
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
        "Error parsing input",
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
      return createSafeErrorResult("Already loading or submitting");
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

async function handleMessageEventLoginFetchWorkerToMain(
  input: {
    authDispatch: React.Dispatch<AuthDispatch>;
    event: MessageEventFetchWorkerToMain<
      {
        userDocument: UserDocument;
        financialMetricsDocument: FinancialMetricsDocument;
      }
    >;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    loginDispatch: React.Dispatch<LoginDispatch>;
    metricsUrl: string;
    navigate: NavigateFunction;
    showBoundary: (error: unknown) => void;
  },
): Promise<ResultSafeBox<string>> {
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
        "Error parsing input",
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
      metricsUrl,
      navigate,
      showBoundary,
    } = parsedInputResult.val.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeErrorResult("No data received");
    }

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
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

      return createSafeErrorResult("Invalid credentials");
    }

    const { parsedServerResponse, decodedToken } = messageEventResult.val.val;
    const { accessToken, data, triggerLogout } = parsedServerResponse;

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
      navigate("/");
      return createSafeErrorResult("Session expired");
    }

    authDispatch({
      action: authAction.setAccessToken,
      payload: accessToken,
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
      payload: data[0].userDocument,
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: data[0].financialMetricsDocument,
    });

    const cacheKey = createMetricsURLCacheKey({
      metricsUrl,
      metricsView: "financials",
      productMetricCategory: "All Products",
      repairMetricCategory: "All Repairs",
      storeLocation: "All Locations",
    });

    const setCachedItemResult = await setCachedItemAsyncSafe<
      FinancialMetricsDocument
    >(
      cacheKey,
      data[0].financialMetricsDocument,
    );

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult("Component unmounted");
    }
    if (setCachedItemResult.err) {
      showBoundary(setCachedItemResult);
      return createSafeErrorResult("Error setting cached item");
    }

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

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
