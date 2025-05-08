import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  isLoading: false,
  isSubmitting: false,
  isSuccessful: false,
  fetchParseWorker: null,
  password: "password123Q!",
  username: "manager",
};

export { initialLoginState };
