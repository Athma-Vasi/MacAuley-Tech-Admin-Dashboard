import type { LoginAction } from "./actions";

type LoginState = {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  password: string;
  username: string;
};

type LoginDispatch = {
  action: LoginAction["setIsLoading"];
  payload: boolean;
} | {
  action: LoginAction["setIsSubmitting"];
  payload: boolean;
} | {
  action: LoginAction["setIsSuccessful"];
  payload: boolean;
} | {
  action: LoginAction["setPassword"];
  payload: string;
} | {
  action: LoginAction["setUsername"];
  payload: string;
};

export type { LoginDispatch, LoginState };
