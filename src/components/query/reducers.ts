import { QueryAction, queryAction } from "./actions";
import type {
    GeneralSearchCase,
    LogicalOperator,
    ModifyQueryChainPayload,
    QueryDispatch,
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
]);

function queryReducer_setProjectionFields(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const projectionFields = dispatch.payload as string[];
    return { ...state, projectionFields };
}

function queryReducer_modifyQueryChains(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const {
        index,
        logicalOperator,
        queryChainActions,
        queryLink,
        queryChainKind,
    } = dispatch.payload as ModifyQueryChainPayload;
    const [field, comparisonOperator, value] = queryLink;
    const queryChains = structuredClone(state.queryChains);

    console.group("queryReducer_modifyQueryChains");
    console.log("queryChainKind", queryChainKind);
    console.log("queryLink", queryLink);
    console.log("queryChainActions", queryChainActions);
    console.log("logicalOperator", logicalOperator);
    console.log("index", index);
    console.groupEnd();

    switch (queryChainActions) {
        case "delete": {
            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];
            console.log("delete::existingQueryLinks", existingQueryLinks);
            const existingQueryLink = existingQueryLinks[index];
            console.log("delete::existingQueryLink", existingQueryLink);

            if (existingQueryLink === undefined) {
                return state;
            }

            const newQueryLinks = existingQueryLinks.splice(index, 1);
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
            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];

            console.log("insert::existingQueryLinks", existingQueryLinks);

            const [isFieldExists, isFieldValueExists] = existingQueryLinks
                .reduce(
                    (acc, queryLink) => {
                        const [qLField, qLOperator, qLValue] = queryLink;

                        if (field === qLField) {
                            acc[0] = true;
                        }
                        if (value === qLValue) {
                            acc[1] = true;
                        }

                        return acc;
                    },
                    [false, false],
                );

            if (isFieldValueExists) {
                return {
                    ...state,
                    queryChains,
                };
            }

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

        case "slideDown": {
            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];
            const existingQueryLink = existingQueryLinks[index];
            const nextQueryLink = existingQueryLinks[index + 1];
            if (existingQueryLink === undefined) {
                return state;
            }
            if (nextQueryLink === undefined) {
                return state;
            }
            existingQueryLinks[index] = nextQueryLink;
            existingQueryLinks[index + 1] = existingQueryLink;
            queryChains[queryChainKind][logicalOperator] = existingQueryLinks;

            return {
                ...state,
                queryChains,
            };
        }

        case "slideUp": {
            const existingQueryLinks =
                queryChains[queryChainKind][logicalOperator];
            const existingQueryLink = existingQueryLinks[index];
            const previousQueryLink = existingQueryLinks[index - 1];
            if (existingQueryLink === undefined) {
                return state;
            }
            if (previousQueryLink === undefined) {
                return state;
            }
            existingQueryLinks[index] = previousQueryLink;
            existingQueryLinks[index - 1] = existingQueryLink;
            queryChains[queryChainKind][logicalOperator] = existingQueryLinks;

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
    console.log("queryReducer_setFilterField", dispatch.payload);
    return {
        ...state,
        filterField: dispatch.payload as string,
    };
}

function queryReducer_setFilterComparisonOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        filterComparisonOperator: dispatch.payload as QueryOperator,
    };
}

function queryReducer_setFilterLogicalOperator(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        filterLogicalOperator: dispatch.payload as LogicalOperator,
    };
}

function queryReducer_setFilterValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return { ...state, filterValue: dispatch.payload as string };
}

function queryReducer_setGeneralSearchCase(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        generalSearchCase: dispatch.payload as GeneralSearchCase,
    };
}

function queryReducer_setGeneralSearchExclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        generalSearchExclusionValue: dispatch.payload as string,
    };
}

function queryReducer_setGeneralSearchInclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        generalSearchInclusionValue: dispatch.payload as string,
    };
}

function queryReducer_setIsError(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const isError = dispatch.payload as boolean;
    return { ...state, isError };
}

function queryReducer_setIsSearchDisabled(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return { ...state, isSearchDisabled: dispatch.payload as boolean };
}

function queryReducer_setLimitPerPage(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return { ...state, limitPerPage: dispatch.payload as string };
}

function queryReducer_setSortDirection(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return { ...state, sortDirection: dispatch.payload as SortDirection };
}

function queryReducer_setSortField(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return { ...state, sortField: dispatch.payload as string };
}

export { queryReducer };
