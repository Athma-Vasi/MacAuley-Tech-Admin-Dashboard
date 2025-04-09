type RegisterAction = {
  setActiveStep: "setActiveStep";
  setAddressLine: "setAddressLine";
  setCity: "setCity";
  setConfirmPassword: "setConfirmPassword";
  setCountry: "setCountry";
  setDepartment: "setDepartment";
  setEmail: "setEmail";
  setErrorMessage: "setErrorMessage";
  setFirstName: "setFirstName";
  setInputsInError: "setInputsInError";
  setIsEmailExists: "setIsEmailExists";
  setIsEmailExistsSubmitting: "setIsEmailExistsSubmitting";
  setIsError: "setIsError";
  setIsSubmitting: "setIsSubmitting";
  setIsSuccessful: "setIsSuccessful";
  setIsUsernameExists: "setIsUsernameExists";
  setIsUsernameExistsSubmitting: "setIsUsernameExistsSubmitting";
  setJobPosition: "setJobPosition";
  setLastName: "setLastName";
  setPassword: "setPassword";
  setPostalCodeCanada: "setPostalCodeCanada";
  setPostalCodeUS: "setPostalCodeUS";
  setProfilePictureUrl: "setProfilePictureUrl";
  setProvince: "setProvince";
  setState: "setState";
  setStepsInError: "setStepsInError";
  setStepsWithEmptyInputs: "setStepsWithEmptyInputs";
  setStoreLocation: "setStoreLocation";
  setUsername: "setUsername";
};

const registerAction: RegisterAction = {
  setActiveStep: "setActiveStep",
  setAddressLine: "setAddressLine",
  setCity: "setCity",
  setConfirmPassword: "setConfirmPassword",
  setCountry: "setCountry",
  setDepartment: "setDepartment",
  setEmail: "setEmail",
  setErrorMessage: "setErrorMessage",
  setFirstName: "setFirstName",
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
  setState: "setState",
  setStepsInError: "setStepsInError",
  setStepsWithEmptyInputs: "setStepsWithEmptyInputs",
  setStoreLocation: "setStoreLocation",
  setUsername: "setUsername",
};

export { registerAction };
export type { RegisterAction };
