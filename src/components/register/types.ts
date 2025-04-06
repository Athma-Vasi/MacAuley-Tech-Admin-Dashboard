import type { RegisterAction } from "./actions";

type RegisterState = {
  confirmPassword: string;
  email: string;
  errorMessage: string;
  isEmailExists: boolean;
  isEmailExistsSubmitting: boolean;
  isError: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  isUsernameExists: boolean;
  isUsernameExistsSubmitting: boolean;
  password: string;
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
    action: RegisterAction["setIsEmailExists"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsEmailExistsSubmitting"];
    payload: boolean;
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
    action: RegisterAction["setIsUsernameExists"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setIsUsernameExistsSubmitting"];
    payload: boolean;
  }
  | {
    action: RegisterAction["setPassword"];
    payload: string;
  }
  | {
    action: RegisterAction["setUsername"];
    payload: string;
  };

export type { RegisterAction, RegisterDispatch, RegisterState };
