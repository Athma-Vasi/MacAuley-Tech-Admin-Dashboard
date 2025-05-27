type LoginState = {
  customerMetricsWorker: Worker | null;
  errorMessage: string;
  financialMetricsWorker: Worker | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  loginFetchWorker: Worker | null;
  password: string;
  productMetricsWorker: Worker | null;
  repairMetricsWorker: Worker | null;
  triggerFinancialMetricsCreation: boolean;
  username: string;
};

export type { LoginState };
