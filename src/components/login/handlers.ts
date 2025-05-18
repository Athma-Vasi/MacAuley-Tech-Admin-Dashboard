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
  ResultSafeBox,
  UserDocument,
} from "../../types";
import {
  createMetricsURLCacheKey,
  createResultSafeBox,
  parseSafeSync,
  setCachedItemSafeAsync,
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
}): Promise<ResultSafeBox<string>> {
  try {
    const parsedInputResult = parseSafeSync({
      object: input,
      zSchema: handleLoginClickInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createResultSafeBox({
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
      return createResultSafeBox({
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

    return createResultSafeBox({
      data: Some("Login request sent"),
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
    const parsedInputResult = parseSafeSync({
      object: input,
      zSchema: handleMessageEventLoginFetchWorkerToMainInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createResultSafeBox({
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
      return createResultSafeBox({
        data: Some("No data in message event"),
      });
    }

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

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
