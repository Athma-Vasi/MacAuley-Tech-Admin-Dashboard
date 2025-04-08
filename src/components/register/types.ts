import {
  Country,
  Department,
  JobPosition,
  PostalCode,
  Province,
  StatesUS,
} from "../../types";
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
  postalCode: PostalCode;
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
};

type RegisterDispatch =
  | {
    action: RegisterAction["setDepartment"];
    payload: Department;
  }
  | {
    action: RegisterAction["setFirstName"];
    payload: string;
  }
  | {
    action: RegisterAction["setJobPosition"];
    payload: JobPosition;
  }
  | {
    action: RegisterAction["setLastName"];
    payload: string;
  }
  | {
    action: RegisterAction["setProfilePictureUrl"];
    payload: string;
  }
  | {
    action: RegisterAction["setStoreLocation"];
    payload: AllStoreLocations;
  }
  | {
    action: RegisterAction["setAddressLine"];
    payload: string;
  }
  | {
    action: RegisterAction["setCity"];
    payload: string;
  }
  | {
    action: RegisterAction["setCountry"];
    payload: Country;
  }
  | {
    action: RegisterAction["setPostalCode"];
    payload: PostalCode;
  }
  | {
    action: RegisterAction["setProvince"];
    payload: Province;
  }
  | {
    action: RegisterAction["setState"];
    payload: StatesUS;
  }
  | {
    action: RegisterAction["setCountry"];
    payload: Country;
  }
  | {
    action: RegisterAction["setConfirmPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setEmail"];
    payload: string;
  }
  | {
    action: RegisterAction["setErrorMessage"];
    payload: string;
  }
  | {
    action: RegisterAction["setIsEmailExists"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsEmailExistsSubmitting"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsError"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsSubmitting"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsSuccessful"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsUsernameExists"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsUsernameExistsSubmitting"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setUsername"];
    payload: string;
  };

export type { RegisterAction, RegisterDispatch, RegisterState };
