import type { RegisterState } from "./types";

const initialRegisterState: RegisterState = {
  addressLine: "",
  city: "",
  confirmPassword: "",
  country: "Canada",
  department: "Accounting",
  email: "",
  errorMessage: "",
  firstName: "",
  isEmailExists: false,
  isEmailExistsSubmitting: false,
  isError: false,
  isSubmitting: false,
  isSuccessful: false,
  isUsernameExists: false,
  isUsernameExistsSubmitting: false,
  jobPosition: "Accounting Manager",
  lastName: "",
  password: "",
  postalCode: "",
  profilePictureUrl: "",
  province: "Alberta",
  state: "Alabama",
  storeLocation: "All Locations",
  username: "",
};

export { initialRegisterState };
