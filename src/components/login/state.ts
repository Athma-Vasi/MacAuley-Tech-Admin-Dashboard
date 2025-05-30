import type { LoginState } from "./types";

const initialLoginState: LoginState = {
  customerMetricsWorker: null,
  errorMessage: "",
  financialMetricsGenerated: false,
  financialMetricsWorker: null,
  isLoading: false,
  isSubmitting: false,
  isSuccessful: false,
  loginFetchWorker: null,
  password: "password123Q!",
  productMetricsGenerated: false,
  productMetricsWorker: null,
  repairMetricsGenerated: false,
  repairMetricsWorker: null,
  username: "manager",
};

export { initialLoginState };
