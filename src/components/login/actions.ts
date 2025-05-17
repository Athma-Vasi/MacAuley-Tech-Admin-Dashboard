import { Prettify } from "../../types";
import { LoginState } from "./types";

type LoginAction = Prettify<
  {
    [K in keyof LoginState as `set${Capitalize<string & K>}`]: `set${Capitalize<
      string & K
    >}`;
  }
>;

const loginAction: LoginAction = {
  setErrorMessage: "setErrorMessage",
  setIsLoading: "setIsLoading",
  setIsSubmitting: "setIsSubmitting",
  setIsSuccessful: "setIsSuccessful",
  setLoginFetchWorker: "setLoginFetchWorker",
  setPassword: "setPassword",
  setUsername: "setUsername",
};

export { loginAction };
export type { LoginAction };
