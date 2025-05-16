import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../constants";
import { queryAction } from "./actions";
import {
    queryReducer_modifyQueryChains,
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
} from "./reducers";
import { QueryDispatch } from "./schemas";
import { initialQueryState } from "./state";
import {
    GeneralSearchCase,
    LimitPerPage,
    LogicalOperator,
    QueryKind,
    QueryOperator,
    SortDirection,
} from "./types";

describe("queryReducer_modifyQueryChains", () => {
    it("should insert a link correctly", () => {
        const link = [
            "firstName",
            "in",
            "John",
        ];
        const dispatch: QueryDispatch = {
            action: queryAction.modifyQueryChains,
            payload: {
                index: 0,
                logicalOperator: "and",
                queryChainActions: "insert",
                queryChainKind: "filter",
                queryLink: link,
            },
        };
        const state = queryReducer_modifyQueryChains(
            initialQueryState,
            dispatch,
        );
        expect(state.queryChains.filter.and[0]).toEqual(link);
    });
    it("should delete a link correctly", () => {
        const link = [
            "firstName",
            "in",
            "John",
        ];
        const dispatch: QueryDispatch = {
            action: queryAction.modifyQueryChains,
            payload: {
                index: 0,
                logicalOperator: "and",
                queryChainActions: "delete",
                queryChainKind: "filter",
                queryLink: link,
            },
        };
        const state = queryReducer_modifyQueryChains(
            initialQueryState,
            dispatch,
        );
        expect(state.queryChains.filter.and).toEqual([]);
    });
});

describe("queryReducer_setFilterComparisonOperator", () => {
    it("should set the filter comparison operator correctly", () => {
        const queryOperators: Array<QueryOperator> = [
            "in",
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
            "not equal to",
        ];
        queryOperators.forEach((operator) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterComparisonOperator,
                payload: operator,
            };
            const state = queryReducer_setFilterComparisonOperator(
                initialQueryState,
                dispatch,
            );
            expect(state.filterComparisonOperator).toBe(operator);
        });
    });
    it("should not set an invalid filter comparison operator", () => {
        const initialFilterComparisonOperator =
            initialQueryState.filterComparisonOperator;
        INVALID_STRINGS.forEach((operator) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterComparisonOperator,
                payload: operator as any,
            };
            const state = queryReducer_setFilterComparisonOperator(
                initialQueryState,
                dispatch,
            );
            expect(state.filterComparisonOperator).toBe(
                initialFilterComparisonOperator,
            );
        });
    });
});

describe("queryReducer_setFilterField", () => {
    it("should set the filter field correctly", () => {
        const filterFields = [
            "firstName",
            "lastName",
            "email",
        ];
        filterFields.forEach((field) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterField,
                payload: field,
            };
            const state = queryReducer_setFilterField(
                initialQueryState,
                dispatch,
            );
            expect(state.filterField).toBe(field);
        });
    });
    it("should not set an invalid filter field", () => {
        const initialFilterField = initialQueryState.filterField;
        INVALID_STRINGS.forEach((field) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterField,
                payload: field as any,
            };
            const state = queryReducer_setFilterField(
                initialQueryState,
                dispatch,
            );
            expect(state.filterField).toBe(initialFilterField);
        });
    });
});

describe("queryReducer_setFilterLogicalOperator", () => {
    it("should set the filter logical operator correctly", () => {
        const logicalOperators: Array<LogicalOperator> = ["and", "or", "nor"];
        logicalOperators.forEach((operator) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterLogicalOperator,
                payload: operator,
            };
            const state = queryReducer_setFilterLogicalOperator(
                initialQueryState,
                dispatch,
            );
            expect(state.filterLogicalOperator).toBe(operator);
        });
    });
    it("should not set an invalid filter logical operator", () => {
        const initialFilterLogicalOperator =
            initialQueryState.filterLogicalOperator;
        INVALID_STRINGS.forEach((operator) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterLogicalOperator,
                payload: operator as any,
            };
            const state = queryReducer_setFilterLogicalOperator(
                initialQueryState,
                dispatch,
            );
            expect(state.filterLogicalOperator).toBe(
                initialFilterLogicalOperator,
            );
        });
    });
});

describe("queryReducer_setFilterValue", () => {
    it("should set the filter value correctly", () => {
        const filterValues = [
            "John",
            "Doe",
            "Jane",
        ];
        filterValues.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterValue,
                payload: value,
            };
            const state = queryReducer_setFilterValue(
                initialQueryState,
                dispatch,
            );
            expect(state.filterValue).toBe(value);
        });
    });
    it("should not set an invalid filter value", () => {
        const initialFilterValue = initialQueryState.filterValue;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setFilterValue,
                payload: value as any,
            };
            const state = queryReducer_setFilterValue(
                initialQueryState,
                dispatch,
            );
            expect(state.filterValue).toBe(initialFilterValue);
        });
    });
});

describe("queryReducer_setGeneralSearchCase", () => {
    it("should set the general search case correctly", () => {
        const generalSearchCases: Array<GeneralSearchCase> = [
            "case-sensitive",
            "case-insensitive",
        ];
        generalSearchCases.forEach((caseType) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchCase,
                payload: caseType,
            };
            const state = queryReducer_setGeneralSearchCase(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchCase).toBe(caseType);
        });
    });
    it("should not set an invalid general search case", () => {
        const initialGeneralSearchCase = initialQueryState.generalSearchCase;
        INVALID_STRINGS.forEach((caseType) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchCase,
                payload: caseType as any,
            };
            const state = queryReducer_setGeneralSearchCase(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchCase).toBe(initialGeneralSearchCase);
        });
    });
});

describe("queryReducer_setGeneralSearchExclusionValue", () => {
    it("should set the general search exclusion value correctly", () => {
        const exclusionValues = [
            "John",
            "Doe",
            "Jane",
        ];
        exclusionValues.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchExclusionValue,
                payload: value,
            };
            const state = queryReducer_setGeneralSearchExclusionValue(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchExclusionValue).toBe(value);
        });
    });
    it("should not set an invalid general search exclusion value", () => {
        const initialGeneralSearchExclusionValue =
            initialQueryState.generalSearchExclusionValue;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchExclusionValue,
                payload: value as any,
            };
            const state = queryReducer_setGeneralSearchExclusionValue(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchExclusionValue).toBe(
                initialGeneralSearchExclusionValue,
            );
        });
    });
});

describe("queryReducer_setGeneralSearchInclusionValue", () => {
    it("should set the general search inclusion value correctly", () => {
        const inclusionValues = [
            "John",
            "Doe",
            "Jane",
        ];
        inclusionValues.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchInclusionValue,
                payload: value,
            };
            const state = queryReducer_setGeneralSearchInclusionValue(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchInclusionValue).toBe(value);
        });
    });
    it("should not set an invalid general search inclusion value", () => {
        const initialGeneralSearchInclusionValue =
            initialQueryState.generalSearchInclusionValue;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setGeneralSearchInclusionValue,
                payload: value as any,
            };
            const state = queryReducer_setGeneralSearchInclusionValue(
                initialQueryState,
                dispatch,
            );
            expect(state.generalSearchInclusionValue).toBe(
                initialGeneralSearchInclusionValue,
            );
        });
    });
});

describe("queryReducer_setIsError", () => {
    it("should set the isError state correctly", () => {
        VALID_BOOLEANS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setIsError,
                payload: value,
            };
            const state = queryReducer_setIsError(
                initialQueryState,
                dispatch,
            );
            expect(state.isError).toBe(value);
        });
    });
    it("should not set an invalid isError state", () => {
        const initialIsError = initialQueryState.isError;
        INVALID_BOOLEANS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setIsError,
                payload: value as any,
            };
            const state = queryReducer_setIsError(
                initialQueryState,
                dispatch,
            );
            expect(state.isError).toBe(initialIsError);
        });
    });
});

describe("queryReducer_setIsSearchDisabled", () => {
    it("should set the isSearchDisabled state correctly", () => {
        VALID_BOOLEANS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setIsSearchDisabled,
                payload: value,
            };
            const state = queryReducer_setIsSearchDisabled(
                initialQueryState,
                dispatch,
            );
            expect(state.isSearchDisabled).toBe(value);
        });
    });
    it("should not set an invalid isSearchDisabled state", () => {
        const initialIsSearchDisabled = initialQueryState.isSearchDisabled;
        INVALID_BOOLEANS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setIsSearchDisabled,
                payload: value as any,
            };
            const state = queryReducer_setIsSearchDisabled(
                initialQueryState,
                dispatch,
            );
            expect(state.isSearchDisabled).toBe(initialIsSearchDisabled);
        });
    });
});

describe("queryReducer_setLimitPerPage", () => {
    it("should set the limit per page correctly", () => {
        const limitPerPageValues: Array<LimitPerPage> = [
            "10",
            "25",
            "50",
        ];
        limitPerPageValues.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setLimitPerPage,
                payload: value,
            };
            const state = queryReducer_setLimitPerPage(
                initialQueryState,
                dispatch,
            );
            expect(state.limitPerPage).toBe(value);
        });
    });
    it("should not set an invalid limit per page", () => {
        const initialLimitPerPage = initialQueryState.limitPerPage;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setLimitPerPage,
                payload: value as any,
            };
            const state = queryReducer_setLimitPerPage(
                initialQueryState,
                dispatch,
            );
            expect(state.limitPerPage).toBe(initialLimitPerPage);
        });
    });
});

describe("queryReducer_setProjectionFields", () => {
    it("should set the projection fields correctly", () => {
        const projectionFields = [
            "firstName",
            "lastName",
            "email",
        ];
        const dispatch: QueryDispatch = {
            action: queryAction.setProjectionFields,
            payload: projectionFields,
        };
        const state = queryReducer_setProjectionFields(
            initialQueryState,
            dispatch,
        );
        expect(state.projectionFields).toEqual(projectionFields);
    });
    it("should not set an invalid projection fields", () => {
        const initialProjectionFields = initialQueryState.projectionFields;
        INVALID_STRINGS.forEach((value) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setProjectionFields,
                payload: value as any,
            };
            const state = queryReducer_setProjectionFields(
                initialQueryState,
                dispatch,
            );
            expect(state.projectionFields).toEqual(initialProjectionFields);
        });
    });
});

describe("queryReducer_setQueryKind", () => {
    it("should set the query kind correctly", () => {
        const queryKinds: Array<QueryKind> = [
            "filter",
            "sort",
            "search",
            "projection",
        ];
        queryKinds.forEach((kind) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setQueryKind,
                payload: kind,
            };
            const state = queryReducer_setQueryKind(
                initialQueryState,
                dispatch,
            );
            expect(state.queryKind).toBe(kind);
        });
    });
    it("should not set an invalid query kind", () => {
        const initialQueryKind = initialQueryState.queryKind;
        INVALID_STRINGS.forEach((kind) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setQueryKind,
                payload: kind as any,
            };
            const state = queryReducer_setQueryKind(
                initialQueryState,
                dispatch,
            );
            expect(state.queryKind).toBe(initialQueryKind);
        });
    });
});

describe("queryReducer_setSortDirection", () => {
    it("should set the sort direction correctly", () => {
        const sortDirections: Array<SortDirection> = [
            "ascending",
            "descending",
        ];
        sortDirections.forEach((direction) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setSortDirection,
                payload: direction,
            };
            const state = queryReducer_setSortDirection(
                initialQueryState,
                dispatch,
            );
            expect(state.sortDirection).toBe(direction);
        });
    });
    it("should not set an invalid sort direction", () => {
        const initialSortDirection = initialQueryState.sortDirection;
        INVALID_STRINGS.forEach((direction) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setSortDirection,
                payload: direction as any,
            };
            const state = queryReducer_setSortDirection(
                initialQueryState,
                dispatch,
            );
            expect(state.sortDirection).toBe(initialSortDirection);
        });
    });
});

describe("queryReducer_setSortField", () => {
    it("should set the sort field correctly", () => {
        const sortFields = [
            "firstName",
            "lastName",
            "email",
        ];
        sortFields.forEach((field) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setSortField,
                payload: field,
            };
            const state = queryReducer_setSortField(
                initialQueryState,
                dispatch,
            );
            expect(state.sortField).toBe(field);
        });
    });
    it("should not set an invalid sort field", () => {
        const initialSortField = initialQueryState.sortField;
        INVALID_STRINGS.forEach((field) => {
            const dispatch: QueryDispatch = {
                action: queryAction.setSortField,
                payload: field as any,
            };
            const state = queryReducer_setSortField(
                initialQueryState,
                dispatch,
            );
            expect(state.sortField).toBe(initialSortField);
        });
    });
});
