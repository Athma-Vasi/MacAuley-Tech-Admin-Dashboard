import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { z } from "zod";
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
  createSafeBoxResult,
  decodeJWTSafe,
  fetchSafe,
  parseServerResponseAsyncSafe,
  responseToJSONSafe,
  setForageItemSafe,
} from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { financialMetricsDocumentZod } from "../dashboard/financial/schemas";
import { userDocumentOptionalsZod } from "../usersQuery/schemas";
import { loginAction } from "./actions";
import { LoginDispatch } from "./schemas";
import { LoginState } from "./types";

async function handleLoginButtonClick(
  {
    authDispatch,
    fetchAbortControllerRef,
    globalDispatch,
    isComponentMountedRef,
    loginDispatch,
    navigate,
    schema,
    showBoundary,
    toLocation,
    url,
  }: {
    authDispatch: React.Dispatch<AuthDispatch>;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    loginDispatch: React.Dispatch<LoginDispatch>;
    navigate: NavigateFunction;
    schema: { username: string; password: string };
    showBoundary: (error: unknown) => void;
    toLocation: string;
    url: RequestInfo | URL;
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
  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ schema }),
    signal: fetchAbortController.signal,
  };

  loginDispatch({
    action: loginAction.setIsSubmitting,
    payload: true,
  });

  try {
    const responseResult = await fetchSafe(url, requestInit);

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return createSafeBoxResult({
        message: responseResult.val.message ?? "Error fetching response",
      });
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;
    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "Response is undefined",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<
        {
          userDocument: UserDocument;
          financialMetricsDocument: FinancialMetricsDocument;
        }
      >
    >(
      responseUnwrapped,
    );

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (jsonResult.err) {
      showBoundary(jsonResult.val.data);
      return createSafeBoxResult({
        message: jsonResult.val.message ?? "Error parsing JSON",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;
    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    if (serverResponse.message === "User not found") {
      return createSafeBoxResult({
        kind: "notFound",
        message: "User not found",
        data: serverResponse,
      });
    }

    console.time("---parsing---");
    const parsedResult = await parseServerResponseAsyncSafe({
      object: serverResponse,
      zSchema: z.object({
        userDocument: userDocumentOptionalsZod,
        financialMetricsDocument: financialMetricsDocumentZod,
      }),
    });
    console.timeEnd("---parsing---");

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return createSafeBoxResult({
        message: parsedResult.val.message ?? "Error parsing server response",
      });
    }

    const parsedServerResponse = parsedResult.safeUnwrap().data;
    if (parsedServerResponse === undefined) {
      showBoundary(
        new Error("No data returned from server"),
      );
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const { accessToken, triggerLogout } = parsedServerResponse;

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

    const decodedTokenResult = await decodeJWTSafe(accessToken);

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (decodedTokenResult.err) {
      showBoundary(decodedTokenResult.val.data);
      return createSafeBoxResult({
        message: decodedTokenResult.val.message ?? "Error decoding token",
      });
    }

    const decodedToken = decodedTokenResult.safeUnwrap().data;
    if (decodedToken === undefined) {
      showBoundary(new Error("Invalid token"));
      return createSafeBoxResult({
        message: "Invalid token",
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
      payload: parsedServerResponse.data[0].userDocument,
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: parsedServerResponse.data[0].financialMetricsDocument,
    });

    await setForageItemSafe<
      FinancialMetricsDocument
    >(
      "financials/All Locations",
      parsedServerResponse.data[0].financialMetricsDocument,
    );

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    // if (setForageItemResult.err) {
    //   showBoundary(setForageItemResult.val.data);
    //   return createSafeBoxResult({
    //     message: setForageItemResult.val.message ?? "Error setting forage item",
    //   });
    // }

    loginDispatch({
      action: loginAction.setIsSubmitting,
      payload: false,
    });
    loginDispatch({
      action: loginAction.setIsSuccessful,
      payload: true,
    });

    navigate(toLocation);
    return createSafeBoxResult({
      data: parsedServerResponse,
      kind: "success",
      message: "Login successful",
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or request aborted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Error occurred during login",
    });
  }
}

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

async function loginOnmessageCallback(
  {
    authDispatch,
    event,
    globalDispatch,
    isComponentMountedRef,
    localforage,
    loginDispatch,
    navigate,
    showBoundary,
  }: {
    authDispatch: React.Dispatch<AuthDispatch>;
    event: MessageEventFetchWorkerToMain;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    localforage: LocalForage;
    loginDispatch: React.Dispatch<LoginDispatch>;
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

    await setForageItemSafe<
      FinancialMetricsDocument
    >(
      "financials/All Locations",
      data[0].financialMetricsDocument,
    );

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    // if (setForageItemResult.err) {
    //   showBoundary(setForageItemResult.val.data);
    //   return createSafeBoxResult({
    //     message: setForageItemResult.val.message ?? "Error setting forage item",
    //   });
    // }

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

export { handleLoginButtonClick, handleLoginClick, loginOnmessageCallback };
