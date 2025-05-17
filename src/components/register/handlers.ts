import { NavigateFunction } from "react-router-dom";
import { createSafeBoxResult } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, STEPS_INPUTNAMES_MAP } from "./constants";
import { RegisterDispatch } from "./schemas";
import { RegisterState } from "./types";

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

async function handleMessageEventCheckEmailWorkerToMain<Data = unknown>(
  {
    event,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
  }: {
    event: MessageEventFetchWorkerToMain<Data>;
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
      payload: isEmailExists as boolean,
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

async function handleMessageEventCheckUsernameWorkerToMain<Data = unknown>(
  {
    event,
    isComponentMountedRef,
    registerDispatch,
    showBoundary,
  }: {
    event: MessageEventFetchWorkerToMain<Data>;
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

    const [isUsernameExists] = data;

    if (isUsernameExists === undefined) {
      showBoundary(new Error("No data returned from server"));
      return createSafeBoxResult({
        message: "No data returned from server",
      });
    }

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists as boolean,
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

async function handleRegisterButtonSubmit(
  {
    formData,
    registerDispatch,
    registerWorker,
    url,
  }: {
    formData: FormData;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerWorker: Worker | null;
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

  registerWorker?.postMessage({
    requestInit,
    routesZodSchemaMapKey: "register",
    skipTokenDecode: true,
    url: url.toString(),
  });
}

async function handleMessageEventRegisterFetchWorkerToMain<Data = unknown>(
  {
    event,
    isComponentMountedRef,
    navigate,
    registerDispatch,
    showBoundary,
    toLocation,
  }: {
    event: MessageEventFetchWorkerToMain<Data>;
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

      navigate("/login");

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
  handleCheckUsername,
  handleMessageEventCheckEmailWorkerToMain,
  handleMessageEventCheckUsernameWorkerToMain,
  handleMessageEventRegisterFetchWorkerToMain,
  handlePrevNextStepClick,
  handleRegisterButtonSubmit,
};
