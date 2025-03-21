import type {
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  SetPageInErrorPayload,
  StatesUS,
  StoreLocation,
} from "../../types";
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
  [registerAction.setAddressLine, registerReducer_setAddressLine],
  [registerAction.setCity, registerReducer_setCity],
  [registerAction.setConfirmPassword, registerReducer_setConfirmPassword],
  [registerAction.setContactNumber, registerReducer_setContactNumber],
  [registerAction.setCountry, registerReducer_setCountry],
  [registerAction.setDateOfBirth, registerReducer_setDateOfBirth],
  [registerAction.setDepartment, registerReducer_setDepartment],
  [registerAction.setEmail, registerReducer_setEmail],
  [
    registerAction.setEmergencyContactName,
    registerReducer_setEmergencyContactName,
  ],
  [
    registerAction.setEmergencyContactNumber,
    registerReducer_setEmergencyContactNumber,
  ],
  [registerAction.setErrorMessage, registerReducer_setErrorMessage],
  [registerAction.setFirstName, registerReducer_setFirstName],
  [registerAction.setIsError, registerReducer_setIsError],
  [registerAction.setIsSubmitting, registerReducer_setIsSubmitting],
  [registerAction.setIsSuccessful, registerReducer_setIsSuccessful],
  [registerAction.setJobPosition, registerReducer_setJobPosition],
  [registerAction.setLastName, registerReducer_setLastName],
  [registerAction.setMiddleName, registerReducer_setMiddleName],
  [registerAction.setPageInError, registerReducer_setPageInError],
  [registerAction.setPassword, registerReducer_setPassword],
  [registerAction.setPostalCode, registerReducer_setPostalCode],
  [registerAction.setPreferredName, registerReducer_setPreferredName],
  [registerAction.setPreferredPronouns, registerReducer_setPreferredPronouns],
  [registerAction.setProfilePictureUrl, registerReducer_setProfilePictureUrl],
  [registerAction.setProvince, registerReducer_setProvince],
  [registerAction.setStartDate, registerReducer_setStartDate],
  [registerAction.setState, registerReducer_setState],
  [registerAction.setStoreLocation, registerReducer_setStoreLocation],
  [registerAction.setTriggerFormSubmit, registerReducer_setTriggerFormSubmit],
  [registerAction.setUsername, registerReducer_setUsername],
]);

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

function registerReducer_setConfirmPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, confirmPassword: dispatch.payload as string };
}

function registerReducer_setContactNumber(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, contactNumber: dispatch.payload as PhoneNumber };
}

function registerReducer_setCountry(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, country: dispatch.payload as Country };
}

function registerReducer_setDateOfBirth(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, dateOfBirth: dispatch.payload as string };
}

function registerReducer_setDepartment(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, department: dispatch.payload as Department };
}

function registerReducer_setEmail(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, email: dispatch.payload as string };
}

function registerReducer_setEmergencyContactName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, emergencyContactName: dispatch.payload as string };
}

function registerReducer_setEmergencyContactNumber(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, emergencyContactNumber: dispatch.payload as PhoneNumber };
}

function registerReducer_setErrorMessage(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, errorMessage: dispatch.payload as string };
}

function registerReducer_setFirstName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, firstName: dispatch.payload as string };
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

function registerReducer_setMiddleName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, middleName: dispatch.payload as string };
}

function registerReducer_setPageInError(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  const { kind, page } = dispatch.payload as SetPageInErrorPayload;
  const pagesInError = new Set(state.pagesInError);
  kind === "add" ? pagesInError.add(page) : pagesInError.delete(page);

  return { ...state, pagesInError };
}

function registerReducer_setPassword(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, password: dispatch.payload as string };
}

function registerReducer_setPostalCode(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, postalCode: dispatch.payload as PostalCode };
}

function registerReducer_setPreferredName(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, preferredName: dispatch.payload as string };
}

function registerReducer_setPreferredPronouns(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, preferredPronouns: dispatch.payload as PreferredPronouns };
}

function registerReducer_setProfilePictureUrl(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, profilePictureUrl: dispatch.payload as string };
}

function registerReducer_setProvince(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, province: dispatch.payload as Province };
}

function registerReducer_setStartDate(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, startDate: dispatch.payload as string };
}

function registerReducer_setState(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, state: dispatch.payload as StatesUS };
}

function registerReducer_setStoreLocation(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, storeLocation: dispatch.payload as StoreLocation };
}

function registerReducer_setTriggerFormSubmit(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, triggerFormSubmit: dispatch.payload as boolean };
}

function registerReducer_setUsername(
  state: RegisterState,
  dispatch: RegisterDispatch,
): RegisterState {
  return { ...state, username: dispatch.payload as string };
}

export { registerReducer };
