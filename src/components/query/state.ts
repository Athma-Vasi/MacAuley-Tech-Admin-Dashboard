import type { CheckboxRadioSelectData } from "../../types";
import type {
    FilterFieldsOperatorsValuesSetsMap,
    LogicalOperatorChainsSetsMap,
    QueryState,
    SearchFieldsValuesSetMap,
} from "./types";

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
    filterField: "username",
    filterFieldsOperatorsValuesSetsMap: new Map(),
    filterComparisonOperator: "in",
    filterComparisonOperatorSelectData: [],
    filterLogicalOperator: "and",
    filterValue: "",
    generalSearchCase: "case-insensitive",
    generalSearchExclusionValue: "",
    generalSearchInclusionValue: "",
    isError: false,
    isSearchDisabled: false,
    limitPerPage: "10",
    logicalOperatorChainsSetsMap: new Map(),
    projectionExclusionFields: [],
    queryChains: { filter: new Map(), sort: new Map() },
    queryString: "?",
    searchFieldsOperatorsValuesSetMap: new Map(),
    sortDirection: "descending",
    sortField: "updatedAt",
    sortFieldsSet: new Set(),
};

export { initialQueryState };
