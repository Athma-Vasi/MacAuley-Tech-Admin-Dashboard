type LoginState = {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  fetchParseWorker: Worker | null;
  password: string;
  username: string;
};

export type { LoginState };
