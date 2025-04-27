import { UserDocument } from "../../types";
import { parseSafeSync } from "../../utils";
import { UsersQueryAction, usersQueryAction } from "./actions";
import {
    resetToInitialDispatchZod,
    setArrangeByDirectionDispatchZod,
    setArrangeByFieldDispatchZod,
    setCurrentPageDispatchZod,
    setIsErrorDispatchZod,
    setIsLoadingDispatchZod,
    setNewQueryFlagDispatchZod,
    setPagesDispatchZod,
    setQueryStringDispatchZod,
    setResourceDataDispatchZod,
    setTotalDocumentsDispatchZod,
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
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: resetToInitialDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return parsedResult.safeUnwrap().data.payload;
}

function usersQueryReducer_setArrangeByDirection(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setArrangeByDirectionDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { arrangeByField, resourceData } = state;
    const arrangeByDirection = parsedResult.safeUnwrap().data.payload;
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
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setArrangeByFieldDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const { arrangeByDirection, resourceData } = state;
    const arrangeByField = parsedResult.safeUnwrap().data
        .payload as keyof UserDocument;
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
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setCurrentPageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        currentPage: parsedResult.safeUnwrap().data.payload as number,
    };
}

function usersQueryReducer_setIsError(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsErrorDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        isError: parsedResult.safeUnwrap().data.payload as boolean,
    };
}

function usersQueryReducer_setIsLoading(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsLoadingDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        isLoading: parsedResult.safeUnwrap().data.payload as boolean,
    };
}

function usersQueryReducer_setNewQueryFlag(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setNewQueryFlagDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        newQueryFlag: parsedResult.safeUnwrap().data.payload as boolean,
    };
}

function usersQueryReducer_setPages(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setPagesDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        pages: parsedResult.safeUnwrap().data.payload as number,
    };
}

function usersQueryReducer_setQueryString(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setQueryStringDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        queryString: parsedResult.safeUnwrap().data.payload as string,
    };
}

function usersQueryReducer_setResourceData(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setResourceDataDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        resourceData: parsedResult.safeUnwrap().data.payload as Array<
            UserDocument
        >,
    };
}

function usersQueryReducer_setTotalDocuments(
    state: UsersQueryState,
    dispatch: UsersQueryDispatch,
): UsersQueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setTotalDocumentsDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        totalDocuments: parsedResult.safeUnwrap().data.payload as number,
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
