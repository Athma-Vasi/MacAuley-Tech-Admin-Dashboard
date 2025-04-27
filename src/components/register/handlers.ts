import { NavigateFunction } from "react-router-dom";
import { z } from "zod";
import { HttpServerResponse, UserDocument, UserSchema } from "../../types";
import {
  fetchSafe,
  parseServerResponseSafeAsync,
  responseToJSONSafe,
} from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE, ValidationKey } from "../../validations";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, STEPS_INPUTNAMES_MAP } from "./constants";
import { RegisterDispatch } from "./schemas";
import { RegisterState } from "./types";

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
  if (!email) {
    return;
  }

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

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    const parsedResult = await parseServerResponseSafeAsync({
      object: serverResponse,
      zSchema: z.boolean(),
    });

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

    registerDispatch({
      action: registerAction.setIsEmailExistsSubmitting,
      payload: false,
    });

    const { data, kind, message } = parsedServerResponse;

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return;
    }

    const [isEmailExists] = data as unknown as boolean[];

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
  if (!username) {
    return;
  }

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

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return;
    }

    const parsedResult = await parseServerResponseSafeAsync({
      object: serverResponse,
      zSchema: z.boolean(),
    });

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

    registerDispatch({
      action: registerAction.setIsUsernameExistsSubmitting,
      payload: false,
    });

    const { data, kind, message } = parsedServerResponse;

    if (kind === "error") {
      showBoundary(
        new Error(
          `Server error: ${message}`,
        ),
      );
      return;
    }

    const [isUsernameExists] = data as unknown as boolean[];

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

function handlePrevNextStepClick(
  {
    activeStep,
    kind,
    registerDispatch,
    registerState,
  }: {
    activeStep: number;
    kind: "previous" | "next";
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerState: RegisterState;
  },
) {
  if (activeStep === MAX_REGISTER_STEPS) {
    return;
  }

  const stepInputNames = STEPS_INPUTNAMES_MAP.get(activeStep) ??
    [];

  const [stepInError, isStepWithEmptyInputs, inputsInError, inputsNotInError] =
    stepInputNames
      .reduce(
        (acc, inputName) => {
          const inputValidation = VALIDATION_FUNCTIONS_TABLE[inputName];

          const isInputValid = inputValidation.every((validation) => {
            const [regExpOrFunc, _] = validation;
            const stateValue = Object.entries(registerState).find(([key]) =>
              key === inputName
            )?.[1] ?? "";
            if (stateValue === null || stateValue === undefined) {
              return acc;
            }

            if (
              typeof stateValue === "string" && stateValue?.length === 0
            ) {
              acc[1].add(true);

              // ignore empty inputs from validation error
              return acc;
            }

            return typeof regExpOrFunc === "function"
              ? regExpOrFunc(stateValue as string)
              : regExpOrFunc.test(stateValue as string);
          });

          if (!isInputValid) {
            acc[0].add(!isInputValid);
            acc[2].add(inputName);
          } else {
            acc[3].add(inputName);
          }

          return acc;
        },
        [
          new Set<boolean>(),
          new Set<boolean>(),
          new Set<ValidationKey>(),
          new Set<ValidationKey>(),
        ],
      );

  inputsInError.forEach((inputName) => {
    registerDispatch({
      action: registerAction.setInputsInError,
      payload: {
        kind: "add",
        name: inputName,
      },
    });
  });

  inputsNotInError.forEach((inputName) => {
    registerDispatch({
      action: registerAction.setInputsInError,
      payload: {
        kind: "delete",
        name: inputName,
      },
    });
  });

  registerDispatch({
    action: registerAction.setStepsInError,
    payload: {
      kind: stepInError.has(true) ? "add" : "delete",
      step: activeStep,
    },
  });

  registerDispatch({
    action: registerAction.setStepsWithEmptyInputs,
    payload: {
      kind: isStepWithEmptyInputs.has(true) ? "add" : "delete",
      step: activeStep,
    },
  });

  registerDispatch({
    action: registerAction.setActiveStep,
    payload: kind === "next" ? activeStep + 1 : activeStep - 1,
  });
}

export {
  handleCheckEmailExists,
  handleCheckUsernameExists,
  handlePrevNextStepClick,
  handleRegisterButtonClick,
};
