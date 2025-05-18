import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { ResultSafeBox } from "../../types";
import { createResultSafeBox } from "../../utils";
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
): Promise<ResultSafeBox<string>> {
  if (!checkEmailWorker) {
    return createResultSafeBox({
      data: Some("Worker not initialized"),
    });
  }
  if (!email) {
    return createResultSafeBox({
      data: Some("Email is empty"),
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
    return createResultSafeBox({
      data: Some("Email is invalid"),
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

  checkEmailWorker.postMessage({
    requestInit,
    routesZodSchemaMapKey: "checkEmail",
    skipTokenDecode: true,
    url: urlWithQuery.toString(),
  });

  return createResultSafeBox({
    data: Some("Email is valid"),
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
): Promise<ResultSafeBox<string>> {
  try {
    const messageEventResult = event.data;
    console.log("Worker received message in useEffect:", event.data);

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createResultSafeBox({
        data: Some("Error from worker"),
      });
    }

    console.log("event.data.val.data", event.data.val.data);

    const { parsedServerResponse } = messageEventResult.val.data.val;

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
      return createResultSafeBox({
        data: Some(`Server error: ${message}`),
      });
    }

    const [isEmailExists] = data as unknown as [boolean];

    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });

    return createResultSafeBox({
      data: Some(isEmailExists.toString()),
      kind: "success",
    });
  } catch (error) {
    if (
      !isComponentMountedRef.current
    ) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    showBoundary(error);
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

async function handleCheckUsername(
  { checkUsernameWorker, registerDispatch, url, username }: {
    checkUsernameWorker: Worker | null;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    url: RequestInfo | URL;
    username: string;
  },
): Promise<ResultSafeBox<string>> {
  if (!checkUsernameWorker) {
    return createResultSafeBox({
      data: Some("Worker not initialized"),
    });
  }
  if (!username) {
    return createResultSafeBox({
      data: Some("Username is empty"),
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
    return createResultSafeBox({
      data: Some("Username is invalid"),
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

  checkUsernameWorker.postMessage({
    requestInit,
    routesZodSchemaMapKey: "checkUsername",
    skipTokenDecode: true,
    url: urlWithQuery.toString(),
  });

  return createResultSafeBox({
    data: Some("Username is valid"),
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
): Promise<ResultSafeBox<string>> {
  try {
    const messageEventResult = event.data;
    console.log("Worker received message in useEffect:", event.data);

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createResultSafeBox({
        data: Some("Error from worker"),
      });
    }

    console.log("event.data.val.data", event.data.val.data);

    const { parsedServerResponse } = messageEventResult.val.data.val;

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
      return createResultSafeBox({
        data: Some(`Server error: ${message}`),
      });
    }

    const [isUsernameExists] = data as unknown as [boolean];

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });

    return createResultSafeBox({
      data: Some(isUsernameExists.toString()),
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMountedRef.current
    ) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    showBoundary(error);
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
): Promise<ResultSafeBox<string>> {
  if (!registerWorker) {
    return createResultSafeBox({
      data: Some("Worker not initialized"),
    });
  }

  const requestInit: RequestInit = {
    body: formData,
    method: "POST",
    mode: "cors",
  };

  registerDispatch({
    action: registerAction.setIsSubmitting,
    payload: true,
  });

  registerWorker.postMessage({
    requestInit,
    routesZodSchemaMapKey: "register",
    skipTokenDecode: true,
    url: url.toString(),
  });

  return createResultSafeBox({
    data: Some("Registration request sent"),
    kind: "success",
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
): Promise<ResultSafeBox<string>> {
  try {
    const messageEventResult = event.data;
    console.log("Worker received message in useEffect:", event.data);

    if (!isComponentMountedRef.current) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createResultSafeBox({
        data: Some("Error from worker"),
      });
    }

    console.log("event.data.val.data", event.data.val.data);

    const { parsedServerResponse } = messageEventResult.val.data.val;

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

      return createResultSafeBox({
        data: Some(parsedServerResponse.message),
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

    return createResultSafeBox({
      data: Some("Registration successful"),
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !isComponentMountedRef.current
    ) {
      return createResultSafeBox({
        data: Some("Component unmounted"),
      });
    }

    showBoundary(error);
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
): ResultSafeBox<string> {
  try {
    if (activeStep === MAX_REGISTER_STEPS) {
      return createResultSafeBox({
        data: Some("Last step reached"),
      });
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

    return createResultSafeBox({
      data: Some("Step changed"),
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

export {
  handleCheckEmail,
  handleCheckUsername,
  handleMessageEventCheckEmailWorkerToMain,
  handleMessageEventCheckUsernameWorkerToMain,
  handleMessageEventRegisterFetchWorkerToMain,
  handlePrevNextStepClick,
  handleRegisterButtonSubmit,
};
