import type { RegisterState } from "./types";

const initialRegisterState: RegisterState = {
  confirmPassword: "",
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
  username: "",
};

export { initialRegisterState };
