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
import type { RegisterAction } from "./actions";

type RegisterState = {
  addressLine: string;
  city: string;
  confirmPassword: string;
  contactNumber: PhoneNumber | string;
  country: Country;
  dateOfBirth: string;
  department: Department;
  email: string;
  emergencyContactName: string;
  emergencyContactNumber: PhoneNumber;
  errorMessage: string;
  firstName: string;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  jobPosition: JobPosition;
  lastName: string;
  middleName: string;
  pagesInError: Set<number>;
  password: string;
  postalCode: PostalCode;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  province: Province;
  startDate: string;
  state: StatesUS;
  storeLocation: StoreLocation;
  triggerFormSubmit: boolean;
  username: string;
};

type RegisterDispatch =
  | {
    action: RegisterAction["setAddressLine"];
    payload: string;
  }
  | {
    action: RegisterAction["setCity"];
    payload: string;
  }
  | {
    action: RegisterAction["setConfirmPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setContactNumber"];
    payload: PhoneNumber;
  }
  | {
    action: RegisterAction["setCountry"];
    payload: Country;
  }
  | {
    action: RegisterAction["setDateOfBirth"];
    payload: string;
  }
  | {
    action: RegisterAction["setDepartment"];
    payload: Department;
  }
  | {
    action: RegisterAction["setEmail"];
    payload: string;
  }
  | {
    action: RegisterAction["setEmergencyContactName"];
    payload: string;
  }
  | {
    action: RegisterAction["setEmergencyContactNumber"];
    payload: PhoneNumber | string;
  }
  | {
    action: RegisterAction["setErrorMessage"];
    payload: string;
  }
  | {
    action: RegisterAction["setFirstName"];
    payload: string;
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
    action: RegisterAction["setJobPosition"];
    payload: JobPosition;
  }
  | {
    action: RegisterAction["setLastName"];
    payload: string;
  }
  | {
    action: RegisterAction["setMiddleName"];
    payload: string;
  }
  | {
    action: RegisterAction["setPageInError"];
    payload: SetPageInErrorPayload;
  }
  | {
    action: RegisterAction["setPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setPostalCode"];
    payload: PostalCode;
  }
  | {
    action: RegisterAction["setPreferredName"];
    payload: string;
  }
  | {
    action: RegisterAction["setPreferredPronouns"];
    payload: PreferredPronouns;
  }
  | {
    action: RegisterAction["setProfilePictureUrl"];
    payload: FormData;
  }
  | {
    action: RegisterAction["setProvince"];
    payload: Province;
  }
  | {
    action: RegisterAction["setStartDate"];
    payload: string;
  }
  | {
    action: RegisterAction["setState"];
    payload: StatesUS;
  }
  | {
    action: RegisterAction["setStoreLocation"];
    payload: StoreLocation;
  }
  | {
    action: RegisterAction["setTriggerFormSubmit"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setUsername"];
    payload: string;
  };

export type { RegisterAction, RegisterDispatch, RegisterState };
