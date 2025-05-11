type LoginState = {
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  loginFetchWorker: Worker | null;
  password: string;
  username: string;
};

export type { LoginState };
