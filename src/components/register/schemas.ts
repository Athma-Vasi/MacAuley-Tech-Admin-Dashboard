import { z } from "zod";
import { PASSWORD_REGEX } from "../../regexes";
import { registerAction } from "./actions";

const setConfirmPasswordRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setConfirmPassword),
    payload: z.string().regex(PASSWORD_REGEX),
});
const setEmailRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setEmail),
    payload: z.string(),
});
const setIsEmailExistsRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExists),
    payload: z.boolean(),
});
const setIsEmailExistsSubmittingRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsEmailExistsSubmitting),
    payload: z.boolean(),
});
const setIsUsernameExistsRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExists),
    payload: z.boolean(),
});
const setIsUsernameExistsSubmittingRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsUsernameExistsSubmitting),
    payload: z.boolean(),
});
const setPasswordRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setPassword),
    payload: z.string(),
});
const setUsernameRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setUsername),
    payload: z.string(),
});
const setAddressLineRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setAddressLine),
    payload: z.string(),
});
const setCityRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setCity),
    payload: z.string(),
});
const setCountryRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setCountry),
    payload: z.string(),
});
const setPostalCodeCanadaRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeCanada),
    payload: z.string(),
});
const setPostalCodeUSRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setPostalCodeUS),
    payload: z.string(),
});
const setProvinceRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setProvince),
    payload: z.string(),
});
const setStateRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setState),
    payload: z.string(),
});
const setDepartmentRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setDepartment),
    payload: z.string(),
});
const setFirstNameRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setFirstName),
    payload: z.string(),
});
const setJobPositionRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setJobPosition),
    payload: z.string(),
});
const setLastNameRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setLastName),
    payload: z.string(),
});
const setProfilePictureUrlRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setProfilePictureUrl),
    payload: z.string(),
});
const setStoreLocationRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setStoreLocation),
    payload: z.string(),
});
const setErrorMessageRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setErrorMessage),
    payload: z.string(),
});
const setIsErrorRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsError),
    payload: z.boolean(),
});
const setIsSubmittingRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsSubmitting),
    payload: z.boolean(),
});
const setIsSuccessfulRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setIsSuccessful),
    payload: z.boolean(),
});
const setActiveStepRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setActiveStep),
    payload: z.number(),
});
const setStepsInErrorRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setStepsInError),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), step: z.number() },
    ),
});
const setStepsWithEmptyInputsRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setStepsWithEmptyInputs),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), step: z.number() },
    ),
});
const setInputsInErrorRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setInputsInError),
    payload: z.object(
        { kind: z.enum(["add", "delete"]), name: z.string() },
    ),
});

const setFormDataRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setFormData),
    payload: z.any(),
});

const setFilesInErrorRegisterRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setFilesInError),
    payload: z.object(
        {
            kind: z.enum(["isError", "notError", "remove"]),
            name: z.string(),
        },
    ),
});

const setCheckUsernameWorkerRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setCheckUsernameWorker),
    payload: z.instanceof(Worker),
});

const setCheckEmailWorkerRegisterDispatchZod = z.object({
    action: z.literal(registerAction.setCheckEmailWorker),
    payload: z.instanceof(Worker),
});

type RegisterDispatch =
    | z.infer<typeof setConfirmPasswordRegisterDispatchZod>
    | z.infer<typeof setEmailRegisterDispatchZod>
    | z.infer<typeof setIsEmailExistsRegisterDispatchZod>
    | z.infer<typeof setIsEmailExistsSubmittingRegisterDispatchZod>
    | z.infer<typeof setIsUsernameExistsRegisterDispatchZod>
    | z.infer<typeof setIsUsernameExistsSubmittingRegisterDispatchZod>
    | z.infer<typeof setPasswordRegisterDispatchZod>
    | z.infer<typeof setUsernameRegisterDispatchZod>
    | z.infer<typeof setAddressLineRegisterDispatchZod>
    | z.infer<typeof setCityRegisterDispatchZod>
    | z.infer<typeof setCountryRegisterDispatchZod>
    | z.infer<typeof setPostalCodeCanadaRegisterDispatchZod>
    | z.infer<typeof setPostalCodeUSRegisterDispatchZod>
    | z.infer<typeof setProvinceRegisterDispatchZod>
    | z.infer<typeof setStateRegisterDispatchZod>
    | z.infer<typeof setDepartmentRegisterDispatchZod>
    | z.infer<typeof setFirstNameRegisterDispatchZod>
    | z.infer<typeof setJobPositionRegisterDispatchZod>
    | z.infer<typeof setLastNameRegisterDispatchZod>
    | z.infer<typeof setProfilePictureUrlRegisterDispatchZod>
    | z.infer<typeof setStoreLocationRegisterDispatchZod>
    | z.infer<typeof setErrorMessageRegisterDispatchZod>
    | z.infer<typeof setIsErrorRegisterDispatchZod>
    | z.infer<typeof setIsSubmittingRegisterDispatchZod>
    | z.infer<typeof setIsSuccessfulRegisterDispatchZod>
    | z.infer<typeof setActiveStepRegisterDispatchZod>
    | z.infer<typeof setStepsInErrorRegisterDispatchZod>
    | z.infer<typeof setStepsWithEmptyInputsRegisterDispatchZod>
    | z.infer<typeof setInputsInErrorRegisterDispatchZod>
    | z.infer<typeof setFormDataRegisterDispatchZod>
    | z.infer<typeof setFilesInErrorRegisterRegisterDispatchZod>
    | z.infer<typeof setCheckUsernameWorkerRegisterDispatchZod>
    | z.infer<typeof setCheckEmailWorkerRegisterDispatchZod>;

export {
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
    setStateRegisterDispatchZod,
    setStepsInErrorRegisterDispatchZod,
    setStepsWithEmptyInputsRegisterDispatchZod,
    setStoreLocationRegisterDispatchZod,
    setUsernameRegisterDispatchZod,
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
