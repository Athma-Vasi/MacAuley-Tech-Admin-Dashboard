import type { SetPageInErrorPayload } from "../../types";
import { type QueryAction, queryAction } from "./actions";
import type {
    GeneralSearchCase,
    LogicalOperator,
    ModifyQueryChainPayload,
    QueryDispatch,
    QueryFilterPayload,
    QueryOperator,
    QueryState,
    SortDirection,
} from "./types";
import { createQueryString } from "./utils";

function queryReducer(state: QueryState, dispatch: QueryDispatch): QueryState {
    const reducer = queryReducers.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const queryReducers = new Map<
    QueryAction[keyof QueryAction],
    (state: QueryState, dispatch: QueryDispatch) => QueryState
>([
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
    [
        queryAction.setFilterComparisonOperatorSelectData,
        queryReducer_setFilterComparisonOperatorSelectData,
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
    [
        queryAction.setProjectionExclusionFields,
        queryReducer_setProjectionExclusionFields,
    ],
    [queryAction.setSortDirection, queryReducer_setSortDirection],
    [queryAction.setSortField, queryReducer_setSortField],
]);

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

    const logicalOperatorChainsSetsMap = structuredClone(
        state.logicalOperatorChainsSetsMap,
    );
    const { comparisonOperatorsSet, fieldsSet, valuesSet } =
        logicalOperatorChainsSetsMap.get(logicalOperator) ?? {
            fieldsSet: new Set(),
            comparisonOperatorsSet: new Set(),
            valuesSet: new Set(),
        };

    const logicalOperatorChainsMap = structuredClone(
        queryChainKind === "filter"
            ? state.queryChains.filter
            : state.queryChains.sort,
    );
    const chains = logicalOperatorChainsMap.get(logicalOperator) ?? [];

    console.group("queryReducer_modifyQueryChains");
    console.log("chains", chains);
    console.log("fieldsSet", fieldsSet);
    console.log("comparisonOperatorsSet", comparisonOperatorsSet);
    console.log("valuesSet", valuesSet);
    console.log("field", field);
    console.log("comparisonOperator", comparisonOperator);
    console.log("value", value);
    console.log("queryChainKind", queryChainKind);
    console.log("logicalOperator", logicalOperator);
    console.log("queryChainActions", queryChainActions);

    switch (queryChainActions) {
        case "delete": {
            chains.splice(index, 1);
            logicalOperatorChainsMap.set(logicalOperator, chains);
            fieldsSet.delete(field);
            comparisonOperatorsSet.delete(comparisonOperator);
            valuesSet.delete(value);
            logicalOperatorChainsSetsMap.set(logicalOperator, {
                fieldsSet,
                comparisonOperatorsSet,
                valuesSet,
            });

            console.log("delete");

            const newQueryChains = {
                ...state.queryChains,
                [queryChainKind]: logicalOperatorChainsMap,
            };

            const queryString = createQueryString({
                generalSearchCase: state.generalSearchCase,
                generalSearchExclusionValue: state.generalSearchExclusionValue,
                generalSearchInclusionValue: state.generalSearchInclusionValue,
                limitPerPage: state.limitPerPage,
                projectionExclusionFields: state.projectionExclusionFields,
                queryChains: newQueryChains,
            });

            return {
                ...state,
                logicalOperatorChainsSetsMap,
                queryChains: newQueryChains,
                queryString,
            };
        }

        case "insert": {
            if (value.length === 0) {
                return state;
            }

            // field exists, operator exists, value exists
            if (
                fieldsSet.has(field) &&
                comparisonOperatorsSet.has(comparisonOperator) &&
                valuesSet.has(value)
            ) {
                console.log("field exists, operator exists, value exists");

                return state;
            }

            // field exists, operator exists, value is unique
            if (
                fieldsSet.has(field) &&
                comparisonOperatorsSet.has(comparisonOperator) &&
                !valuesSet.has(value)
            ) {
                const index = chains.findIndex(
                    (
                        [field_, comparisonOperator_, _]: [
                            string,
                            string,
                            string,
                        ],
                    ) => field_ === field &&
                        comparisonOperator_ === comparisonOperator,
                );
                chains.splice(index, 1, queryLink);

                console.log("field exists, operator exists, value is unique");
            }

            // field exists, operator is unique, value exists
            if (
                fieldsSet.has(field) &&
                !comparisonOperatorsSet.has(comparisonOperator) &&
                valuesSet.has(value)
            ) {
                const index = chains.findIndex(
                    ([field_, _, value_]: [string, string, string]) =>
                        field_ === field && value_ === value,
                );
                chains.splice(index, 1, queryLink);

                console.log("field exists, operator is unique, value exists");
            }

            // field exists, operator is unique, value is unique
            if (
                fieldsSet.has(field) &&
                !comparisonOperatorsSet.has(comparisonOperator) &&
                !valuesSet.has(value)
            ) {
                chains.splice(index, 1, queryLink);

                console.log(
                    "field exists, operator is unique, value is unique",
                );
            }

            // field is unique
            if (!fieldsSet.has(field)) {
                chains.push(queryLink);

                console.log("field is unique");
                console.groupEnd();
            }

            logicalOperatorChainsMap.set(logicalOperator, chains);

            fieldsSet.add(field);
            comparisonOperatorsSet.add(comparisonOperator);
            valuesSet.add(value);
            logicalOperatorChainsSetsMap.set(logicalOperator, {
                fieldsSet,
                comparisonOperatorsSet,
                valuesSet,
            });

            const newQueryChains = {
                ...state.queryChains,
                [queryChainKind]: logicalOperatorChainsMap,
            };

            const queryString = createQueryString({
                generalSearchCase: state.generalSearchCase,
                generalSearchExclusionValue: state.generalSearchExclusionValue,
                generalSearchInclusionValue: state.generalSearchInclusionValue,
                limitPerPage: state.limitPerPage,
                projectionExclusionFields: state.projectionExclusionFields,
                queryChains: newQueryChains,
            });

            return {
                ...state,
                logicalOperatorChainsSetsMap,
                queryChains: newQueryChains,
                queryString,
            };
        }

        case "slideDown": {
            const belowLink = chains[index + 1];
            const currentLink = chains[index];
            chains[index] = belowLink;
            chains[index + 1] = currentLink;
            logicalOperatorChainsMap.set(logicalOperator, chains);

            const newQueryChains = {
                ...state.queryChains,
                [queryChainKind]: logicalOperatorChainsMap,
            };

            const queryString = createQueryString({
                generalSearchCase: state.generalSearchCase,
                generalSearchExclusionValue: state.generalSearchExclusionValue,
                generalSearchInclusionValue: state.generalSearchInclusionValue,
                limitPerPage: state.limitPerPage,
                projectionExclusionFields: state.projectionExclusionFields,
                queryChains: newQueryChains,
            });

            return {
                ...state,
                queryChains: newQueryChains,
                queryString,
            };
        }

        case "slideUp": {
            const aboveLink = chains[index - 1];
            const currentLink = chains[index];
            chains[index] = aboveLink;
            chains[index - 1] = currentLink;
            logicalOperatorChainsMap.set(logicalOperator, chains);

            const newQueryChains = {
                ...state.queryChains,
                [queryChainKind]: logicalOperatorChainsMap,
            };

            const queryString = createQueryString({
                generalSearchCase: state.generalSearchCase,
                generalSearchExclusionValue: state.generalSearchExclusionValue,
                generalSearchInclusionValue: state.generalSearchInclusionValue,
                limitPerPage: state.limitPerPage,
                projectionExclusionFields: state.projectionExclusionFields,
                queryChains: newQueryChains,
            });

            return {
                ...state,
                queryChains: newQueryChains,
                queryString,
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
    const {
        fieldNamesOperatorsTypesMap,
        value,
        selectInputsDataMap,
        searchFieldSelectInputData,
    } = dispatch.payload as QueryFilterPayload;

    console.group("queryReducer_setFilterField");

    const filterField = value;

    console.log("filterField", filterField);

    const operatorTypes = fieldNamesOperatorsTypesMap.get(value);

    console.log("operatorTypes", operatorTypes);

    const selectInputData = selectInputsDataMap.get(value);

    console.log("selectInputData", selectInputData);

    console.groupEnd();

    if (operatorTypes === undefined) {
        return {
            ...state,
            filterField,
            filterComparisonOperator: "in",
            filterValue: "",
        };
    }

    if (selectInputData === undefined) {
        return {
            ...state,
            filterField,
            filterComparisonOperator: operatorTypes.operators[0]
                .label as QueryOperator,
            filterValue: searchFieldSelectInputData.map(({ value }) =>
                    value.includes(filterField)
                )
                ? "" // text input initialized with empty string
                : new Date().toISOString().split("T")[0], // date input initialized with current date
        };
    }

    const { operators } = operatorTypes;
    const filterComparisonOperator = operators[0].label as QueryOperator;
    const filterValue = selectInputData[0].value;

    return {
        ...state,
        filterField,
        filterComparisonOperator,
        filterValue,
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

function queryReducer_setFilterComparisonOperatorSelectData(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    return {
        ...state,
        filterComparisonOperatorSelectData: dispatch.payload as string[],
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
    const generalSearchExclusionValue = dispatch.payload as string;
    const queryString = createQueryString({
        generalSearchCase: state.generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue: state.generalSearchInclusionValue,
        limitPerPage: state.limitPerPage,
        projectionExclusionFields: state.projectionExclusionFields,
        queryChains: state.queryChains,
    });

    return { ...state, generalSearchExclusionValue, queryString };
}

function queryReducer_setGeneralSearchInclusionValue(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const generalSearchInclusionValue = dispatch.payload as string;
    const queryString = createQueryString({
        generalSearchCase: state.generalSearchCase,
        generalSearchExclusionValue: state.generalSearchExclusionValue,
        generalSearchInclusionValue,
        limitPerPage: state.limitPerPage,
        projectionExclusionFields: state.projectionExclusionFields,
        queryChains: state.queryChains,
    });

    return { ...state, generalSearchInclusionValue, queryString };
}

function queryReducer_setIsError(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const { kind } = dispatch.payload as SetPageInErrorPayload;
    return { ...state, isError: kind === "add" };
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
    const limitPerPage = dispatch.payload as string;
    const queryString = createQueryString({
        generalSearchCase: state.generalSearchCase,
        generalSearchExclusionValue: state.generalSearchExclusionValue,
        generalSearchInclusionValue: state.generalSearchInclusionValue,
        limitPerPage,
        projectionExclusionFields: state.projectionExclusionFields,
        queryChains: state.queryChains,
    });

    return { ...state, limitPerPage, queryString };
}

function queryReducer_setProjectionExclusionFields(
    state: QueryState,
    dispatch: QueryDispatch,
): QueryState {
    const projectionExclusionFields = dispatch.payload as string[];
    const queryString = createQueryString({
        generalSearchCase: state.generalSearchCase,
        generalSearchExclusionValue: state.generalSearchExclusionValue,
        generalSearchInclusionValue: state.generalSearchInclusionValue,
        limitPerPage: state.limitPerPage,
        projectionExclusionFields,
        queryChains: state.queryChains,
    });

    return { ...state, projectionExclusionFields, queryString };
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
