import { z } from "zod";
import { registerAction } from "./actions";

const setConfirmPasswordDispatchZod = z.object({
    action: z.literal(registerAction.setConfirmPassword),
    payload: z.string(),
});
const setEmailDispatchZod = z.object({
    action: z.literal(registerAction.setEmail),
    payload: z.string().email(),
});
const isEmailExistsDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExists),
    payload: z.boolean(),
});
const isEmailExistsSubmittingDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExistsSubmitting),
    payload: z.boolean(),
});
const isUsernameExistsDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExists),
    payload: z.boolean(),
});
const isUsernameExistsSubmittingDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExistsSubmitting),
    payload: z.boolean(),
});
const setPasswordDispatchZod = z.object({
    action: z.literal(registerAction.setPassword),
    payload: z.string(),
});
const setUsernameDispatchZod = z.object({
    action: z.literal(registerAction.setUsername),
    payload: z.string(),
});
const setAddressLineDispatchZod = z.object({
    action: z.literal(registerAction.setAddressLine),
    payload: z.string(),
});
const setCityDispatchZod = z.object({
    action: z.literal(registerAction.setCity),
    payload: z.string(),
});
const setCountryDispatchZod = z.object({
    action: z.literal(registerAction.setCountry),
    payload: z.string(),
});
const setPostalCodeCanadaDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeCanada),
    payload: z.string(),
});
const setPostalCodeUSDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeUS),
    payload: z.string(),
});
const setProvinceDispatchZod = z.object({
    action: z.literal(registerAction.setProvince),
    payload: z.string(),
});
const setStateDispatchZod = z.object({
    action: z.literal(registerAction.setState),
    payload: z.string(),
});
const setDepartmentDispatchZod = z.object({
    action: z.literal(registerAction.setDepartment),
    payload: z.string(),
});
const setFirstNameDispatchZod = z.object({
    action: z.literal(registerAction.setFirstName),
    payload: z.string(),
});
const setJobPositionDispatchZod = z.object({
    action: z.literal(registerAction.setJobPosition),
    payload: z.string(),
});
const setLastNameDispatchZod = z.object({
    action: z.literal(registerAction.setLastName),
    payload: z.string(),
});
const setProfilePictureUrlDispatchZod = z.object({
    action: z.literal(registerAction.setProfilePictureUrl),
    payload: z.string(),
});
const setStoreLocationDispatchZod = z.object({
    action: z.literal(registerAction.setStoreLocation),
    payload: z.string(),
});
const setErrorMessageDispatchZod = z.object({
    action: z.literal(registerAction.setErrorMessage),
    payload: z.string(),
});
const setIsErrorDispatchZod = z.object({
    action: z.literal(registerAction.setIsError),
    payload: z.boolean(),
});
const setIsSubmittingDispatchZod = z.object({
    action: z.literal(registerAction.setIsSubmitting),
    payload: z.boolean(),
});
const setIsSuccessfulDispatchZod = z.object({
    action: z.literal(registerAction.setIsSuccessful),
    payload: z.boolean(),
});
const setActiveStepDispatchZod = z.object({
    action: z.literal(registerAction.setActiveStep),
    payload: z.number(),
});
const setStepsInErrorDispatchZod = z.object({
    action: z.literal(registerAction.setStepsInError),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), step: z.number() },
    ),
});
const setStepsWithEmptyInputsDispatchZod = z.object({
    action: z.literal(registerAction.setStepsWithEmptyInputs),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), step: z.number() },
    ),
});
const setInputsInErrorDispatchZod = z.object({
    action: z.literal(registerAction.setInputsInError),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), name: z.string() },
    ),
});

type RegisterDispatch =
    | z.infer<typeof setConfirmPasswordDispatchZod>
    | z.infer<typeof setEmailDispatchZod>
    | z.infer<typeof isEmailExistsDispatchZod>
    | z.infer<typeof isEmailExistsSubmittingDispatchZod>
    | z.infer<typeof isUsernameExistsDispatchZod>
    | z.infer<typeof isUsernameExistsSubmittingDispatchZod>
    | z.infer<typeof setPasswordDispatchZod>
    | z.infer<typeof setUsernameDispatchZod>
    | z.infer<typeof setAddressLineDispatchZod>
    | z.infer<typeof setCityDispatchZod>
    | z.infer<typeof setCountryDispatchZod>
    | z.infer<typeof setPostalCodeCanadaDispatchZod>
    | z.infer<typeof setPostalCodeUSDispatchZod>
    | z.infer<typeof setProvinceDispatchZod>
    | z.infer<typeof setStateDispatchZod>
    | z.infer<typeof setDepartmentDispatchZod>
    | z.infer<typeof setFirstNameDispatchZod>
    | z.infer<typeof setJobPositionDispatchZod>
    | z.infer<typeof setLastNameDispatchZod>
    | z.infer<typeof setProfilePictureUrlDispatchZod>
    | z.infer<typeof setStoreLocationDispatchZod>
    | z.infer<typeof setErrorMessageDispatchZod>
    | z.infer<typeof setIsErrorDispatchZod>
    | z.infer<typeof setIsSubmittingDispatchZod>
    | z.infer<typeof setIsSuccessfulDispatchZod>
    | z.infer<typeof setActiveStepDispatchZod>
    | z.infer<typeof setStepsInErrorDispatchZod>
    | z.infer<typeof setStepsWithEmptyInputsDispatchZod>
    | z.infer<typeof setInputsInErrorDispatchZod>;

export {
    isEmailExistsDispatchZod,
    isEmailExistsSubmittingDispatchZod,
    isUsernameExistsDispatchZod,
    isUsernameExistsSubmittingDispatchZod,
    setActiveStepDispatchZod,
    setAddressLineDispatchZod,
    setCityDispatchZod,
    setConfirmPasswordDispatchZod,
    setCountryDispatchZod,
    setDepartmentDispatchZod,
    setEmailDispatchZod,
    setErrorMessageDispatchZod,
    setFirstNameDispatchZod,
    setInputsInErrorDispatchZod,
    setIsErrorDispatchZod,
    setIsSubmittingDispatchZod,
    setIsSuccessfulDispatchZod,
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
};
export type { RegisterDispatch };

/**
 * // register personal
  confirmPassword: string;
  email: string;
  isEmailExists: boolean;
  isEmailExistsSubmitting: boolean;
  isUsernameExists: boolean;
  isUsernameExistsSubmitting: boolean;
  password: string;
  username: string;

  // register address
  addressLine: string;
  city: string;
  country: Country;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: USPostalCode;
  province: Province;
  state: StatesUS;

  // register additional
  department: Department;
  firstName: string;
  jobPosition: JobPosition;
  lastName: string;
  profilePictureUrl: string;
  storeLocation: AllStoreLocations;

  errorMessage: string;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  activeStep: number;
  stepsInError: Set<number>;
  stepsWithEmptyInputs: Set<number>;
  inputsInError: Set<ValidationKey>;
 */
