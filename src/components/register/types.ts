import {
  CanadianPostalCode,
  Country,
  Department,
  JobPosition,
  Province,
  SetInputsInErrorPayload,
  SetStepInErrorPayload,
  SetStepWithEmptyInputsPayload,
  StatesUS,
  USPostalCode,
} from "../../types";
import { ValidationKey } from "../../validations";
import { AllStoreLocations } from "../dashboard/types";
import type { RegisterAction } from "./actions";

type RegisterState = {
  // register personal
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
};

export type { RegisterAction, RegisterState };
