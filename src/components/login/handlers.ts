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
import { loginAction } from "./actions";
import { MessageEventLoginFetchWorkerToMain } from "./fetchWorker";
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
        "Session expired",
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

export { handleLoginClick, handleMessageEventLoginFetchWorkerToMain };
