import { UserDocument } from "../../types";
import { parseSyncSafe } from "../../utils";
import { SortDirection } from "../query/types";
import { UsersQueryAction, usersQueryAction } from "./actions";
import {
    resetToInitialUsersQueryDispatchZod,
    setArrangeByDirectionUsersQueryDispatchZod,
    setArrangeByFieldUsersQueryDispatchZod,
    setCurrentPageUsersQueryDispatchZod,
    setIsErrorUsersQueryDispatchZod,
    setIsLoadingUsersQueryDispatchZod,
    setNewQueryFlagUsersQueryDispatchZod,
    setPagesUsersQueryDispatchZod,
    setQueryStringUsersQueryDispatchZod,
    setResourceDataUsersQueryDispatchZod,
    setTotalDocumentsUsersQueryDispatchZod,
    setUsersFetchWorkerUsersQueryDispatchZod,
    UsersQueryDispatch,
} from "./schemas";
import { UsersQueryState } from "./types";

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
    [
        usersQueryAction.setUsersFetchWorker,
        usersQueryReducer_setUsersFetchWorker,
    ],
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
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: resetToInitialUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return parsedResult.val.val.payload as UsersQueryState;
}

function usersQueryReducer_setArrangeByDirection(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setArrangeByDirectionUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    const { arrangeByField, resourceData } = state;
    const arrangeByDirection = parsedResult.val.val
        .payload as SortDirection;
    const cloned = structuredClone(resourceData);

    const sorted = cloned.sort((a, b) => {
        const aValue = a[arrangeByField] ?? "";
        const bValue = b[arrangeByField] ?? "";
        if (arrangeByDirection === "ascending") {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    return { ...state, arrangeByDirection, resourceData: sorted };
}

function usersQueryReducer_setArrangeByField(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setArrangeByFieldUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    const { arrangeByDirection, resourceData } = state;
    const arrangeByField = parsedResult.val.val
        .payload as keyof Omit<UserDocument, "password">;
    const cloned = structuredClone(resourceData);

    const sorted = cloned.sort((a, b) => {
        const aValue = a[arrangeByField] ?? "";
        const bValue = b[arrangeByField] ?? "";
        if (arrangeByDirection === "ascending") {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    return { ...state, arrangeByField, resourceData: sorted };
}

function usersQueryReducer_setCurrentPage(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setCurrentPageUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        currentPage: parsedResult.val.val.payload as number,
    };
}

function usersQueryReducer_setUsersFetchWorker(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setUsersFetchWorkerUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        usersFetchWorker: parsedResult.val.val.payload as
            | Worker
            | null,
    };
}

function usersQueryReducer_setIsError(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setIsErrorUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        isError: parsedResult.val.val.payload as boolean,
    };
}

function usersQueryReducer_setIsLoading(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setIsLoadingUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        isLoading: parsedResult.val.val.payload as boolean,
    };
}

function usersQueryReducer_setNewQueryFlag(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setNewQueryFlagUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        newQueryFlag: parsedResult.val.val.payload as boolean,
    };
}

function usersQueryReducer_setPages(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setPagesUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        pages: parsedResult.val.val.payload as number,
    };
}

function usersQueryReducer_setQueryString(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setQueryStringUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        queryString: parsedResult.val.val.payload as string,
    };
}

function usersQueryReducer_setResourceData(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setResourceDataUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        resourceData: parsedResult.val.val.payload as Array<
            UserDocument
        >,
    };
}

function usersQueryReducer_setTotalDocuments(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setTotalDocumentsUsersQueryDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        totalDocuments: parsedResult.val.val.payload as number,
    };
}

export {
    usersQueryReducer,
    usersQueryReducer_resetToInitial,
    usersQueryReducer_setArrangeByDirection,
    usersQueryReducer_setArrangeByField,
    usersQueryReducer_setCurrentPage,
    usersQueryReducer_setIsError,
    usersQueryReducer_setIsLoading,
    usersQueryReducer_setNewQueryFlag,
    usersQueryReducer_setPages,
    usersQueryReducer_setQueryString,
    usersQueryReducer_setResourceData,
    usersQueryReducer_setTotalDocuments,
};
