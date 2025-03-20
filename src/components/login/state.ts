import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  isLoading: true,
  isSubmitting: false,
  isSuccessful: false,
  pagesInError: new Set(),
  password: "",
  triggerFormSubmit: false,
  username: "",
};

export { initialLoginState };
