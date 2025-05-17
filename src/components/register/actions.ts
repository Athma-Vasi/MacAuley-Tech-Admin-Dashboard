import { Prettify } from "../../types";
import { RegisterState } from "./types";

type RegisterAction = Prettify<
  {
    [K in keyof RegisterState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const registerAction: RegisterAction = {
  setActiveStep: "setActiveStep",
  setAddressLine: "setAddressLine",
  setCheckEmailWorker: "setCheckEmailWorker",
  setCheckUsernameWorker: "setCheckUsernameWorker",
  setCity: "setCity",
  setConfirmPassword: "setConfirmPassword",
  setCountry: "setCountry",
  setDepartment: "setDepartment",
  setEmail: "setEmail",
  setErrorMessage: "setErrorMessage",
  setFilesInError: "setFilesInError",
  setFirstName: "setFirstName",
  setFormData: "setFormData",
  setInputsInError: "setInputsInError", // This is the new action
  setIsEmailExists: "setIsEmailExists",
  setIsEmailExistsSubmitting: "setIsEmailExistsSubmitting",
  setIsError: "setIsError",
  setIsSubmitting: "setIsSubmitting",
  setIsSuccessful: "setIsSuccessful",
  setIsUsernameExists: "setIsUsernameExists",
  setIsUsernameExistsSubmitting: "setIsUsernameExistsSubmitting",
  setJobPosition: "setJobPosition",
  setLastName: "setLastName",
  setPassword: "setPassword",
  setPostalCodeCanada: "setPostalCodeCanada",
  setPostalCodeUS: "setPostalCodeUS",
  setProfilePictureUrl: "setProfilePictureUrl",
  setProvince: "setProvince",
  setRegisterWorker: "setRegisterWorker",
  setState: "setState",
  setStepsInError: "setStepsInError",
  setStepsWithEmptyInputs: "setStepsWithEmptyInputs",
  setStoreLocation: "setStoreLocation",
  setUsername: "setUsername",
};

export { registerAction };
export type { RegisterAction };
