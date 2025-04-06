import { registerAction } from "./actions";
import type { RegisterAction, RegisterDispatch, RegisterState } from "./types";

function registerReducer(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const reducer = registerReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const registerReducers = new Map<
  RegisterAction[keyof RegisterAction],
  (state: RegisterState, dispatch: RegisterDispatch) => RegisterState
>([
  [registerAction.setConfirmPassword, registerReducer_setConfirmPassword],
  [registerAction.setEmail, registerReducer_setEmail],
  [registerAction.setErrorMessage, registerReducer_setErrorMessage],
  [registerAction.setIsEmailExists, registerReducer_setIsEmailExists],
  [
    registerAction.setIsEmailExistsSubmitting,
    registerReducer_setIsEmailExistsSubmitting,
  ],
  [registerAction.setIsError, registerReducer_setIsError],
  [registerAction.setIsSubmitting, registerReducer_setIsSubmitting],
  [registerAction.setIsSuccessful, registerReducer_setIsSuccessful],
  [registerAction.setIsUsernameExists, registerReducer_setIsUsernameExists],
  [
    registerAction.setIsUsernameExistsSubmitting,
    registerReducer_setIsUsernameExistsSubmitting,
  ],
  [registerAction.setPassword, registerReducer_setPassword],
  [registerAction.setUsername, registerReducer_setUsername],
]);

function registerReducer_setConfirmPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, confirmPassword: dispatch.payload as string };
}
function registerReducer_setEmail(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, email: dispatch.payload as string };
}

function registerReducer_setErrorMessage(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, errorMessage: dispatch.payload as string };
}

function registerReducer_setIsEmailExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isEmailExists: dispatch.payload as boolean };
}

function registerReducer_setIsEmailExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isEmailExistsSubmitting: dispatch.payload as boolean };
}

function registerReducer_setIsError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isError: dispatch.payload as boolean };
}

function registerReducer_setIsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isSubmitting: dispatch.payload as boolean };
}

function registerReducer_setIsSuccessful(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isSuccessful: dispatch.payload as boolean };
}

function registerReducer_setIsUsernameExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isUsernameExists: dispatch.payload as boolean };
}

function registerReducer_setIsUsernameExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, isUsernameExistsSubmitting: dispatch.payload as boolean };
}

function registerReducer_setPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, password: dispatch.payload as string };
}

function registerReducer_setUsername(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, username: dispatch.payload as string };
}

export { registerReducer };
