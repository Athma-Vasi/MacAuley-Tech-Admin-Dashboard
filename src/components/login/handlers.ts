import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { LOGIN_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  FinancialMetricsDocument,
  ResultSafeBox,
  SafeBoxResult,
  UserDocument,
} from "../../types";
import {
  createMetricsURLCacheKey,
  createResultSafeBox,
  createSafeBoxResult,
  setCachedItemSafeAsync,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { loginAction } from "./actions";
import { LoginDispatch } from "./schemas";
import { LoginState } from "./types";

async function handleLoginClick({
  loginState,
  loginFetchWorker,
  loginDispatch,
  schema,
}: {
  loginState: LoginState;
  loginDispatch: React.Dispatch<LoginDispatch>;
  loginFetchWorker: Worker | null;
  schema: { username: string; password: string };
}): Promise<SafeBoxResult<boolean>> {
  const { isLoading, isSubmitting, isSuccessful } = loginState;

  if (loginFetchWorker === null) {
    return createSafeBoxResult({
      message: "Login worker not initialized",
    });
  }

  try {
    if (isLoading || isSubmitting || isSuccessful) {
      return createSafeBoxResult({
        message: "Login already in progress",
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
      data: true,
      kind: "success",
      message: "Login message sent",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
      message: "Error occurred during login",
    });
  }
}

async function handleMessageEventLoginFetchWorkerToMain(
  {
    authDispatch,
    event,
    globalDispatch,
    isComponentMountedRef,
    localforage,
    loginDispatch,
    metricsUrl,
    navigate,
    showBoundary,
  }: {
    authDispatch: React.Dispatch<AuthDispatch>;
    event: MessageEventFetchWorkerToMain<
      {
        userDocument: UserDocument;
        financialMetricsDocument: FinancialMetricsDocument;
      }
    >;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    localforage: LocalForage;
    loginDispatch: React.Dispatch<LoginDispatch>;
    metricsUrl: string;
    navigate: NavigateFunction;
    showBoundary: (error: unknown) => void;
  },
): Promise<ResultSafeBox<string>> {
  try {
    const messageEventResult = event.data;
    console.log("Login Worker received message:", event.data);

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult.val.data);
      return createResultSafeBox({
        data: Some("Error from worker"),
      });
    }

    console.log("event.data.val.data", event.data.val.data);

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

      return createResultSafeBox({
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
      return createResultSafeBox({
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

    const setCachedItemResult = await setCachedItemSafeAsync<
      FinancialMetricsDocument
    >(
      cacheKey,
      data[0].financialMetricsDocument,
    );

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }
    if (setCachedItemResult.err) {
      showBoundary(setCachedItemResult.val.data);
      return createResultSafeBox({
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

    return createResultSafeBox({
      data: Some("Login successful"),
      kind: "success",
    });
  } catch (error: unknown) {
    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    showBoundary(error);
    return createResultSafeBox({
      data: Some("Error occurred during login"),
    });
  }
}

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
