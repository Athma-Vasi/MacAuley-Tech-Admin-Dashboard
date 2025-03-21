import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  isLoading: true,
  isSubmitting: false,
  isSuccessful: false,
  pagesInError: new Set(),
  password: "password123Q!",
  triggerFormSubmit: false,
  username: "manager",
};

export { initialLoginState };
