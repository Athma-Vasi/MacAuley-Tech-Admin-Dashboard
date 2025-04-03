import type { RegisterState } from "./types";

const initialRegisterState: RegisterState = {
  confirmPassword: "",
  email: "",
  errorMessage: "",
  isError: false,
  isSubmitting: false,
  isSuccessful: false,
  password: "",
  username: "",
};

export { initialRegisterState };
