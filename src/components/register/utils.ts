import { NavigateFunction } from "react-router-dom";
import { HttpServerResponse, UserDocument, UserSchema } from "../../types";
import { fetchSafe, responseToJSONSafe } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { registerAction } from "./actions";
import { RegisterDispatch } from "./types";

async function handleCheckEmailExists(
  {
    email,
    fetchAbortControllerRef,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
    url,
  }: {
    email: string;
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
  },
) {
  const emailValidations = VALIDATION_FUNCTIONS_TABLE["email"];
  const isEmailValid = emailValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(email)
      : regExpOrFunc.test(email);
  });

  if (!isEmailValid) {
    return;
  }

  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "cors",
    signal: fetchAbortController.signal,
  };

  registerDispatch({
    action: registerAction.setIsEmailExistsSubmitting,
    payload: true,
  });

  const urlWithQuery = new URL(`${url}/check/?&email[$in]=${email}`);

  try {
    const responseResult = await fetchSafe(
      urlWithQuery,
      requestInit,
    );

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
      HttpServerResponse<boolean>
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

    registerDispatch({
      action: registerAction.setIsEmailExistsSubmitting,
      payload: false,
    });

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    if (serverResponse.kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${serverResponse.message}`,
        ),
      );
      return;
    }

    const [isEmailExists] = serverResponse.data;

    if (isEmailExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

async function handleCheckUsernameExists(
  {
    fetchAbortControllerRef,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
    url,
    username,
  }: {
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
    username: string;
  },
) {
  const usernameValidations = VALIDATION_FUNCTIONS_TABLE["username"];
  const isUsernameValid = usernameValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(username)
      : regExpOrFunc.test(username);
  });

  if (!isUsernameValid) {
    return;
  }

  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "cors",
    signal: fetchAbortController.signal,
  };

  registerDispatch({
    action: registerAction.setIsUsernameExistsSubmitting,
    payload: true,
  });

  const urlWithQuery = new URL(`${url}/check/?&username[$in]=${username}`);

  try {
    const responseResult = await fetchSafe(
      urlWithQuery,
      requestInit,
    );

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
      HttpServerResponse<boolean>
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

    registerDispatch({
      action: registerAction.setIsUsernameExistsSubmitting,
      payload: false,
    });

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    if (serverResponse.kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${serverResponse.message}`,
        ),
      );
      return;
    }

    const [isUsernameExists] = serverResponse.data;

    if (isUsernameExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

async function handleRegisterButtonClick(
  {
    fetchAbortControllerRef,
    isComponentMountedRef,
    navigateFn,
    navigateTo,
    registerDispatch,
    schema,
    showBoundary,
    url,
  }: {
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    navigateFn: NavigateFunction;
    navigateTo: string;
    schema: UserSchema;
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
    body: JSON.stringify({ schema }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    mode: "cors",
    signal: fetchAbortController.signal,
  };

  registerDispatch({
    action: registerAction.setIsSubmitting,
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
      HttpServerResponse<UserDocument>
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

    if (serverResponse.kind === "error") {
      registerDispatch({
        action: registerAction.setIsSubmitting,
        payload: false,
      });
      registerDispatch({
        action: registerAction.setIsError,
        payload: true,
      });
      registerDispatch({
        action: registerAction.setErrorMessage,
        payload: serverResponse.message,
      });
      navigateFn("/register");
      return;
    }

    registerDispatch({
      action: registerAction.setIsSubmitting,
      payload: false,
    });
    registerDispatch({
      action: registerAction.setIsSuccessful,
      payload: true,
    });
    registerDispatch({
      action: registerAction.setIsError,
      payload: false,
    });
    registerDispatch({
      action: registerAction.setErrorMessage,
      payload: "",
    });

    navigateFn(navigateTo);
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return;
    }
    showBoundary(error);
  }
}

export {
  handleCheckEmailExists,
  handleCheckUsernameExists,
  handleRegisterButtonClick,
};
