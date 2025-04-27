import { parseSafeSync } from "../../utils";
import { type LoginAction, loginAction } from "./actions";
import {
  LoginDispatch,
  setIsLoadingDispatchZod,
  setIsSubmittingDispatchZod,
  setIsSuccessfulDispatchZod,
  setPasswordDispatchZod,
  setUsernameDispatchZod,
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
  [loginAction.setIsLoading, loginReducer_setIsLoading],
  [loginAction.setIsSubmitting, loginReducer_setIsSubmitting],
  [loginAction.setIsSuccessful, loginReducer_setIsSuccessful],
  [loginAction.setPassword, loginReducer_setPassword],
  [loginAction.setUsername, loginReducer_setUsername],
]);

function loginReducer_setIsLoading(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSafeSync(
    {
      object: dispatch,
      zSchema: setIsLoadingDispatchZod,
    },
  );

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isLoading: parsedResult.safeUnwrap().data.payload,
  };
}

function loginReducer_setIsSubmitting(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSafeSync(
    {
      object: dispatch,
      zSchema: setIsSubmittingDispatchZod,
    },
  );

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isSubmitting: parsedResult.safeUnwrap().data.payload,
  };
}

function loginReducer_setIsSuccessful(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSafeSync(
    {
      object: dispatch,
      zSchema: setIsSuccessfulDispatchZod,
    },
  );

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isSuccessful: parsedResult.safeUnwrap().data.payload,
  };
}

function loginReducer_setPassword(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSafeSync(
    {
      object: dispatch,
      zSchema: setPasswordDispatchZod,
    },
  );

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    password: parsedResult.safeUnwrap().data.payload,
  };
}

function loginReducer_setUsername(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSafeSync(
    {
      object: dispatch,
      zSchema: setUsernameDispatchZod,
    },
  );

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    username: parsedResult.safeUnwrap().data.payload,
  };
}

export {
  loginReducer,
  loginReducer_setIsLoading,
  loginReducer_setIsSubmitting,
  loginReducer_setIsSuccessful,
  loginReducer_setPassword,
  loginReducer_setUsername,
};
