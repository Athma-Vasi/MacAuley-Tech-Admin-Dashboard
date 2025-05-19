import { SetStepInErrorPayload, StatesUS } from "../../types";
import { parseSafeSync } from "../../utils";
import { registerAction } from "./actions";
import {
  RegisterDispatch,
  setActiveStepRegisterDispatchZod,
  setAddressLineRegisterDispatchZod,
  setCheckEmailWorkerRegisterDispatchZod,
  setCheckUsernameWorkerRegisterDispatchZod,
  setCityRegisterDispatchZod,
  setConfirmPasswordRegisterDispatchZod,
  setCountryRegisterDispatchZod,
  setDepartmentRegisterDispatchZod,
  setEmailRegisterDispatchZod,
  setErrorMessageRegisterDispatchZod,
  setFilesInErrorRegisterRegisterDispatchZod,
  setFirstNameRegisterDispatchZod,
  setFormDataRegisterDispatchZod,
  setInputsInErrorRegisterDispatchZod,
  setIsEmailExistsRegisterDispatchZod,
  setIsEmailExistsSubmittingRegisterDispatchZod,
  setIsErrorRegisterDispatchZod,
  setIsSubmittingRegisterDispatchZod,
  setIsSuccessfulRegisterDispatchZod,
  setIsUsernameExistsRegisterDispatchZod,
  setIsUsernameExistsSubmittingRegisterDispatchZod,
  setJobPositionRegisterDispatchZod,
  setLastNameRegisterDispatchZod,
  setPasswordRegisterDispatchZod,
  setPostalCodeCanadaRegisterDispatchZod,
  setPostalCodeUSRegisterDispatchZod,
  setProfilePictureUrlRegisterDispatchZod,
  setProvinceRegisterDispatchZod,
  setRegisterWorkerRegisterDispatchZod,
  setStateRegisterDispatchZod,
  setStepsInErrorRegisterDispatchZod,
  setStepsWithEmptyInputsRegisterDispatchZod,
  setStoreLocationRegisterDispatchZod,
  setUsernameRegisterDispatchZod,
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
  [registerAction.setFilesInError, registerReducer_setFilesInError],
  [registerAction.setFirstName, registerReducer_setFirstName],
  [registerAction.setFormData, registerReducer_setFormData],
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
  [
    registerAction.setCheckUsernameWorker,
    registerReducer_setCheckUsernameWorker,
  ],
  [
    registerAction.setCheckEmailWorker,
    registerReducer_setCheckEmailWorker,
  ],
  [registerAction.setRegisterWorker, registerReducer_setRegisterWorker],
]);

function registerReducer_setInputsInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setInputsInErrorRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  const data = parsedResult.val.data.val.payload;
  if (data === undefined) {
    return state;
  }

  const { kind, name } = data;
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
    zSchema: setStepsWithEmptyInputsRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  const data = parsedResult.val.data.val.payload;
  if (data === undefined) {
    return state;
  }

  const { kind, step } = data;
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
    zSchema: setActiveStepRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, activeStep: parsedResult.val.data.val.payload };
}

function registerReducer_setStepsInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStepsInErrorRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  const { kind, step } = parsedResult.val.data.val
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
    zSchema: setDepartmentRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, department: parsedResult.val.data.val.payload };
}

function registerReducer_setFilesInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFilesInErrorRegisterRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  const { kind, name } = parsedResult.val.data.val.payload;
  const filesInError = new Map(state.filesInError);
  if (kind === "remove") {
    filesInError.delete(name);
  } else {
    filesInError.set(name, kind === "isError");
  }

  return { ...state, filesInError };
}

function registerReducer_setFirstName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFirstNameRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, firstName: parsedResult.val.data.val.payload };
}

function registerReducer_setFormData(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFormDataRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, formData: parsedResult.val.data.val.payload };
}

function registerReducer_setJobPosition(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setJobPositionRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, jobPosition: parsedResult.val.data.val.payload };
}

function registerReducer_setLastName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setLastNameRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, lastName: parsedResult.val.data.val.payload };
}

function registerReducer_setProfilePictureUrl(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setProfilePictureUrlRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    profilePictureUrl: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setStoreLocation(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStoreLocationRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, storeLocation: parsedResult.val.data.val.payload };
}

function registerReducer_setAddressLine(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setAddressLineRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, addressLine: parsedResult.val.data.val.payload };
}

function registerReducer_setCity(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCityRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, city: parsedResult.val.data.val.payload };
}

function registerReducer_setCountry(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCountryRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, country: parsedResult.val.data.val.payload };
}

function registerReducer_setPostalCodeCanada(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPostalCodeCanadaRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    postalCodeCanada: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setPostalCodeUS(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPostalCodeUSRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, postalCodeUS: parsedResult.val.data.val.payload };
}

function registerReducer_setProvince(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setProvinceRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, province: parsedResult.val.data.val.payload };
}

function registerReducer_setState(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStateRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    state: parsedResult.val.data.val.payload as StatesUS,
  };
}

function registerReducer_setConfirmPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setConfirmPasswordRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, confirmPassword: parsedResult.val.data.val.payload };
}
function registerReducer_setEmail(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setEmailRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, email: parsedResult.val.data.val.payload };
}

function registerReducer_setErrorMessage(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setErrorMessageRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, errorMessage: parsedResult.val.data.val.payload };
}

function registerReducer_setIsEmailExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsEmailExistsRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, isEmailExists: parsedResult.val.data.val.payload };
}

function registerReducer_setIsEmailExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsEmailExistsSubmittingRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isEmailExistsSubmitting: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setIsError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsErrorRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, isError: parsedResult.val.data.val.payload };
}

function registerReducer_setIsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsSubmittingRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, isSubmitting: parsedResult.val.data.val.payload };
}

function registerReducer_setIsSuccessful(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsSuccessfulRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, isSuccessful: parsedResult.val.data.val.payload };
}

function registerReducer_setIsUsernameExists(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsUsernameExistsRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isUsernameExists: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setIsUsernameExistsSubmitting(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsUsernameExistsSubmittingRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isUsernameExistsSubmitting: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setPasswordRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, password: parsedResult.val.data.val.payload };
}

function registerReducer_setUsername(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setUsernameRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, username: parsedResult.val.data.val.payload };
}

function registerReducer_setCheckUsernameWorker(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCheckUsernameWorkerRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    checkUsernameWorker: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setCheckEmailWorker(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCheckEmailWorkerRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    checkEmailWorker: parsedResult.val.data.val.payload,
  };
}

function registerReducer_setRegisterWorker(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setRegisterWorkerRegisterDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return { ...state, registerWorker: parsedResult.val.data.val.payload };
}

export {
  registerReducer,
  registerReducer_setActiveStep,
  registerReducer_setAddressLine,
  registerReducer_setCheckEmailWorker,
  registerReducer_setCheckUsernameWorker,
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
  registerReducer_setRegisterWorker,
  registerReducer_setState,
  registerReducer_setStepsInError,
  registerReducer_setStepsWithEmptyInputs,
  registerReducer_setStoreLocation,
  registerReducer_setUsername,
};
