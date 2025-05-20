import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { LOGIN_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  FinancialMetricsDocument,
  SafeBoxResult,
  UserDocument,
} from "../../types";
import {
  createMetricsURLCacheKey,
  createSafeBoxResult,
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
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  loginDispatch: React.Dispatch<LoginDispatch>;
  loginFetchWorker: Worker | null;
  schema: { username: string; password: string };
}): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleLoginClickInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const {
      isLoading,
      isSubmitting,
      isSuccessful,
      loginDispatch,
      loginFetchWorker,
      schema,
    } = parsedInputResult.val.data.val;

    if (isLoading || isSubmitting || isSuccessful) {
      return createSafeBoxResult({
        data: Some("Login already in progress"),
      });
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

    return createSafeBoxResult({
      data: Some("Login request sent"),
      kind: "success",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
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
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventLoginFetchWorkerToMainInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
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
    } = parsedInputResult.val.data.val;

    const messageEventResult = event.data;
    if (!messageEventResult) {
      return createSafeBoxResult({
        data: Some("No data in message event"),
      });
    }

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult.val.data);
      return createSafeBoxResult({
        data: Some("Error from worker"),
      });
    }

    if (messageEventResult.val.data.none) {
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

      return createSafeBoxResult({
        data: Some("Invalid credentials"),
      });
    }

    const { parsedServerResponse, decodedToken } =
      messageEventResult.val.data.val;
    const { accessToken, data, triggerLogout } = parsedServerResponse;

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
        data: Some("Logout triggered"),
      });
    }

    authDispatch({
      action: authAction.setAccessToken,
      payload: accessToken,
    });
    authDispatch({
      action: authAction.setDecodedToken,
      payload: decodedToken,
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
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }
    if (setCachedItemResult.err) {
      showBoundary(setCachedItemResult.val.data);
      return createSafeBoxResult({
        data: Some("Error setting cached item"),
      });
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

    return createSafeBoxResult({
      data: Some("Login successful"),
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !input.isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    input.showBoundary(error);
    return createSafeBoxResult({
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

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
