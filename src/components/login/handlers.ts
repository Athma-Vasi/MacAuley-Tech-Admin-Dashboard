import localforage from "localforage";
import { NavigateFunction } from "react-router-dom";
import { z } from "zod";
import { authAction } from "../../context/authProvider";
import { AuthDispatch } from "../../context/authProvider/types";
import { globalAction } from "../../context/globalProvider/actions";
import { GlobalDispatch } from "../../context/globalProvider/types";
import {
  FinancialMetricsDocument,
  HttpServerResponse,
  UserDocument,
} from "../../types";
import {
  decodeJWTSafe,
  fetchSafe,
  parseServerResponseSafeAsync,
  responseToJSONSafe,
  setItemForageSafe,
} from "../../utils";
import { financialMetricsDocumentZod } from "../dashboard/financial/schemas";
import { userDocumentZ } from "../usersQuery/schemas";
import { loginAction } from "./actions";
import { LoginDispatch } from "./schemas";

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

    console.time("parsing");
    const parsedResult = await parseServerResponseSafeAsync({
      object: serverResponse,
      zSchema: z.object({
        userDocument: userDocumentZ,
        financialMetricsDocument: financialMetricsDocumentZod,
      }),
    });
    console.timeEnd("parsing");

    if (!isComponentMounted) {
      return;
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return;
    }

    const parsedServerResponse = parsedResult.safeUnwrap().data;
    if (parsedServerResponse === undefined) {
      showBoundary(
        new Error("No data returned from server"),
      );
      return;
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
      navigateFn("/");
      return;
    }

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
      payload: parsedServerResponse.data[0].userDocument,
    });

    globalDispatch({
      action: globalAction.setFinancialMetricsDocument,
      payload: parsedServerResponse.data[0].financialMetricsDocument,
    });

    const setForageItemResult = await setItemForageSafe<
      FinancialMetricsDocument
    >(
      "Financials-All Locations",
      parsedServerResponse.data[0].financialMetricsDocument,
    );

    if (!isComponentMounted) {
      return;
    }
    if (setForageItemResult.err) {
      showBoundary(setForageItemResult.val.data);
      return;
    }

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
