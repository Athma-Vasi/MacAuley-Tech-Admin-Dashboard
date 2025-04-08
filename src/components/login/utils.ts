import { NavigateFunction } from "react-router-dom";
import { authAction } from "../../context/authProvider";
import { globalAction } from "../../context/globalProvider/actions";
import {
  DecodedToken,
  FinancialMetricsDocument,
  HttpServerResponse,
  UserDocument,
} from "../../types";
import { decodeJWTSafe, fetchSafe, responseToJSONSafe } from "../../utils";
import { loginAction } from "./actions";
import { AuthDispatch } from "../../context/authProvider/types";
import { GlobalDispatch } from "../../context/globalProvider/types";
import { LoginDispatch } from "./types";

async function handleLoginButtonClick(
  {
    authDispatch,
    fetchAbortControllerRef,
    globalDispatch,
    isComponentMountedRef,
    loginDispatch,
    navigateFn,
    navigateTo,
    schema,
    showBoundary,
    url,
  }: {
    authDispatch: React.Dispatch<AuthDispatch>;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    globalDispatch: React.Dispatch<GlobalDispatch>;
    isComponentMountedRef: React.RefObject<boolean>;
    loginDispatch: React.Dispatch<LoginDispatch>;
    navigateFn: NavigateFunction;
    navigateTo: string;
    schema: { username: string; password: string };
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
  },
) {
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
      return;
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return;
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;

    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
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
      return;
    }

    if (jsonResult.err) {
      showBoundary(jsonResult.val.data);
      return;
    }

    const serverResponse = jsonResult.safeUnwrap().data;

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    const { accessToken } = serverResponse;

    const decodedTokenResult = await decodeJWTSafe(accessToken);

    if (!isComponentMounted) {
      return;
    }

    if (decodedTokenResult.err) {
      showBoundary(decodedTokenResult.val.data);
      return;
    }

    const decodedToken = decodedTokenResult.safeUnwrap().data;
    if (decodedToken === undefined) {
      showBoundary(new Error("Invalid token"));
      return;
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
      payload: serverResponse.data[0].userDocument,
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: serverResponse.data[0].financialMetricsDocument,
    });

    loginDispatch({
      action: loginAction.setIsSubmitting,
      payload: false,
    });
    loginDispatch({
      action: loginAction.setIsSuccessful,
      payload: true,
    });

    navigateFn(navigateTo);
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController?.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

export { handleLoginButtonClick };
