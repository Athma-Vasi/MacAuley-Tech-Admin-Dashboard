import { z } from "zod";
import { queryAction } from "./actions";

const setFilterComparisonOperatorDispatchZod = z.object({
    action: z.literal(queryAction.setFilterComparisonOperator),
    payload: z.enum([
        "in",
        "equal to",
        "greater than or equal to",
        "greater than",
        "less than or equal to",
        "less than",
        "not equal to",
    ]),
});
const setFilterFieldDispatchZod = z.object({
    action: z.literal(queryAction.setFilterField),
    payload: z.string(),
});
const setFilterLogicalOperatorDispatchZod = z.object({
    action: z.literal(queryAction.setFilterLogicalOperator),
    payload: z.enum(["and", "or", "nor"]),
});
const setFilterValueDispatchZod = z.object({
    action: z.literal(queryAction.setFilterValue),
    payload: z.string(),
});
const setGeneralSearchCaseDispatchZod = z.object({
    action: z.literal(queryAction.setGeneralSearchCase),
    payload: z.enum(["case-sensitive", "case-insensitive"]),
});
const setGeneralSearchExclusionValueDispatchZod = z.object({
    action: z.literal(queryAction.setGeneralSearchExclusionValue),
    payload: z.string(),
});
const setGeneralSearchInclusionValueDispatchZod = z.object({
    action: z.literal(queryAction.setGeneralSearchInclusionValue),
    payload: z.string(),
});
const setIsErrorDispatchZod = z.object({
    action: z.literal(queryAction.setIsError),
    payload: z.boolean(),
});
const setIsSearchDisabledDispatchZod = z.object({
    action: z.literal(queryAction.setIsSearchDisabled),
    payload: z.boolean(),
});
const setLimitPerPageDispatchZod = z.object({
    action: z.literal(queryAction.setLimitPerPage),
    payload: z.enum([
        "10",
        "25",
        "50",
    ]),
});
const setProjectionFieldsDispatchZod = z.object({
    action: z.literal(queryAction.setProjectionFields),
    payload: z.array(z.string()),
});
const modifyQueryChainsDispatchZod = z.object({
    action: z.literal(queryAction.modifyQueryChains),
    payload: z.object({
        index: z.number(),
        logicalOperator: z.enum(["and", "or", "nor"]),
        queryChainActions: z.enum([
            "delete",
            "insert",
            "slideUp",
            "slideDown",
        ]),
        queryChainKind: z.enum([
            "filter",
            "sort",
        ]),
        queryLink: z.array(z.string()).length(3),
    }),
});
const setQueryKindDispatchZod = z.object({
    action: z.literal(queryAction.setQueryKind),
    payload: z.enum(["filter", "sort", "search", "projection"]),
});
const setSortDirectionDispatchZod = z.object({
    action: z.literal(queryAction.setSortDirection),
    payload: z.enum(["ascending", "descending"]),
});
const setSortFieldDispatchZod = z.object({
    action: z.literal(queryAction.setSortField),
    payload: z.string(),
});
const resetToInitialDispatchZod = z.object({
    action: z.literal(queryAction.resetToInitial),
    payload: z.object({
        filterComparisonOperator: z.enum([
            "in",
            "equal to",
            "greater than or equal to",
            "greater than",
            "less than or equal to",
            "less than",
            "not equal to",
        ]),
        filterField: z.string(),
        filterLogicalOperator: z.enum(["and", "or", "nor"]),
        filterValue: z.string(),
        generalSearchCase: z.enum(["case-sensitive", "case-insensitive"]),
        generalSearchExclusionValue: z.string(),
        generalSearchInclusionValue: z.string(),
        isError: z.boolean(),
        isSearchDisabled: z.boolean(),
        limitPerPage: z.enum(["10", "25", "50"]),
        projectionFields: z.array(z.string()),
        queryChains: z.object({}),
        queryKind: z.enum(["filter", "sort", "search", "projection"]),
        sortDirection: z.enum(["ascending", "descending"]),
        sortField: z.string(),
    }),
});

type QueryDispatch =
    | z.infer<typeof setFilterComparisonOperatorDispatchZod>
    | z.infer<typeof setFilterFieldDispatchZod>
    | z.infer<typeof setFilterLogicalOperatorDispatchZod>
    | z.infer<typeof setFilterValueDispatchZod>
    | z.infer<typeof setGeneralSearchCaseDispatchZod>
    | z.infer<typeof setGeneralSearchExclusionValueDispatchZod>
    | z.infer<typeof setGeneralSearchInclusionValueDispatchZod>
    | z.infer<typeof setIsErrorDispatchZod>
    | z.infer<typeof setIsSearchDisabledDispatchZod>
    | z.infer<typeof setLimitPerPageDispatchZod>
    | z.infer<typeof setProjectionFieldsDispatchZod>
    | z.infer<typeof modifyQueryChainsDispatchZod>
    | z.infer<typeof setQueryKindDispatchZod>
    | z.infer<typeof setSortDirectionDispatchZod>
    | z.infer<typeof setSortFieldDispatchZod>
    | z.infer<typeof resetToInitialDispatchZod>;

export {
    modifyQueryChainsDispatchZod,
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
};
export type { QueryDispatch };

/**
 * type QueryState = {
     filterComparisonOperator: QueryOperator;
     filterField: string; // almost ValidationKey
     filterLogicalOperator: LogicalOperator;
     filterValue: string;
     generalSearchCase: GeneralSearchCase;
     generalSearchExclusionValue: string;
     generalSearchInclusionValue: string;
     isError: boolean;
     isSearchDisabled: boolean;
     limitPerPage: string;
     projectionFields: string[];
     queryChains: QueryChains;
     queryKind: QueryKind;
     sortDirection: SortDirection;
     sortField: string;
 };
 */
