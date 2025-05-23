import type { DecodedToken, UserDocument } from "../../types";
import { parseSyncSafe } from "../../utils";
import { type AuthAction, authAction } from "./actions";
import {
  setAccessTokenAuthDispatchZod,
  setDecodedTokenAuthDispatchZod,
  setIsLoggedInAuthDispatchZod,
  setUserDocumentAuthDispatchZod,
} from "./schemas";
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
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setAccessTokenAuthDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    accessToken: parsedResult.val.val.payload as string,
  };
}

function authReducer_setDecodedToken(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setDecodedTokenAuthDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    decodedToken: parsedResult.val.val.payload as DecodedToken,
  };
}

function authReducer_setIsLoggedIn(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setIsLoggedInAuthDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isLoggedIn: parsedResult.val.val.payload as boolean,
  };
}

function authReducer_setUserDocument(
  state: AuthState,
  dispatch: AuthDispatch,
): AuthState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setUserDocumentAuthDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    userDocument: parsedResult.val.val.payload as UserDocument,
  };
}

export {
  authReducer,
  authReducer_setAccessToken,
  authReducer_setDecodedToken,
  authReducer_setIsLoggedIn,
  authReducer_setUserDocument,
};
