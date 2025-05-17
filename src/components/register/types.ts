import {
  CanadianPostalCode,
  Country,
  Department,
  JobPosition,
  Province,
  StatesUS,
  USPostalCode,
} from "../../types";
import { ValidationKey } from "../../validations";
import { AllStoreLocations } from "../dashboard/types";
import type { RegisterAction } from "./actions";

type RegisterState = {
  activeStep: number;
  addressLine: string;
  checkEmailWorker: Worker | null;
  checkUsernameWorker: Worker | null;
  city: string;
  confirmPassword: string;
  country: Country;
  department: Department;
  email: string;
  errorMessage: string;
  filesInError: Map<string, boolean>;
  firstName: string;
  formData: FormData;
  inputsInError: Set<ValidationKey>;
  isEmailExists: boolean;
  isEmailExistsSubmitting: boolean;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  isUsernameExists: boolean;
  isUsernameExistsSubmitting: boolean;
  jobPosition: JobPosition;
  lastName: string;
  password: string;
  postalCodeCanada: CanadianPostalCode;
  postalCodeUS: USPostalCode;
  profilePictureUrl: string;
  province: Province;
  registerWorker: Worker | null;
  state: StatesUS;
  stepsInError: Set<number>;
  stepsWithEmptyInputs: Set<number>;
  storeLocation: AllStoreLocations;
  username: string;
};

export type { RegisterAction, RegisterState };
