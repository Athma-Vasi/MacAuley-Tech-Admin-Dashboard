import { Prettify } from "../../types";
import { AuthState } from "./types";

type AuthAction = Prettify<
  {
    [K in keyof AuthState as `set${Capitalize<string & K>}`]: `set${Capitalize<
      string & K
    >}`;
  }
>;

const authAction: AuthAction = {
  setAccessToken: "setAccessToken",
  setDecodedToken: "setDecodedToken",
  setIsLoggedIn: "setIsLoggedIn",
  setUserDocument: "setUserDocument",
};

export { authAction };
export type { AuthAction };
