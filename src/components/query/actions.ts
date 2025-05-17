import { Prettify } from "../../types";
import { QueryState } from "./types";

type QueryAction = Prettify<
    & {
        [K in keyof QueryState as `set${Capitalize<string & K>}`]:
            `set${Capitalize<string & K>}`;
    }
    & {
        resetToInitial: "resetToInitial";
        modifyQueryChains: "modifyQueryChains";
    }
>;

const queryAction: QueryAction = {
    resetToInitial: "resetToInitial",
    setSortField: "setSortField",
    setSortDirection: "setSortDirection",
    setProjectionFields: "setProjectionFields",
    setLimitPerPage: "setLimitPerPage",
    setIsSearchDisabled: "setIsSearchDisabled",
    setIsError: "setIsError",
    setGeneralSearchInclusionValue: "setGeneralSearchInclusionValue",
    setGeneralSearchExclusionValue: "setGeneralSearchExclusionValue",
    setGeneralSearchCase: "setGeneralSearchCase",
    setFilterValue: "setFilterValue",
    setFilterLogicalOperator: "setFilterLogicalOperator",
    setFilterField: "setFilterField",
    setFilterComparisonOperator: "setFilterComparisonOperator",
    setQueryKind: "setQueryKind",
    setQueryChains: "setQueryChains",
    modifyQueryChains: "modifyQueryChains",
};

export { queryAction };
export type { QueryAction };
