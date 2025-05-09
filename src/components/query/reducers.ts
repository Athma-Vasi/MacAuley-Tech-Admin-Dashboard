import { parseSafeSync } from "../../utils";
import { QueryAction, queryAction } from "./actions";
import {
    modifyQueryChainsDispatchZod,
    QueryDispatch,
    resetToInitialDispatchZod,
    setFilterComparisonOperatorDispatchZod,
    setFilterFieldDispatchZod,
    setFilterLogicalOperatorDispatchZod,
    setFilterValueDispatchZod,
    setGeneralSearchCaseDispatchZod,
    setGeneralSearchExclusionValueDispatchZod,
    setGeneralSearchInclusionValueDispatchZod,
    setIsErrorDispatchZod,
    setIsSearchDisabledDispatchZod,
    setLimitPerPageDispatchZod,
    setProjectionFieldsDispatchZod,
    setQueryKindDispatchZod,
    setSortDirectionDispatchZod,
    setSortFieldDispatchZod,
} from "./schemas";
import type {
    LimitPerPage,
    ModifyQueryChainPayload,
    QueryKind,
    QueryState,
    SortDirection,
} from "./types";

function queryReducer(state: QueryState, dispatch: QueryDispatch): QueryState {
    const reducer = queryReducers.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const queryReducers = new Map<
    QueryAction[keyof QueryAction],
    (state: QueryState, dispatch: QueryDispatch) => QueryState
>([
    [queryAction.resetToInitial, queryReducer_resetToInitial],
    [queryAction.setProjectionFields, queryReducer_setProjectionFields],
    [queryAction.modifyQueryChains, queryReducer_modifyQueryChains],
    [queryAction.setFilterField, queryReducer_setFilterField],
    [
        queryAction.setFilterComparisonOperator,
        queryReducer_setFilterComparisonOperator,
    ],
    [
        queryAction.setFilterLogicalOperator,
        queryReducer_setFilterLogicalOperator,
    ],
    [queryAction.setFilterValue, queryReducer_setFilterValue],
    [
        queryAction.setGeneralSearchExclusionValue,
        queryReducer_setGeneralSearchExclusionValue,
    ],
    [
        queryAction.setGeneralSearchInclusionValue,
        queryReducer_setGeneralSearchInclusionValue,
    ],
    [queryAction.setGeneralSearchCase, queryReducer_setGeneralSearchCase],
    [queryAction.setIsError, queryReducer_setIsError],
    [queryAction.setIsSearchDisabled, queryReducer_setIsSearchDisabled],
    [queryAction.setLimitPerPage, queryReducer_setLimitPerPage],
    [queryAction.setSortDirection, queryReducer_setSortDirection],
    [queryAction.setSortField, queryReducer_setSortField],
    [queryAction.setQueryKind, queryReducer_setQueryKind],
]);

function queryReducer_resetToInitial(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: resetToInitialDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        ...parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setProjectionFields(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setProjectionFieldsDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        projectionFields: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_modifyQueryChains(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: modifyQueryChainsDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    const {
        index,
        logicalOperator,
        queryChainActions,
        queryLink,
        queryChainKind,
    } = parsedResult.safeUnwrap().data?.payload as ModifyQueryChainPayload;
    const [field, comparisonOperator, value] = queryLink;
    const queryChains = structuredClone(state.queryChains);

    switch (queryChainActions) {
        case "delete": {
            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];
            const newQueryLinks = existingQueryLinks.filter(
                (_queryLink, i) => i !== index,
            );

            queryChains[queryChainKind][logicalOperator] = newQueryLinks;

            return {
                ...state,
                queryChains,
            };
        }

        case "insert": {
            if (value.length === 0) {
                return state;
            }

            const {
                isAndLinkExists,
                isNorLinkExists,
                isOrLinkExists,
                isSortLinkExists,
            } = Object
                .entries(
                    queryChains,
                ).reduce((acc, curr) => {
                    const [queryChainKind, queryChains] = curr;

                    Object.entries(queryChains).forEach((chain) => {
                        const [logOper, qchain] = chain;

                        qchain.forEach((queryLink) => {
                            const [qLField, _qLOperator, qLValue] = queryLink;

                            if (queryChainKind === "filter") {
                                if (
                                    field === qLField &&
                                    value === qLValue
                                ) {
                                    if (logOper === "nor") {
                                        acc.isNorLinkExists = true;
                                    }

                                    if (logOper === "and") {
                                        acc.isAndLinkExists = true;
                                    }

                                    if (logOper === "or") {
                                        acc.isOrLinkExists = true;
                                    }
                                }
                            }

                            if (queryChainKind === "sort") {
                                if (field === qLField) {
                                    if (logOper === "and") {
                                        acc.isSortLinkExists = true;
                                    }
                                }
                            }
                        });
                    });

                    return acc;
                }, {
                    isNorLinkExists: false,
                    isAndLinkExists: false,
                    isOrLinkExists: false,
                    isSortLinkExists: false,
                });

            if (isNorLinkExists && logicalOperator === "nor") {
                return state;
            }
            if (isAndLinkExists && logicalOperator === "and") {
                return state;
            }
            if (isOrLinkExists && logicalOperator === "or") {
                return state;
            }
            if (isSortLinkExists && queryChainKind === "sort") {
                // find the existing link and update it
                const existingQueryChain =
                    queryChains[queryChainKind][logicalOperator];

                const existingQueryLink = existingQueryChain.find(
                    (queryLink) => queryLink[0] === field,
                );
                if (existingQueryLink === undefined) {
                    return state;
                }

                existingQueryLink[1] = comparisonOperator;
                existingQueryLink[2] = value;
                queryChains[queryChainKind][logicalOperator] =
                    existingQueryChain;

                return {
                    ...state,
                    queryChains,
                };
            }

            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];

            existingQueryLinks.push([
                field,
                comparisonOperator,
                value,
            ]);

            return {
                ...state,
                queryChains,
            };
        }

        default:
            return state;
    }
}

function queryReducer_setFilterField(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setFilterFieldDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        filterField: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setFilterComparisonOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setFilterComparisonOperatorDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        filterComparisonOperator: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setFilterLogicalOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setFilterLogicalOperatorDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        filterLogicalOperator: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setFilterValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setFilterValueDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        filterValue: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setGeneralSearchCase(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setGeneralSearchCaseDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        generalSearchCase: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setGeneralSearchExclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setGeneralSearchExclusionValueDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        generalSearchExclusionValue: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setGeneralSearchInclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setGeneralSearchInclusionValueDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        generalSearchInclusionValue: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setIsError(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsErrorDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return { ...state, isError: parsedResult.safeUnwrap().data?.payload };
}

function queryReducer_setIsSearchDisabled(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setIsSearchDisabledDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        isSearchDisabled: parsedResult.safeUnwrap().data?.payload,
    };
}

function queryReducer_setLimitPerPage(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setLimitPerPageDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        limitPerPage: parsedResult.safeUnwrap().data?.payload as LimitPerPage,
    };
}

function queryReducer_setSortDirection(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setSortDirectionDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        sortDirection: parsedResult.safeUnwrap().data?.payload as SortDirection,
    };
}

function queryReducer_setSortField(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setSortFieldDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        sortField: parsedResult.safeUnwrap().data?.payload as string,
    };
}

function queryReducer_setQueryKind(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSafeSync({
        object: dispatch,
        zSchema: setQueryKindDispatchZod,
    });

    if (parsedResult.err) {
        return state;
    }

    return {
        ...state,
        queryKind: parsedResult.safeUnwrap().data?.payload as QueryKind,
    };
}

export {
    queryReducer,
    queryReducer_modifyQueryChains,
    queryReducer_resetToInitial,
    queryReducer_setFilterComparisonOperator,
    queryReducer_setFilterField,
    queryReducer_setFilterLogicalOperator,
    queryReducer_setFilterValue,
    queryReducer_setGeneralSearchCase,
    queryReducer_setGeneralSearchExclusionValue,
    queryReducer_setGeneralSearchInclusionValue,
    queryReducer_setIsError,
    queryReducer_setIsSearchDisabled,
    queryReducer_setLimitPerPage,
    queryReducer_setProjectionFields,
    queryReducer_setQueryKind,
    queryReducer_setSortDirection,
    queryReducer_setSortField,
};
