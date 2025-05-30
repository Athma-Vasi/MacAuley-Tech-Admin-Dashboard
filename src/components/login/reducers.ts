import { parseSyncSafe } from "../../utils";
import { type LoginAction, loginAction } from "./actions";
import {
  LoginDispatch,
  setCustomerMetricsWorkerLoginDispatchZod,
  setErrorMessageLoginDispatchZod,
  setFinancialMetricsGeneratedLoginDispatchZod,
  setFinancialMetricsWorkerLoginDispatchZod,
  setIsLoadingLoginDispatchZod,
  setIsSubmittingLoginDispatchZod,
  setIsSuccessfulLoginDispatchZod,
  setLoginFetchWorkerLoginDispatchZod,
  setPasswordLoginDispatchZod,
  setProductMetricsGeneratedLoginDispatchZod,
  setProductMetricsWorkerLoginDispatchZod,
  setRepairMetricsGeneratedLoginDispatchZod,
  setRepairMetricsWorkerLoginDispatchZod,
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
  [loginAction.setCustomerMetricsWorker, loginReducer_setCustomerMetricsWorker],
  [loginAction.setErrorMessage, loginReducer_setErrorMessage],
  [
    loginAction.setFinancialMetricsGenerated,
    loginReducer_setFinancialMetricsGenerated,
  ],
  [
    loginAction.setFinancialMetricsWorker,
    loginReducer_setFinancialMetricsWorker,
  ],
  [loginAction.setIsLoading, loginReducer_setIsLoading],
  [loginAction.setIsSubmitting, loginReducer_setIsSubmitting],
  [loginAction.setIsSuccessful, loginReducer_setIsSuccessful],
  [loginAction.setLoginFetchWorker, loginReducer_setLoginFetchWorker],
  [loginAction.setPassword, loginReducer_setPassword],
  [
    loginAction.setProductMetricsGenerated,
    loginReducer_setProductMetricsGenerated,
  ],
  [loginAction.setProductMetricsWorker, loginReducer_setProductMetricsWorker],
  [
    loginAction.setRepairMetricsGenerated,
    loginReducer_setRepairMetricsGenerated,
  ],
  [loginAction.setRepairMetricsWorker, loginReducer_setRepairMetricsWorker],
  [loginAction.setUsername, loginReducer_setUsername],
]);

function loginReducer_setCustomerMetricsWorker(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setCustomerMetricsWorkerLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    customerMetricsWorker: parsedResult.val.val.payload as Worker,
  };
}

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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    errorMessage: parsedResult.val.val.payload as string,
  };
}

function loginReducer_setFinancialMetricsGenerated(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setFinancialMetricsGeneratedLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    financialMetricsGenerated: parsedResult.val.val.payload as boolean,
  };
}

function loginReducer_setFinancialMetricsWorker(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setFinancialMetricsWorkerLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    financialMetricsWorker: parsedResult.val.val.payload as Worker,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isLoading: parsedResult.val.val.payload as boolean,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isSubmitting: parsedResult.val.val.payload as boolean,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isSuccessful: parsedResult.val.val.payload as boolean,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    loginFetchWorker: parsedResult.val.val.payload as Worker,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    password: parsedResult.val.val.payload as string,
  };
}

function loginReducer_setProductMetricsGenerated(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setProductMetricsGeneratedLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    productMetricsGenerated: parsedResult.val.val.payload as boolean,
  };
}

function loginReducer_setProductMetricsWorker(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setProductMetricsWorkerLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    productMetricsWorker: parsedResult.val.val.payload as Worker,
  };
}

function loginReducer_setRepairMetricsGenerated(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setRepairMetricsGeneratedLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    repairMetricsGenerated: parsedResult.val.val.payload as boolean,
  };
}

function loginReducer_setRepairMetricsWorker(
  state: LoginState,
  dispatch: LoginDispatch,
): LoginState {
  const parsedResult = parseSyncSafe(
    {
      object: dispatch,
      zSchema: setRepairMetricsWorkerLoginDispatchZod,
    },
  );

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    repairMetricsWorker: parsedResult.val.val.payload as Worker,
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

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    username: parsedResult.val.val.payload as string,
  };
}

export {
  loginReducer,
  loginReducer_setCustomerMetricsWorker,
  loginReducer_setErrorMessage,
  loginReducer_setFinancialMetricsGenerated,
  loginReducer_setFinancialMetricsWorker,
  loginReducer_setIsLoading,
  loginReducer_setIsSubmitting,
  loginReducer_setIsSuccessful,
  loginReducer_setLoginFetchWorker,
  loginReducer_setPassword,
  loginReducer_setProductMetricsGenerated,
  loginReducer_setProductMetricsWorker,
  loginReducer_setRepairMetricsGenerated,
  loginReducer_setRepairMetricsWorker,
  loginReducer_setUsername,
};
