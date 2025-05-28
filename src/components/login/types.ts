type LoginState = {
  customerMetricsWorker: Worker | null;
  errorMessage: string;
  financialMetricsWorker: Worker | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  loginFetchWorker: Worker | null;
  password: string;
  productMetricsGenerated: boolean;
  productMetricsWorker: Worker | null;
  repairMetricsGenerated: boolean;
  repairMetricsWorker: Worker | null;
  username: string;
};

export type { LoginState };
