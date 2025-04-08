import {
  Country,
  Department,
  JobPosition,
  PostalCode,
  Province,
  StatesUS,
} from "../../types";
import { AllStoreLocations } from "../dashboard/types";
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
  [registerAction.setDepartment, registerReducer_setDepartment],
  [registerAction.setFirstName, registerReducer_setFirstName],
  [registerAction.setJobPosition, registerReducer_setJobPosition],
  [registerAction.setLastName, registerReducer_setLastName],
  [registerAction.setProfilePictureUrl, registerReducer_setProfilePictureUrl],
  [registerAction.setStoreLocation, registerReducer_setStoreLocation],
  [registerAction.setAddressLine, registerReducer_setAddressLine],
  [registerAction.setCity, registerReducer_setCity],
  [registerAction.setCountry, registerReducer_setCountry],
  [registerAction.setPostalCode, registerReducer_setPostalCode],
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

function registerReducer_setDepartment(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, department: dispatch.payload as Department };
}

function registerReducer_setFirstName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, firstName: dispatch.payload as string };
}

function registerReducer_setJobPosition(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, jobPosition: dispatch.payload as JobPosition };
}

function registerReducer_setLastName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, lastName: dispatch.payload as string };
}

function registerReducer_setProfilePictureUrl(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, profilePictureUrl: dispatch.payload as string };
}

function registerReducer_setStoreLocation(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, storeLocation: dispatch.payload as AllStoreLocations };
}

function registerReducer_setAddressLine(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, addressLine: dispatch.payload as string };
}

function registerReducer_setCity(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, city: dispatch.payload as string };
}

function registerReducer_setCountry(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, country: dispatch.payload as Country };
}

function registerReducer_setPostalCode(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, postalCode: dispatch.payload as PostalCode };
}

function registerReducer_setProvince(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, province: dispatch.payload as Province };
}

function registerReducer_setState(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, state: dispatch.payload as StatesUS };
}

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
