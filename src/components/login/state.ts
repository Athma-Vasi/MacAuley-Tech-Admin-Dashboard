import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  customerMetricsWorker: null,
  errorMessage: "",
  financialMetricsWorker: null,
  isLoading: false,
  isSubmitting: false,
  isSuccessful: false,
  loginFetchWorker: null,
  password: "password123Q!",
  productMetricsWorker: null,
  repairMetricsWorker: null,
  username: "manager",
};

export { initialLoginState };
