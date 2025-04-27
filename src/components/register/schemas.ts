import { z } from "zod";
import {
    ADDRESS_LINE_REGEX,
    ALL_STORE_LOCATIONS_REGEX,
    CITY_REGEX,
    COUNTRY_REGEX,
    DEPARTMENT_REGEX,
    FULL_NAME_REGEX,
    JOB_POSITION_REGEX,
    PASSWORD_REGEX,
    POSTAL_CODE_CANADA_REGEX,
    POSTAL_CODE_US_REGEX,
    PROVINCE_REGEX,
    STATES_US_REGEX,
    URL_REGEX,
} from "../../regexes";
import { registerAction } from "./actions";

const setConfirmPasswordDispatchZod = z.object({
    action: z.literal(registerAction.setConfirmPassword),
    payload: z.string().regex(PASSWORD_REGEX),
});
const setEmailDispatchZod = z.object({
    action: z.literal(registerAction.setEmail),
    payload: z.string().email(),
});
const setIsEmailExistsDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExists),
    payload: z.boolean(),
});
const setIsEmailExistsSubmittingDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExistsSubmitting),
    payload: z.boolean(),
});
const setIsUsernameExistsDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExists),
    payload: z.boolean(),
});
const setIsUsernameExistsSubmittingDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExistsSubmitting),
    payload: z.boolean(),
});
const setPasswordDispatchZod = z.object({
    action: z.literal(registerAction.setPassword),
    payload: z.string().regex(PASSWORD_REGEX),
});
const setUsernameDispatchZod = z.object({
    action: z.literal(registerAction.setUsername),
    payload: z.string(),
});
const setAddressLineDispatchZod = z.object({
    action: z.literal(registerAction.setAddressLine),
    payload: z.string().regex(ADDRESS_LINE_REGEX),
});
const setCityDispatchZod = z.object({
    action: z.literal(registerAction.setCity),
    payload: z.string().regex(CITY_REGEX),
});
const setCountryDispatchZod = z.object({
    action: z.literal(registerAction.setCountry),
    payload: z.string().regex(COUNTRY_REGEX),
});
const setPostalCodeCanadaDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeCanada),
    payload: z.string().regex(POSTAL_CODE_CANADA_REGEX),
});
const setPostalCodeUSDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeUS),
    payload: z.string().regex(POSTAL_CODE_US_REGEX),
});
const setProvinceDispatchZod = z.object({
    action: z.literal(registerAction.setProvince),
    payload: z.string().regex(PROVINCE_REGEX),
});
const setStateDispatchZod = z.object({
    action: z.literal(registerAction.setState),
    payload: z.string().regex(STATES_US_REGEX),
});
const setDepartmentDispatchZod = z.object({
    action: z.literal(registerAction.setDepartment),
    payload: z.string().regex(DEPARTMENT_REGEX),
});
const setFirstNameDispatchZod = z.object({
    action: z.literal(registerAction.setFirstName),
    payload: z.string().regex(FULL_NAME_REGEX),
});
const setJobPositionDispatchZod = z.object({
    action: z.literal(registerAction.setJobPosition),
    payload: z.string().regex(JOB_POSITION_REGEX),
});
const setLastNameDispatchZod = z.object({
    action: z.literal(registerAction.setLastName),
    payload: z.string().regex(FULL_NAME_REGEX),
});
const setProfilePictureUrlDispatchZod = z.object({
    action: z.literal(registerAction.setProfilePictureUrl),
    payload: z.string().regex(URL_REGEX),
});
const setStoreLocationDispatchZod = z.object({
    action: z.literal(registerAction.setStoreLocation),
    payload: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
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
    | z.infer<typeof setIsEmailExistsDispatchZod>
    | z.infer<typeof setIsEmailExistsSubmittingDispatchZod>
    | z.infer<typeof setIsUsernameExistsDispatchZod>
    | z.infer<typeof setIsUsernameExistsSubmittingDispatchZod>
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
