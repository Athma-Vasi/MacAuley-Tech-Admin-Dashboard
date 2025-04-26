import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  isLoading: false,
  isSubmitting: false,
  isSuccessful: false,
  password: "password123Q!",
  username: "manager",
};

export { initialLoginState };
