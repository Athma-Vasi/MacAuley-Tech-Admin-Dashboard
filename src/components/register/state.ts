import type { RegisterState } from "./types";

const initialRegisterState: RegisterState = {
  addressLine: "",
  city: "",
  confirmPassword: "",
  country: "Canada",
  email: "",
  errorMessage: "",
  isEmailExists: false,
  isEmailExistsSubmitting: false,
  isError: false,
  isSubmitting: false,
  isSuccessful: false,
  isUsernameExists: false,
  isUsernameExistsSubmitting: false,
  password: "",
  postalCode: "",
  province:"Alberta",
  state:"Alabama", 
  username: "",
};

export { initialRegisterState };
