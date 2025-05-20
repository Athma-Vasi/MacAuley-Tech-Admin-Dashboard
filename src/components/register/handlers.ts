import { NavigateFunction } from "react-router-dom";
import { Some } from "ts-results";
import { SafeBoxResult } from "../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { registerAction } from "./actions";
import { MAX_REGISTER_STEPS, STEPS_INPUTNAMES_MAP } from "./constants";
import {
  handleCheckEmailInputZod,
  handleCheckUsernameInputZod,
  handleMessageEventCheckEmailWorkerToMainInputZod,
  handleMessageEventCheckUsernameWorkerToMainInputZod,
  handleMessageEventRegisterFetchWorkerToMainInputZod,
  handlePrevNextStepClickInputZod,
  handleRegisterButtonSubmitInputZod,
  RegisterDispatch,
} from "./schemas";
import { RegisterState } from "./types";

async function handleCheckEmail(
  input: {
    checkEmailWorker: Worker | null;
    email: string;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    url: RequestInfo | URL;
  },
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleCheckEmailInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const { checkEmailWorker, email, registerDispatch, url } =
      parsedInputResult.val.data.val;

    const emailValidations = VALIDATION_FUNCTIONS_TABLE["email"];
    const isEmailValid = emailValidations.every((validation) => {
      const [regExpOrFunc, _] = validation;

      return typeof regExpOrFunc === "function"
        ? regExpOrFunc(email)
        : regExpOrFunc.test(email);
    });

    if (!isEmailValid) {
      return createSafeBoxResult({
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

    checkEmailWorker?.postMessage({
      requestInit,
      routesZodSchemaMapKey: "checkEmail",
      skipTokenDecode: true,
      url: urlWithQuery.toString(),
    });

    return createSafeBoxResult({
      data: Some("Email is valid"),
      kind: "success",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
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

async function handleMessageEventCheckEmailWorkerToMain<Data = unknown>(
  input: {
    event: MessageEventFetchWorkerToMain<Data>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventCheckEmailWorkerToMainInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const { event, isComponentMountedRef, registerDispatch, showBoundary } =
      parsedInputResult.val.data.val;

    const messageEventResult = event.data;

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createSafeBoxResult({
        data: Some("Error from worker"),
      });
    }

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
      return createSafeBoxResult({
        data: Some(`Server error: ${message}`),
      });
    }

    const [isEmailExists] = data as unknown as [boolean];

    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });

    return createSafeBoxResult({
      data: Some(isEmailExists.toString()),
      kind: "success",
    });
  } catch (error) {
    if (
      !input.isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    input.showBoundary(error);
    return createSafeBoxResult({
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
  input: {
    checkUsernameWorker: Worker | null;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    url: RequestInfo | URL;
    username: string;
  },
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleCheckUsernameInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const { checkUsernameWorker, registerDispatch, url, username } =
      parsedInputResult.val.data.val;

    const usernameValidations = VALIDATION_FUNCTIONS_TABLE["username"];
    const isUsernameValid = usernameValidations.every((validation) => {
      const [regExpOrFunc, _] = validation;

      return typeof regExpOrFunc === "function"
        ? regExpOrFunc(username)
        : regExpOrFunc.test(username);
    });

    if (!isUsernameValid) {
      return createSafeBoxResult({
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

    checkUsernameWorker?.postMessage({
      requestInit,
      routesZodSchemaMapKey: "checkUsername",
      skipTokenDecode: true,
      url: urlWithQuery.toString(),
    });

    return createSafeBoxResult({
      data: Some("Username is valid"),
      kind: "success",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
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

async function handleMessageEventCheckUsernameWorkerToMain<Data = unknown>(
  input: {
    event: MessageEventFetchWorkerToMain<Data>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventCheckUsernameWorkerToMainInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const { event, isComponentMountedRef, registerDispatch, showBoundary } =
      parsedInputResult.val.data.val;

    const messageEventResult = event.data;

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createSafeBoxResult({
        data: Some("Error from worker"),
      });
    }

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
      return createSafeBoxResult({
        data: Some(`Server error: ${message}`),
      });
    }

    const [isUsernameExists] = data as unknown as [boolean];

    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });

    return createSafeBoxResult({
      data: Some(isUsernameExists.toString()),
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !input.isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    input.showBoundary(error);
    return createSafeBoxResult({
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
  input: {
    formData: FormData;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerWorker: Worker | null;
    url: RequestInfo | URL;
  },
): Promise<SafeBoxResult<string>> {
  const parsedInputResult = parseSyncSafe({
    object: input,
    zSchema: handleRegisterButtonSubmitInputZod,
  });
  if (parsedInputResult.err || parsedInputResult.val.data.none) {
    return createSafeBoxResult({
      data: parsedInputResult.val.data ?? Some("Error parsing input"),
    });
  }

  const { formData, registerDispatch, registerWorker, url } =
    parsedInputResult.val.data.val;

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

  return createSafeBoxResult({
    data: Some("Registration request sent"),
    kind: "success",
  });
}

async function handleMessageEventRegisterFetchWorkerToMain<Data = unknown>(
  input: {
    event: MessageEventFetchWorkerToMain<Data>;
    isComponentMountedRef: React.RefObject<boolean>;
    navigate: NavigateFunction;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    toLocation: string;
  },
): Promise<SafeBoxResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventRegisterFetchWorkerToMainInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const {
      event,
      isComponentMountedRef,
      navigate,
      registerDispatch,
      showBoundary,
      toLocation,
    } = parsedInputResult.val.data.val;

    const messageEventResult = event.data;

    if (!isComponentMountedRef.current) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    if (messageEventResult.err || messageEventResult.val.data.none) {
      showBoundary(messageEventResult.val.data);
      return createSafeBoxResult({
        data: Some("Error from worker"),
      });
    }

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

      return createSafeBoxResult({
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

    return createSafeBoxResult({
      data: Some("Registration successful"),
      kind: "success",
    });
  } catch (error: unknown) {
    if (
      !input.isComponentMountedRef.current
    ) {
      return createSafeBoxResult({
        data: Some("Component unmounted"),
      });
    }

    input.showBoundary(error);
    return createSafeBoxResult({
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
  input: {
    activeStep: number;
    kind: "previous" | "next";
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerState: RegisterState;
  },
): SafeBoxResult<string> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handlePrevNextStepClickInputZod,
    });
    if (parsedInputResult.err || parsedInputResult.val.data.none) {
      return createSafeBoxResult({
        data: parsedInputResult.val.data ?? Some("Error parsing input"),
      });
    }

    const { activeStep, kind, registerDispatch, registerState } =
      parsedInputResult.val.data.val;

    if (activeStep === MAX_REGISTER_STEPS) {
      return createSafeBoxResult({
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

    return createSafeBoxResult({
      data: Some("Step changed"),
      kind: "success",
    });
  } catch (error: unknown) {
    return createSafeBoxResult({
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
