import { CheckboxRadioSelectData } from "../../types";
import { QueryAction } from "./actions";
import type { OperatorsInputType } from "./utils";

type ComparisonOperator =
    | "equal to"
    | "greater than or equal to"
    | "greater than"
    | "less than or equal to"
    | "less than"
    | "not equal to";

type FilterInputsType =
    | "boolean"
    | "date"
    | "number"
    | "select"
    | "text"
    | "time";

type FilterFieldsOperatorsValuesSetsMap = Map<
    string,
    {
        comparisonOperatorsSet: Set<string>;
        valuesSet: Set<string>;
    }
>;

type GeneralSearchCase = "case-sensitive" | "case-insensitive";

type GeneralSearchKind = "inclusion" | "exclusion";

type LogicalOperator = "and" | "nor" | "or";

type LogicalOperatorChainsSets = {
    fieldsSet: Set<string>;
    comparisonOperatorsSet: Set<QueryOperator>;
    valuesSet: Set<string>;
};

type LogicalOperatorChainsSetsMap = Map<
    LogicalOperator,
    LogicalOperatorChainsSets
>;

type MongoComparisonOperator =
    | "$eq"
    | "$gt"
    | "$gte"
    | "$lt"
    | "$lte"
    | "$ne";

type QueryChain = Array<QueryLink>;

type QueryChainActions = "delete" | "insert" | "slideUp" | "slideDown";

type QueryChainKind = "filter" | "sort";

type QueryChains = Record<QueryChainKind, Map<LogicalOperator, QueryChain>>;

type QueryLink = [string, QueryOperator, string]; // [field, comparisonOperator, value]

type QueryOperator = ComparisonOperator | "in";

type SearchFieldsValuesSetMap = Map<string, Set<string>>;

type SortDirection = "ascending" | "descending";

type SortInputsType = "date" | "number" | "time";

type QueryState = {
    filterField: string;
    filterLogicalOperator: LogicalOperator;
    filterComparisonOperator: QueryOperator;
    filterValue: string;
    generalSearchCase: GeneralSearchCase;
    generalSearchExclusionValue: string;
    generalSearchInclusionValue: string;
    isError: boolean;
    isSearchDisabled: boolean;
    limitPerPage: string;
    sortDirection: SortDirection;
    sortField: string;
};

type ModifyQueryChainPayload = {
    index: number;
    logicalOperator: LogicalOperator;
    queryChainActions: QueryChainActions;
    queryChainKind: QueryChainKind;
    queryLink: QueryLink;
};

type ModifyQueryChainsDispatch = React.Dispatch<{
    action: QueryAction["modifyQueryChains"];
    payload: ModifyQueryChainPayload;
}>;

type QueryFilterPayload = {
    fieldNamesOperatorsTypesMap: Map<string, OperatorsInputType>;
    searchFieldSelectInputData: CheckboxRadioSelectData;
    selectInputsDataMap: Map<string, CheckboxRadioSelectData>;
    value: string;
};

type QueryDispatch =
    | {
        action: QueryAction["modifyQueryChains"];
        payload: ModifyQueryChainPayload;
    }
    | {
        action: QueryAction["setFilterField"];
        payload: string;
    }
    | {
        action: QueryAction["setFilterComparisonOperator"];
        payload: QueryOperator;
    }
    | {
        action: QueryAction["setFilterLogicalOperator"];
        payload: LogicalOperator;
    }
    | {
        action: QueryAction["setFilterValue"];
        payload: string;
    }
    | {
        action: QueryAction["setGeneralSearchExclusionValue"];
        payload: string;
    }
    | {
        action: QueryAction["setGeneralSearchInclusionValue"];
        payload: string;
    }
    | {
        action: QueryAction["setIsError"];
        payload: boolean;
    }
    | {
        action: QueryAction["setGeneralSearchCase"];
        payload: GeneralSearchCase;
    }
    | {
        action: QueryAction["setIsSearchDisabled"];
        payload: boolean;
    }
    | {
        action: QueryAction["setLimitPerPage"];
        payload: string;
    }
    | {
        action: QueryAction["setSortDirection"];
        payload: SortDirection;
    }
    | {
        action: QueryAction["setSortField"];
        payload: string;
    };

export type {
    ComparisonOperator,
    FilterFieldsOperatorsValuesSetsMap,
    FilterInputsType,
    GeneralSearchCase,
    GeneralSearchKind,
    LogicalOperator,
    LogicalOperatorChainsSets,
    LogicalOperatorChainsSetsMap,
    ModifyQueryChainPayload,
    ModifyQueryChainsDispatch,
    MongoComparisonOperator,
    QueryChain,
    QueryChainActions,
    QueryChainKind,
    QueryChains,
    QueryDispatch,
    QueryFilterPayload,
    QueryLink,
    QueryOperator,
    QueryState,
    SearchFieldsValuesSetMap,
    SortDirection,
    SortInputsType,
};
