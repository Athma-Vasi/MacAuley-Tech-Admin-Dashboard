import type { QueryState } from "./types";

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
    queryChains: {
        filter: { and: [], nor: [], or: [] },
        sort: { and: [], nor: [], or: [] },
    },
    queryKind: "filter",
    sortDirection: "descending",
    sortField: "updatedAt",
};

export { initialQueryState };
