import type { QueryChains, QueryState } from "./types";

// function createInitialQueryState(
//     searchFieldSelectInputData: CheckboxRadioSelectData,
// ): QueryState {
//     const filterFieldsOperatorsValuesSetsMap = new Map([
//         [
//             "createdAt",
//             {
//                 comparisonOperatorsSet: new Set(),
//                 valuesSet: new Set(),
//             },
//         ],
//     ]) as FilterFieldsOperatorsValuesSetsMap;

//     const searchFieldsOperatorsValuesSetMap = new Map([
//         [searchFieldSelectInputData[0].value, new Set()],
//     ]) as SearchFieldsValuesSetMap;

//     const logicalOperatorChainsSetsMap = new Map([
//         [
//             "and",
//             {
//                 fieldsSet: new Set(),
//                 comparisonOperatorsSet: new Set(),
//                 valuesSet: new Set(),
//             },
//         ],
//     ]) as LogicalOperatorChainsSetsMap;

//     return initialQueryState;
// }

const initialQueryState: QueryState = {
    // date input type is guaranteed to exist (all schemas have createdAt & updatedAt)
    filterComparisonOperator: "in",
    filterField: "username",
    filterLogicalOperator: "and",
    filterValue: "",
    generalSearchCase: "case-insensitive",
    generalSearchExclusionValue: "",
    generalSearchInclusionValue: "",
    isError: false,
    isSearchDisabled: false,
    limitPerPage: "10",
    projectionFields: [],
    queryChains: {} as QueryChains,
    sortDirection: "descending",
    sortField: "updatedAt",
};

export { initialQueryState };
