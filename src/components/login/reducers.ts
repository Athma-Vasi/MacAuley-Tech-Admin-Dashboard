import type { SetPageInErrorPayload } from "../../types";
import { type LoginAction, loginAction } from "./actions";
import type { LoginDispatch, LoginState } from "./types";

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
    [loginAction.setPageInError, loginReducer_setPageInError],
    [loginAction.setPassword, loginReducer_setPassword],
    [loginAction.setTriggerFormSubmit, loginReducer_setTriggerFormSubmit],
    [loginAction.setUsername, loginReducer_setUsername],
]);

function loginReducer_setIsLoading(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        isLoading: dispatch.payload as boolean,
    };
}

function loginReducer_setIsSubmitting(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        isSubmitting: dispatch.payload as boolean,
    };
}

function loginReducer_setIsSuccessful(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        isSuccessful: dispatch.payload as boolean,
    };
}

function loginReducer_setPageInError(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    const { kind, page } = dispatch.payload as SetPageInErrorPayload;
    const pagesInError = new Set(state.pagesInError);
    kind === "add" ? pagesInError.add(page) : pagesInError.delete(page);

    return {
        ...state,
        pagesInError,
    };
}

function loginReducer_setPassword(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        password: dispatch.payload as string,
    };
}

function loginReducer_setTriggerFormSubmit(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        triggerFormSubmit: dispatch.payload as boolean,
    };
}

function loginReducer_setUsername(
    state: LoginState,
    dispatch: LoginDispatch,
): LoginState {
    return {
        ...state,
        username: dispatch.payload as string,
    };
}

export { loginReducer };
