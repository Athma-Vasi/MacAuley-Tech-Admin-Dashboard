import { parseSyncSafe } from "../../utils";
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
    GeneralSearchCase,
    LimitPerPage,
    LogicalOperator,
    ModifyQueryChainPayload,
    QueryChain,
    QueryChainKind,
    QueryKind,
    QueryOperator,
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
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: resetToInitialDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return parsedResult.val.safeUnwrap().payload as QueryState;
}

function queryReducer_setProjectionFields(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setProjectionFieldsDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        projectionFields: parsedResult.val.safeUnwrap().payload as string[],
    };
}

function queryReducer_modifyQueryChains(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: modifyQueryChainsDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    const {
        index,
        logicalOperator,
        queryChainActions,
        queryLink,
        queryChainKind,
    } = parsedResult.val.safeUnwrap().payload as ModifyQueryChainPayload;
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

            const operations = Object
                .entries(
                    queryChains,
                ).reduce<
                {
                    filter: Record<
                        LogicalOperator,
                        "block" | "update" | "insert"
                    >;
                    sort: Record<
                        LogicalOperator,
                        "block" | "update" | "insert"
                    >;
                }
            >((acc, curr) => {
                const [qChainKind, qChains] = curr as [
                    QueryChainKind,
                    Record<LogicalOperator, QueryChain>,
                ];

                if (qChainKind !== queryChainKind) {
                    return acc;
                }

                Object.entries(qChains).forEach((chain) => {
                    const [logOper, qchain] = chain as [
                        LogicalOperator,
                        QueryChain,
                    ];

                    if (qchain.length === 0) {
                        acc[qChainKind][logOper] = "insert";
                        return acc;
                    }

                    qchain.forEach((queryLink) => {
                        const [qLField, _qLOperator, _qLValue] = queryLink;

                        const areFieldsSame = field === qLField;

                        if (areFieldsSame) {
                            if (logOper === "and") {
                                acc[qChainKind][logOper] = "update";
                            } else {
                                acc[qChainKind][logOper] = "insert";
                            }
                        } else {
                            acc[qChainKind][logOper] = "insert";
                        }
                    });
                });

                return acc;
            }, {
                filter: {
                    and: "block",
                    nor: "block",
                    or: "block",
                },
                sort: {
                    and: "block",
                    nor: "block",
                    or: "block",
                },
            });

            Object.entries(operations).forEach((curr) => {
                const [qChainKind, logicalOpers] = curr as [
                    QueryChainKind,
                    Record<LogicalOperator, "block" | "update" | "insert">,
                ];
                Object.entries(logicalOpers).forEach((chain) => {
                    const [logicalOper, operation] = chain as [
                        LogicalOperator,
                        "block" | "update" | "insert",
                    ];

                    if (
                        qChainKind !== queryChainKind ||
                        logicalOper !== logicalOperator ||
                        operation === "block"
                    ) {
                        return;
                    }

                    if (operation === "update") {
                        const existingQueryChain =
                            queryChains[queryChainKind][logicalOper];

                        const existingQueryLink = existingQueryChain.find(
                            (queryLink) => queryLink[0] === field,
                        );
                        if (existingQueryLink === undefined) {
                            return;
                        }

                        existingQueryLink[1] = comparisonOperator;
                        existingQueryLink[2] = value;
                    } else { // insert
                        const existingQueryLinks =
                            queryChains[queryChainKind][logicalOperator];

                        existingQueryLinks.push([
                            field,
                            comparisonOperator,
                            value,
                        ]);
                    }
                });
            });

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
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setFilterFieldDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        filterField: parsedResult.val.safeUnwrap().payload as string,
    };
}

function queryReducer_setFilterComparisonOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setFilterComparisonOperatorDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        filterComparisonOperator: parsedResult.val.safeUnwrap()
            .payload as QueryOperator,
    };
}

function queryReducer_setFilterLogicalOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setFilterLogicalOperatorDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        filterLogicalOperator: parsedResult.val.safeUnwrap()
            .payload as LogicalOperator,
    };
}

function queryReducer_setFilterValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setFilterValueDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        filterValue: parsedResult.val.safeUnwrap().payload as string,
    };
}

function queryReducer_setGeneralSearchCase(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setGeneralSearchCaseDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        generalSearchCase: parsedResult.val.safeUnwrap()
            .payload as GeneralSearchCase,
    };
}

function queryReducer_setGeneralSearchExclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setGeneralSearchExclusionValueDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        generalSearchExclusionValue: parsedResult.val.safeUnwrap()
            .payload as string,
    };
}

function queryReducer_setGeneralSearchInclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setGeneralSearchInclusionValueDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        generalSearchInclusionValue: parsedResult.val.safeUnwrap()
            .payload as string,
    };
}

function queryReducer_setIsError(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setIsErrorDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        isError: parsedResult.val.safeUnwrap().payload as boolean,
    };
}

function queryReducer_setIsSearchDisabled(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setIsSearchDisabledDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        isSearchDisabled: parsedResult.val.safeUnwrap().payload as boolean,
    };
}

function queryReducer_setLimitPerPage(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setLimitPerPageDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        limitPerPage: parsedResult.val.safeUnwrap().payload as LimitPerPage,
    };
}

function queryReducer_setSortDirection(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setSortDirectionDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        sortDirection: parsedResult.val.safeUnwrap().payload as SortDirection,
    };
}

function queryReducer_setSortField(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setSortFieldDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        sortField: parsedResult.val.safeUnwrap().payload as string,
    };
}

function queryReducer_setQueryKind(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const parsedResult = parseSyncSafe({
        object: dispatch,
        zSchema: setQueryKindDispatchZod,
    });

    if (parsedResult.err || parsedResult.val.none) {
        return state;
    }

    return {
        ...state,
        queryKind: parsedResult.val.safeUnwrap().payload as QueryKind,
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
