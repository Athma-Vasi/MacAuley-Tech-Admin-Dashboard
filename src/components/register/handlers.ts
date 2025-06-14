import { NavigateFunction } from "react-router-dom";
import { SafeResult } from "../../types";
import {
  catchHandlerErrorSafe,
  createSafeErrorResult,
  createSafeSuccessResult,
  makeTransition,
  parseSyncSafe,
} from "../../utils";
import { VALIDATION_FUNCTIONS_TABLE } from "../../validations";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import { InvariantError, UnknownError } from "../error";
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

function handleCheckEmail(
  input: {
    checkEmailWorker: Worker | null;
    email: string;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
  },
): SafeResult<string> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleCheckEmailInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { checkEmailWorker, email, registerDispatch, url } = parsedInputResult
      .val.val;

    const emailValidations = VALIDATION_FUNCTIONS_TABLE["email"];
    const isEmailValid = emailValidations.every((validation) => {
      const [regExpOrFunc, _] = validation;

      return typeof regExpOrFunc === "function"
        ? regExpOrFunc(email)
        : regExpOrFunc.test(email);
    });

    if (!isEmailValid) {
      return createSafeErrorResult(
        new InvariantError(
          "Email is invalid",
        ),
      );
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

    return createSafeSuccessResult("Email is valid");
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function handleMessageEventCheckEmailWorkerToMain(
  input: {
    event: MessageEventFetchWorkerToMain<boolean>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventCheckEmailWorkerToMainInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { event, isComponentMountedRef, registerDispatch, showBoundary } =
      parsedInputResult.val.val;
    const messageEventResult = event.data;
    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError(
          "Component unmounted",
        ),
      );
    }
    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }
    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in message event result",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe } = messageEventResult.val.val;

    registerDispatch({
      action: registerAction.setIsEmailExistsSubmitting,
      payload: false,
    });

    const { data, kind, message } = responsePayloadSafe;

    if (kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        new UnknownError(
          `Server error: ${message}`,
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    if (data.length === 0) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "No data received from the worker",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const [isEmailExists] = data;
    registerDispatch({
      action: registerAction.setIsEmailExists,
      payload: isEmailExists,
    });

    return createSafeSuccessResult("Email is valid");
  } catch (error) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

function handleCheckUsername(
  input: {
    checkUsernameWorker: Worker | null;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
    username: string;
  },
): SafeResult<string> {
  console.log(
    "handleCheckUsername called with input:",
    input,
  );
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleCheckUsernameInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { checkUsernameWorker, registerDispatch, url, username } =
      parsedInputResult.val.val;

    const usernameValidations = VALIDATION_FUNCTIONS_TABLE["username"];
    const isUsernameValid = usernameValidations.every((validation) => {
      const [regExpOrFunc, _] = validation;

      return typeof regExpOrFunc === "function"
        ? regExpOrFunc(username)
        : regExpOrFunc.test(username);
    });

    if (!isUsernameValid) {
      return createSafeErrorResult(
        new InvariantError(
          "Username is invalid",
        ),
      );
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

    return createSafeSuccessResult("Username is valid");
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function handleMessageEventCheckUsernameWorkerToMain(
  input: {
    event: MessageEventFetchWorkerToMain<boolean>;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventCheckUsernameWorkerToMainInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { event, isComponentMountedRef, registerDispatch, showBoundary } =
      parsedInputResult.val.val;

    const messageEventResult = event.data;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError(
          "Component unmounted",
        ),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in message event result",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe } = messageEventResult.val.val;

    registerDispatch({
      action: registerAction.setIsUsernameExistsSubmitting,
      payload: false,
    });

    const { data, kind, message } = responsePayloadSafe;

    if (kind === "error") {
      const safeErrorResult = createSafeErrorResult(
        new UnknownError(
          `Server error: ${message}`,
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    if (data.length === 0) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "No data received from the worker",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const [isUsernameExists] = data;
    registerDispatch({
      action: registerAction.setIsUsernameExists,
      payload: isUsernameExists,
    });

    return createSafeSuccessResult("Username is valid");
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

async function handleRegisterButtonSubmit(
  input: {
    formData: FormData;
    isComponentMountedRef: React.RefObject<boolean>;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerWorker: Worker | null;
    showBoundary: (error: unknown) => void;
    url: RequestInfo | URL;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleRegisterButtonSubmitInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { formData, registerDispatch, registerWorker, url } =
      parsedInputResult
        .val.val;

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

    return createSafeSuccessResult(
      "Registration request sent",
    );
  } catch (error: unknown) {
    return createSafeErrorResult(error);
  }
}

async function handleMessageEventRegisterFetchWorkerToMain(
  input: {
    event: MessageEventFetchWorkerToMain<boolean>;
    isComponentMountedRef: React.RefObject<boolean>;
    navigate: NavigateFunction;
    registerDispatch: React.Dispatch<RegisterDispatch>;
    showBoundary: (error: unknown) => void;
    toLocation: string;
  },
): Promise<SafeResult<string>> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handleMessageEventRegisterFetchWorkerToMainInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const {
      event,
      isComponentMountedRef,
      navigate,
      registerDispatch,
      showBoundary,
      toLocation,
    } = parsedInputResult.val.val;

    const messageEventResult = event.data;

    if (!isComponentMountedRef.current) {
      return createSafeErrorResult(
        new InvariantError(
          "Component unmounted",
        ),
      );
    }

    if (messageEventResult.err) {
      showBoundary(messageEventResult);
      return messageEventResult;
    }

    if (messageEventResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in message event result",
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const { responsePayloadSafe } = messageEventResult.val.val;

    if (responsePayloadSafe.kind === "error") {
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
        payload: responsePayloadSafe.message.none
          ? "Unable to register, please try again later."
          : responsePayloadSafe.message.val,
      });

      const safeErrorResult = createSafeErrorResult(
        new UnknownError(
          `Server error: ${responsePayloadSafe.message}`,
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
    }

    const [isRegistrationSuccessful] = responsePayloadSafe.data;
    if (!isRegistrationSuccessful) {
      const errorMessage = responsePayloadSafe.message.none
        ? "Unable to register, please try again later."
        : responsePayloadSafe.message.val;
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
        payload: errorMessage,
      });

      const safeErrorResult = createSafeErrorResult(
        new UnknownError(
          `Registration failed: ${errorMessage}`,
        ),
      );
      showBoundary(safeErrorResult);
      return safeErrorResult;
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

    return createSafeSuccessResult(
      "Registration successful",
    );
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
  }
}

function handlePrevNextStepClick(
  input: {
    activeStep: number;
    isComponentMountedRef: React.RefObject<boolean>;
    kind: "previous" | "next";
    registerDispatch: React.Dispatch<RegisterDispatch>;
    registerState: RegisterState;
    showBoundary: (error: unknown) => void;
  },
): SafeResult<string> {
  try {
    const parsedInputResult = parseSyncSafe({
      object: input,
      zSchema: handlePrevNextStepClickInputZod,
    });
    if (parsedInputResult.err) {
      input?.showBoundary?.(parsedInputResult);
      return parsedInputResult;
    }
    if (parsedInputResult.val.none) {
      const safeErrorResult = createSafeErrorResult(
        new InvariantError(
          "Unexpected None option in input parsing",
        ),
      );
      input?.showBoundary?.(safeErrorResult);
      return safeErrorResult;
    }

    const { activeStep, kind, registerDispatch, registerState } =
      parsedInputResult.val.val;

    if (activeStep === MAX_REGISTER_STEPS) {
      return createSafeErrorResult(
        new InvariantError(
          "Cannot go to next step, already at the last step",
        ),
      );
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

    makeTransition(() => {
      registerDispatch({
        action: registerAction.setActiveStep,
        payload: kind === "next" ? activeStep + 1 : activeStep - 1,
      });
    });

    return createSafeSuccessResult(
      `Step ${activeStep} ${kind === "next" ? "next" : "previous"} step`,
    );
  } catch (error: unknown) {
    return catchHandlerErrorSafe(
      error,
      input?.isComponentMountedRef,
      input?.showBoundary,
    );
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
