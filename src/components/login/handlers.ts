import { NavigateFunction } from "react-router-dom";
import { LOGIN_URL } from "../../constants";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  FinancialMetricsDocument,
  HttpServerResponse,
  SafeBoxResult,
  UserDocument,
} from "../../types";
import {
  createMetricsURLCacheKey,
  createSafeBoxResult,
  setForageItemSafe,
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
): Promise<
  SafeBoxResult<
    HttpServerResponse<
      {
        userDocument: UserDocument;
        financialMetricsDocument: FinancialMetricsDocument;
      }
    >
  >
> {
  try {
    console.log("Worker received message:", event.data);

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

    console.log("event.data.val.data", event.data.val.data);

    if (event.data.val.kind === "notFound") {
      loginDispatch({
        action: loginAction.setErrorMessage,
        payload: event.data.val.message ?? "Invalid credentials",
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
        kind: "notFound",
        message: event.data.val.message ?? "Invalid credentials",
      });
    }

    const dataUnwrapped = event.data.val.data;
    if (dataUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "Response is undefined",
      });
    }

    console.log({ dataUnwrapped });

    const { parsedServerResponse, decodedToken } = dataUnwrapped;
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
        message: "Logout triggered",
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

    const setForageItemResult = await setForageItemSafe<
      FinancialMetricsDocument
    >(
      cacheKey,
      data[0].financialMetricsDocument,
    );

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (setForageItemResult.err) {
      showBoundary(setForageItemResult.val.data);
      return createSafeBoxResult({
        message: setForageItemResult.val.message ?? "Error setting forage item",
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
      data: parsedServerResponse,
      kind: "success",
      message: "Login successful",
    });
  } catch (error: unknown) {
    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Error occurred during login",
    });
  }
}

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
