import { parseSyncSafe } from "../../utils";
import { type LoginAction, loginAction } from "./actions";
import {
  LoginDispatch,
  setErrorMessageLoginDispatchZod,
  setIsLoadingLoginDispatchZod,
  setIsSubmittingLoginDispatchZod,
  setIsSuccessfulLoginDispatchZod,
  setLoginFetchWorkerLoginDispatchZod,
  setPasswordLoginDispatchZod,
  setUsernameLoginDispatchZod,
} from "./schemas";
import type { LoginState } from "./types";

function loginReducer(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const reducer = loginReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const loginReducersMap = new Map<
  LoginAction[keyof LoginAction],
  (state: LoginState, dispatch: LoginDispatch) => LoginState
>([
  [loginAction.setErrorMessage, loginReducer_setErrorMessage],
  [loginAction.setIsLoading, loginReducer_setIsLoading],
  [loginAction.setIsSubmitting, loginReducer_setIsSubmitting],
  [loginAction.setIsSuccessful, loginReducer_setIsSuccessful],
  [loginAction.setLoginFetchWorker, loginReducer_setLoginFetchWorker],
  [loginAction.setPassword, loginReducer_setPassword],
  [loginAction.setUsername, loginReducer_setUsername],
]);

function loginReducer_setErrorMessage(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setErrorMessageLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    errorMessage: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setIsLoading(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setIsLoadingLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isLoading: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setIsSubmitting(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setIsSubmittingLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isSubmitting: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setIsSuccessful(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setIsSuccessfulLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isSuccessful: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setLoginFetchWorker(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setLoginFetchWorkerLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    loginFetchWorker: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setPassword(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setPasswordLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    password: parsedResult.val.data.val.payload,
  };
}

function loginReducer_setUsername(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setUsernameLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    username: parsedResult.val.data.val.payload,
  };
}

export {
  loginReducer,
  loginReducer_setIsLoading,
  loginReducer_setIsSubmitting,
  loginReducer_setIsSuccessful,
  loginReducer_setLoginFetchWorker,
  loginReducer_setPassword,
  loginReducer_setUsername,
};
