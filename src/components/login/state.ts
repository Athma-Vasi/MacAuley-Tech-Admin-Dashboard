import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  errorMessage: "",
  isLoading: false,
  isSubmitting: false,
  isSuccessful: false,
  loginFetchWorker: null,
  password: "password123Q!",
  username: "manager",
};

export { initialLoginState };
