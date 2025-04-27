import { SetStepInErrorPayload, StatesUS } from "../../types";
import { parseSafeSync } from "../../utils";
import { registerAction } from "./actions";
import {
  RegisterDispatch,
  setAddressLineDispatchZod,
  setCityDispatchZod,
  setConfirmPasswordDispatchZod,
  setCountryDispatchZod,
  setDepartmentDispatchZod,
  setEmailDispatchZod,
  setErrorMessageDispatchZod,
  setFirstNameDispatchZod,
  setInputsInErrorDispatchZod,
  setIsEmailExistsDispatchZod,
  setIsEmailExistsSubmittingDispatchZod,
  setIsErrorDispatchZod,
  setIsSubmittingDispatchZod,
  setIsSuccessfulDispatchZod,
  setIsUsernameExistsDispatchZod,
  setIsUsernameExistsSubmittingDispatchZod,
  setJobPositionDispatchZod,
  setLastNameDispatchZod,
  setPasswordDispatchZod,
  setPostalCodeCanadaDispatchZod,
  setPostalCodeUSDispatchZod,
  setProfilePictureUrlDispatchZod,
  setProvinceDispatchZod,
  setStateDispatchZod,
  setStepsInErrorDispatchZod,
  setStepsWithEmptyInputsDispatchZod,
  setStoreLocationDispatchZod,
  setUsernameDispatchZod,
} from "./schemas";
import type { RegisterAction, RegisterState } from "./types";

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
  [registerAction.setInputsInError, registerReducer_setInputsInError],
  [
    registerAction.setStepsWithEmptyInputs,
    registerReducer_setStepsWithEmptyInputs,
  ],
  [registerAction.setActiveStep, registerReducer_setActiveStep],
  [registerAction.setStepsInError, registerReducer_setStepsInError],
  [registerAction.setDepartment, registerReducer_setDepartment],
  [registerAction.setFirstName, registerReducer_setFirstName],
  [registerAction.setJobPosition, registerReducer_setJobPosition],
  [registerAction.setLastName, registerReducer_setLastName],
  [registerAction.setProfilePictureUrl, registerReducer_setProfilePictureUrl],
  [registerAction.setStoreLocation, registerReducer_setStoreLocation],
  [registerAction.setAddressLine, registerReducer_setAddressLine],
  [registerAction.setCity, registerReducer_setCity],
  [registerAction.setCountry, registerReducer_setCountry],
  [registerAction.setPostalCodeCanada, registerReducer_setPostalCodeCanada],
  [registerAction.setPostalCodeUS, registerReducer_setPostalCodeUS],
  [registerAction.setProvince, registerReducer_setProvince],
  [registerAction.setState, registerReducer_setState],
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

function registerReducer_setInputsInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setInputsInErrorDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  const { kind, name } = parsedResult.safeUnwrap().data.payload;
  const inputsInError = new Set(state.inputsInError);
  if (kind === "add") {
    inputsInError.add(name);
  }
  if (kind === "delete") {
    inputsInError.delete(name);
  }
  return { ...state, inputsInError };
}

function registerReducer_setStepsWithEmptyInputs(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStepsWithEmptyInputsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  const { kind, step } = parsedResult.safeUnwrap().data.payload;
  const stepsWithEmptyInputs = new Set(state.stepsWithEmptyInputs);
  if (kind === "add") {
    stepsWithEmptyInputs.add(step);
  }
  if (kind === "delete") {
    stepsWithEmptyInputs.delete(step);
  }
  return { ...state, stepsWithEmptyInputs };
}

function registerReducer_setActiveStep(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStepsWithEmptyInputsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, activeStep: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setStepsInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStepsInErrorDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  const { kind, step } = parsedResult.safeUnwrap().data
    .payload as SetStepInErrorPayload;
  const stepsInError = new Set(state.stepsInError);
  if (kind === "add") {
    stepsInError.add(step);
  }
  if (kind === "delete") {
    stepsInError.delete(step);
  }

  return { ...state, stepsInError };
}

function registerReducer_setDepartment(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setDepartmentDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, department: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setFirstName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFirstNameDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, firstName: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setJobPosition(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setJobPositionDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, jobPosition: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setLastName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setLastNameDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, lastName: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setProfilePictureUrl(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setProfilePictureUrlDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    profilePictureUrl: parsedResult.safeUnwrap().data.payload,
  };
}

function registerReducer_setStoreLocation(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStoreLocationDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, storeLocation: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setAddressLine(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setAddressLineDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, addressLine: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setCity(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCityDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, city: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setCountry(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCountryDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, country: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setPostalCodeCanada(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPostalCodeCanadaDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, postalCodeCanada: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setPostalCodeUS(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPostalCodeUSDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, postalCodeUS: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setProvince(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setProvinceDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, province: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setState(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStateDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    state: parsedResult.safeUnwrap().data.payload as StatesUS,
  };
}

function registerReducer_setConfirmPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setConfirmPasswordDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, confirmPassword: parsedResult.safeUnwrap().data.payload };
}
function registerReducer_setEmail(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setEmailDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, email: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setErrorMessage(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setErrorMessageDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, errorMessage: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsEmailExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsEmailExistsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, isEmailExists: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsEmailExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsEmailExistsSubmittingDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isEmailExistsSubmitting: parsedResult.safeUnwrap().data.payload,
  };
}

function registerReducer_setIsError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsErrorDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, isError: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsSubmittingDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, isSubmitting: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsSuccessful(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsSuccessfulDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, isSuccessful: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsUsernameExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsUsernameExistsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, isUsernameExists: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setIsUsernameExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsUsernameExistsSubmittingDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isUsernameExistsSubmitting: parsedResult.safeUnwrap().data.payload,
  };
}

function registerReducer_setPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPasswordDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, password: parsedResult.safeUnwrap().data.payload };
}

function registerReducer_setUsername(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setUsernameDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return { ...state, username: parsedResult.safeUnwrap().data.payload };
}

export {
  registerReducer,
  registerReducer_setActiveStep,
  registerReducer_setAddressLine,
  registerReducer_setCity,
  registerReducer_setConfirmPassword,
  registerReducer_setCountry,
  registerReducer_setDepartment,
  registerReducer_setEmail,
  registerReducer_setErrorMessage,
  registerReducer_setFirstName,
  registerReducer_setInputsInError,
  registerReducer_setIsEmailExists,
  registerReducer_setIsEmailExistsSubmitting,
  registerReducer_setIsError,
  registerReducer_setIsSubmitting,
  registerReducer_setIsSuccessful,
  registerReducer_setIsUsernameExists,
  registerReducer_setIsUsernameExistsSubmitting,
  registerReducer_setJobPosition,
  registerReducer_setLastName,
  registerReducer_setPassword,
  registerReducer_setPostalCodeCanada,
  registerReducer_setPostalCodeUS,
  registerReducer_setProfilePictureUrl,
  registerReducer_setProvince,
  registerReducer_setState,
  registerReducer_setStepsInError,
  registerReducer_setStepsWithEmptyInputs,
  registerReducer_setStoreLocation,
  registerReducer_setUsername,
};
