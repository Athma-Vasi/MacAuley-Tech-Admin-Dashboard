import { NavigateFunction } from "react-router-dom";
import { z } from "zod";
import { HttpServerResponse, SafeBoxResult } from "../../types";
import {
  createSafeBoxResult,
  fetchSafe,
  parseServerResponseAsyncSafe,
  responseToJSONSafe,
} from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, STEPS_INPUTNAMES_MAP } from "./constants";
import { RegisterDispatch } from "./schemas";
import { CheckUsernameEmailMessageEvent, RegisterState } from "./types";

async function handleCheckEmail(
  { checkEmailWorker, email, registerDispatch, url }: {
    checkEmailWorker: Worker | null;
    email: string;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    url: RequestInfo | URL;
  },
) {
  if (!email) {
    return createSafeBoxResult({
      message: "Email is empty",
    });
  }

  const emailValidations = VALIDATION_FUNCTIONS_TABLE["email"];
  const isEmailValid = emailValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(email)
      : regExpOrFunc.test(email);
  });

  if (!isEmailValid) {
    return createSafeBoxResult({
      message: "Email is invalid",
    });
  }

  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  registerDispatch({
    action: registerAction.setIsEmailExistsSubmitting,
    payload: true,
  });

  const urlWithQuery = new URL(`${url}/check/?&email[$in]=${email}`);

  checkEmailWorker?.postMessage({
    requestInit,
    routesZodSchemaMapKey: "checkEmail",
    skipTokenDecode: true,
    url: urlWithQuery.toString(),
  });

  return createSafeBoxResult({
    data: true,
    kind: "success",
  });
}

async function handleCheckEmailOnmessageCallback(
  {
    event,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
  }: {
    event: CheckUsernameEmailMessageEvent;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
) {
  try {
    console.log("Worker received message in useEffect:", event.data);

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

    const dataUnwrapped = event.data.val.data;
    if (dataUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "Response is undefined",
      });
    }

    console.log({ dataUnwrapped });
    const { parsedServerResponse } = dataUnwrapped;

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
      return createSafeBoxResult({
        message: `Server error: ${message}`,
      });
    }

    const [isEmailExists] = data;

    if (isEmailExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });

    return createSafeBoxResult({
      data: isEmailExists,
      kind: "success",
    });
  } catch (error) {
    if (
      !isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
  }
}

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
): Promise<SafeBoxResult<boolean>> {
  if (!email) {
    return createSafeBoxResult({});
  }

  const emailValidations = VALIDATION_FUNCTIONS_TABLE["email"];
  const isEmailValid = emailValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(email)
      : regExpOrFunc.test(email);
  });

  if (!isEmailValid) {
    return createSafeBoxResult({});
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
      return createSafeBoxResult({ message: "Component unmounted" });
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return createSafeBoxResult({
        message: "Error fetching data",
      });
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;

    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<boolean>
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
        message: "Error parsing response",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const parsedResult = await parseServerResponseAsyncSafe({
      object: serverResponse,
      zSchema: z.boolean(),
    });

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return createSafeBoxResult({
        message: "Error parsing server response",
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
      return createSafeBoxResult({
        message: `Server error: ${message}`,
      });
    }

    const [isEmailExists] = data as unknown as boolean[];

    if (isEmailExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });

    return createSafeBoxResult({
      data: isEmailExists,
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or request aborted",
      });
    }
    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
  }
}

async function handleCheckUsername(
  { checkUsernameWorker, registerDispatch, url, username }: {
    checkUsernameWorker: Worker | null;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    url: RequestInfo | URL;
    username: string;
  },
) {
  if (!username) {
    return createSafeBoxResult({
      message: "Username is empty",
    });
  }

  const usernameValidations = VALIDATION_FUNCTIONS_TABLE["username"];
  const isUsernameValid = usernameValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(username)
      : regExpOrFunc.test(username);
  });

  if (!isUsernameValid) {
    return createSafeBoxResult({
      message: "Username is invalid",
    });
  }

  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  registerDispatch({
    action: registerAction.setIsUsernameExistsSubmitting,
    payload: true,
  });

  const urlWithQuery = new URL(`${url}/check/?&username[$in]=${username}`);

  checkUsernameWorker?.postMessage({
    requestInit,
    routesZodSchemaMapKey: "checkUsername",
    skipTokenDecode: true,
    url: urlWithQuery.toString(),
  });

  return createSafeBoxResult({
    data: true,
    kind: "success",
  });
}

async function handleCheckUsernameOnmessageCallback(
  {
    event,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
  }: {
    event: CheckUsernameEmailMessageEvent;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
) {
  try {
    console.log("Worker received message in useEffect:", event.data);

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

    const dataUnwrapped = event.data.val.data;
    if (dataUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "Response is undefined",
      });
    }

    console.log({ dataUnwrapped });
    const { parsedServerResponse } = dataUnwrapped;

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
      return createSafeBoxResult({
        message: `Server error: ${message}`,
      });
    }

    const [isUsernameExists] = data as unknown as boolean[];

    if (isUsernameExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });

    return createSafeBoxResult({
      data: isUsernameExists,
      kind: "success",
    });
  } catch (error) {
    if (
      !isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
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
): Promise<SafeBoxResult<boolean>> {
  if (!username) {
    return createSafeBoxResult({
      message: "Username is empty",
    });
  }

  const usernameValidations = VALIDATION_FUNCTIONS_TABLE["username"];
  const isUsernameValid = usernameValidations.every((validation) => {
    const [regExpOrFunc, _] = validation;

    return typeof regExpOrFunc === "function"
      ? regExpOrFunc(username)
      : regExpOrFunc.test(username);
  });

  if (!isUsernameValid) {
    return createSafeBoxResult({
      message: "Username is invalid",
    });
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
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return createSafeBoxResult({
        message: "Error fetching data",
      });
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;

    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<boolean>
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
        message: "Error parsing response",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const parsedResult = await parseServerResponseAsyncSafe({
      object: serverResponse,
      zSchema: z.boolean(),
    });

    if (!isComponentMounted) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    if (parsedResult.err) {
      showBoundary(parsedResult.val.data);
      return createSafeBoxResult({
        message: "Error parsing server response",
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
      return createSafeBoxResult({
        message: `Server error: ${message}`,
      });
    }

    const [isUsernameExists] = data as unknown as boolean[];

    if (isUsernameExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });

    return createSafeBoxResult({
      data: isUsernameExists,
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or request aborted",
      });
    }
    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
  }
}

async function handleRegisterButtonSubmit(
  {
    formData,
    registerDispatch,
    checkUsernameWorker,
    url,
  }: {
    formData: FormData;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    checkUsernameWorker: Worker | null;
    url: RequestInfo | URL;
  },
) {
  const requestInit: RequestInit = {
    body: formData,
    method: "POST",
    mode: "cors",
  };

  registerDispatch({
    action: registerAction.setIsSubmitting,
    payload: true,
  });

  checkUsernameWorker?.postMessage({
    requestInit,
    routesZodSchemaMapKey: "register",
    skipTokenDecode: true,
    url: url.toString(),
  });
}

async function handleRegisterButtonClickOnmessageCallback(
  {
    event,
    isComponentMountedRef,
    navigate,
    registerDispatch,
    showBoundary,
    toLocation,
  }: {
    event: MessageEvent;
    isComponentMountedRef: React.RefObject<boolean>;
    navigate: NavigateFunction;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    toLocation: string;
  },
) {
  try {
    console.log("Worker received message in useEffect:", event.data);

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

    const dataUnwrapped = event.data.val.data;
    if (dataUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "Response is undefined",
      });
    }

    console.log({ dataUnwrapped });
    const { parsedServerResponse } = dataUnwrapped;

    if (parsedServerResponse.kind === "error") {
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
        payload: parsedServerResponse.message,
      });

      navigate("/register");

      return createSafeBoxResult({
        message: parsedServerResponse.message ?? "Error",
      });
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

    navigate(toLocation);

    return createSafeBoxResult({
      data: parsedServerResponse.data,
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }
    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
  }
}

async function handleRegisterButtonClick(
  {
    fetchAbortControllerRef,
    formData,
    isComponentMountedRef,
    navigate,
    registerDispatch,
    showBoundary,
    toLocation,
    url,
  }: {
    fetchAbortControllerRef: React.RefObject<AbortController | null>;
    formData: FormData;
    isComponentMountedRef: React.RefObject<boolean>;
    navigate: NavigateFunction;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    toLocation: string;
    url: RequestInfo | URL;
  },
): Promise<SafeBoxResult<boolean[]>> {
  fetchAbortControllerRef.current?.abort("Previous request cancelled");
  fetchAbortControllerRef.current = new AbortController();
  const fetchAbortController = fetchAbortControllerRef.current;

  isComponentMountedRef.current = true;
  const isComponentMounted = isComponentMountedRef.current;

  const requestInit: RequestInit = {
    body: formData,
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
      return createSafeBoxResult({
        message: "Component unmounted",
      });
    }

    if (responseResult.err) {
      showBoundary(responseResult.val.data);
      return createSafeBoxResult({
        message: "Error fetching data",
      });
    }

    const responseUnwrapped = responseResult.safeUnwrap().data;

    if (responseUnwrapped === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    const jsonResult = await responseToJSONSafe<
      HttpServerResponse<boolean>
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
        message: "Error parsing response",
      });
    }

    const serverResponse = jsonResult.safeUnwrap().data;

    if (serverResponse === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
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
      navigate("/register");
      return createSafeBoxResult({
        message: serverResponse.message ?? "Error",
      });
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

    navigate(toLocation);
    return createSafeBoxResult({
      data: serverResponse.data,
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMounted || fetchAbortController.signal.aborted
    ) {
      return createSafeBoxResult({
        message: "Component unmounted or request aborted",
      });
    }

    showBoundary(error);
    return createSafeBoxResult({
      message: "Error fetching data",
    });
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

  const {
    stepInError,
    isStepWithEmptyInputs,
    inputsInError,
    inputsNotInError,
  } = stepInputNames
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
            acc.isStepWithEmptyInputs = true;

            // ignore empty inputs from validation error
            return acc;
          }

          return typeof regExpOrFunc === "function"
            ? regExpOrFunc(stateValue as string)
            : regExpOrFunc.test(stateValue as string);
        });

        if (isInputValid) {
          acc.inputsNotInError.add(inputName);
        } else {
          acc.inputsInError.add(inputName);
          acc.stepInError = true;
        }

        return acc;
      },
      {
        stepInError: false,
        isStepWithEmptyInputs: false,
        inputsInError: new Set<string>(),
        inputsNotInError: new Set<string>(),
      },
    );

  console.log({
    stepInError,
    isStepWithEmptyInputs,
    inputsInError,
    inputsNotInError,
  });

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
      kind: stepInError ? "add" : "delete",
      step: activeStep,
    },
  });

  registerDispatch({
    action: registerAction.setStepsWithEmptyInputs,
    payload: {
      kind: isStepWithEmptyInputs ? "add" : "delete",
      step: activeStep,
    },
  });

  registerDispatch({
    action: registerAction.setActiveStep,
    payload: kind === "next" ? activeStep + 1 : activeStep - 1,
  });
}

export {
  handleCheckEmail,
  handleCheckEmailExists,
  handleCheckEmailOnmessageCallback,
  handleCheckUsername,
  handleCheckUsernameExists,
  handleCheckUsernameOnmessageCallback,
  handlePrevNextStepClick,
  handleRegisterButtonClick,
  handleRegisterButtonClickOnmessageCallback,
  handleRegisterButtonSubmit,
};
