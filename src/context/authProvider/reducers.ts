import type { DecodedToken, UserDocument } from "../../types";
import { type AuthAction, authAction } from "./actions";
import type { AuthDispatch, AuthState } from "./types";

function authReducer(state: AuthState, dispatch: AuthDispatch): AuthState {
  const reducer = authReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const authReducersMap = new Map<
  AuthAction[keyof AuthAction],
  (state: AuthState, dispatch: AuthDispatch) => AuthState
>([
  [authAction.setAccessToken, authReducer_setAccessToken],
  [authAction.setDecodedToken, authReducer_setDecodedToken],
  [authAction.setIsLoggedIn, authReducer_setIsLoggedIn],
  [authAction.setUserDocument, authReducer_setUserDocument],
]);

function authReducer_setAccessToken(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  return {
    ...state,
    accessToken: dispatch.payload as string,
  };
}

function authReducer_setDecodedToken(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  return {
    ...state,
    decodedToken: dispatch.payload as DecodedToken,
  };
}

function authReducer_setIsLoggedIn(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  return {
    ...state,
    isLoggedIn: dispatch.payload as boolean,
  };
}

function authReducer_setUserDocument(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  return {
    ...state,
    userDocument: dispatch.payload as UserDocument,
  };
}

export { authReducer };
