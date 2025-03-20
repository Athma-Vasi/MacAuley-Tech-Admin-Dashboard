import type { ReactNode } from "react";
import type { DecodedToken, UserDocument } from "../../types";
import type { AuthAction } from "./actions";

type AuthState = {
  accessToken: string;
  decodedToken: DecodedToken | null;
  isLoggedIn: boolean;
  userDocument: UserDocument | null;
};

type AuthProviderProps = {
  children?: ReactNode;
};

type AuthDispatch =
  | {
    action: AuthAction["setAccessToken"];
    payload: string;
  }
  | {
    action: AuthAction["setDecodedToken"];
    payload: DecodedToken;
  }
  | {
    action: AuthAction["setIsLoggedIn"];
    payload: boolean;
  }
  | {
    action: AuthAction["setUserDocument"];
    payload: UserDocument;
  };

export type { AuthDispatch, AuthProviderProps, AuthState };
