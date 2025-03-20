import type { SetPageInErrorPayload } from "../../types";
import type { LoginAction } from "./actions";

type LoginState = {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  pagesInError: Set<number>;
  password: string;
  triggerFormSubmit: boolean;
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
  action: LoginAction["setPageInError"];
  payload: SetPageInErrorPayload;
} | {
  action: LoginAction["setPassword"];
  payload: string;
} | {
  action: LoginAction["setTriggerFormSubmit"];
  payload: boolean;
} | {
  action: LoginAction["setUsername"];
  payload: string;
};

export type { LoginDispatch, LoginState };
