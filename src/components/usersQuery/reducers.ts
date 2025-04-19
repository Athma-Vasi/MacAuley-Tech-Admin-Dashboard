import { UsersQueryAction, usersQueryAction } from "./actions";
import { UsersQueryDispatch, UsersQueryState } from "./types";

function usersQueryReducer(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const reducer = usersQueryReducers.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const usersQueryReducers = new Map<
    UsersQueryAction[keyof UsersQueryAction],
    (state: UsersQueryState, dispatch: UsersQueryDispatch) => UsersQueryState
>([
    [usersQueryAction.setCurrentPage, usersQueryReducer_setCurrentPage],
    [usersQueryAction.setIsError, usersQueryReducer_setIsError],
    [usersQueryAction.setIsLoading, usersQueryReducer_setIsLoading],
    [usersQueryAction.setQueryString, usersQueryReducer_setQueryString],
    [usersQueryAction.setResourceData, usersQueryReducer_setResourceData],
    [usersQueryAction.setTotalDocuments, usersQueryReducer_setTotalDocuments],
]);

function usersQueryReducer_setCurrentPage(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const currentPage = dispatch.payload as number;
    return { ...state, currentPage };
}

function usersQueryReducer_setIsError(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const isError = dispatch.payload as boolean;
    return { ...state, isError };
}

function usersQueryReducer_setIsLoading(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const isLoading = dispatch.payload as boolean;
    return { ...state, isLoading };
}

function usersQueryReducer_setQueryString(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const queryString = dispatch.payload as string;
    return { ...state, queryString };
}

function usersQueryReducer_setResourceData(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const resourceData = dispatch.payload as Array<any>;
    return { ...state, resourceData };
}

function usersQueryReducer_setTotalDocuments(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const totalDocuments = dispatch.payload as number;
    return { ...state, totalDocuments };
}

export { usersQueryReducer };
