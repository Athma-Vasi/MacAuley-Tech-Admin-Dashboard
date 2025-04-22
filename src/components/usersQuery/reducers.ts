import { UserDocument } from "../../types";
import { SortDirection } from "../query/types";
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
    [usersQueryAction.resetToInitial, usersQueryReducer_resetToInitial],
    [
        usersQueryAction.setArrangeByDirection,
        usersQueryReducer_setArrangeByDirection,
    ],
    [
        usersQueryAction.setArrangeByDirection,
        usersQueryReducer_setArrangeByDirection,
    ],
    [usersQueryAction.setArrangeByField, usersQueryReducer_setArrangeByField],
    [usersQueryAction.setCurrentPage, usersQueryReducer_setCurrentPage],
    [usersQueryAction.setIsError, usersQueryReducer_setIsError],
    [usersQueryAction.setIsLoading, usersQueryReducer_setIsLoading],
    [usersQueryAction.setNewQueryFlag, usersQueryReducer_setNewQueryFlag],
    [usersQueryAction.setPages, usersQueryReducer_setPages],
    [usersQueryAction.setQueryString, usersQueryReducer_setQueryString],
    [usersQueryAction.setResourceData, usersQueryReducer_setResourceData],
    [usersQueryAction.setTotalDocuments, usersQueryReducer_setTotalDocuments],
]);

function usersQueryReducer_resetToInitial(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const initialState = dispatch.payload as UsersQueryState;
    return { ...state, ...initialState };
}

function usersQueryReducer_setArrangeByDirection(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const { arrangeByField, resourceData } = state;
    const arrangeByDirection = dispatch.payload as SortDirection;
    const cloned = structuredClone(resourceData);

    const sorted = cloned.sort((a, b) => {
        if (arrangeByDirection === "ascending") {
            return a[arrangeByField] > b[arrangeByField] ? 1 : -1;
        }
        return a[arrangeByField] < b[arrangeByField] ? 1 : -1;
    });

    return { ...state, arrangeByDirection, resourceData: sorted };
}

function usersQueryReducer_setArrangeByField(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const { arrangeByDirection, resourceData } = state;
    const arrangeByField = dispatch.payload as keyof UserDocument;
    const cloned = structuredClone(resourceData);

    const sorted = cloned.sort((a, b) => {
        if (arrangeByDirection === "ascending") {
            return a[arrangeByField] > b[arrangeByField] ? 1 : -1;
        }
        return a[arrangeByField] < b[arrangeByField] ? 1 : -1;
    });

    return { ...state, arrangeByField, resourceData: sorted };
}

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

function usersQueryReducer_setNewQueryFlag(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const newQueryFlag = dispatch.payload as boolean;
    return { ...state, newQueryFlag };
}

function usersQueryReducer_setPages(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const pages = dispatch.payload as number;
    return { ...state, pages };
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
