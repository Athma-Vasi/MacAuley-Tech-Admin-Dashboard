import type { RegisterAction } from "./actions";

type RegisterState = {
  confirmPassword: string;
  email: string;
  errorMessage: string;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  password: string;
  triggerFormSubmit: boolean;
  username: string;
};

type RegisterDispatch =
  | {
    action: RegisterAction["setConfirmPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setEmail"];
    payload: string;
  }
  | {
    action: RegisterAction["setErrorMessage"];
    payload: string;
  }
  | {
    action: RegisterAction["setIsError"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsSubmitting"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsSuccessful"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setTriggerFormSubmit"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setUsername"];
    payload: string;
  };

export type { RegisterAction, RegisterDispatch, RegisterState };
