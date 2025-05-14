import { CheckboxRadioSelectData } from "../../types";
import { ValidationKey } from "../../validations";
import { AccessibleDateTimeInputAttributes } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInputAttributes } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInputAttributes } from "../accessibleInputs/AccessibleTextInput";

type InputKind =
    | "date"
    | "number"
    | "select"
    | "text";

type QueryTemplateCommon = {
    name: ValidationKey;
    comparisonOperators: Set<QueryOperator>;
};

type QueryTemplate =
    | QueryTemplateCommon & {
        kind: "date";
        attributes: AccessibleDateTimeInputAttributes;
    }
    | QueryTemplateCommon & {
        kind: "number";
        attributes: AccessibleTextInputAttributes;
    }
    | QueryTemplateCommon & {
        kind: "text";
        attributes: AccessibleTextInputAttributes;
    }
    | QueryTemplateCommon & {
        kind: "select";
        data: CheckboxRadioSelectData;
        attributes: AccessibleSelectInputAttributes;
    };

type ComparisonOperator =
    | "equal to"
    | "greater than or equal to"
    | "greater than"
    | "less than or equal to"
    | "less than"
    | "not equal to";

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
    queryOperatorsSet: Set<QueryOperator>;
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

type MongoQueryOperator =
    | MongoComparisonOperator
    | "$in";

type QueryChain = Array<QueryLink>;

type QueryChainActions = "delete" | "insert";

type QueryChainKind = "filter" | "sort";

type QueryChains = Record<QueryChainKind, Record<LogicalOperator, QueryChain>>;

type QueryLink = [string, QueryOperator, string]; // [field, queryOperator, value]

type QueryOperator = ComparisonOperator | "in";

type SearchFieldsValuesSetMap = Map<string, Set<string>>;

type SortDirection = "ascending" | "descending";

type SortInputsType = "date" | "number" | "time";

type QueryKind = "filter" | "sort" | "search" | "projection";

type LimitPerPage = "10" | "25" | "50";

type QueryState = {
    filterComparisonOperator: QueryOperator;
    filterField: string; // almost ValidationKey
    filterLogicalOperator: LogicalOperator;
    filterValue: string;
    generalSearchCase: GeneralSearchCase;
    generalSearchExclusionValue: string;
    generalSearchInclusionValue: string;
    isError: boolean;
    isSearchDisabled: boolean;
    limitPerPage: LimitPerPage;
    projectionFields: string[];
    queryChains: QueryChains;
    queryKind: QueryKind;
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

export type {
    ComparisonOperator,
    FilterFieldsOperatorsValuesSetsMap,
    GeneralSearchCase,
    GeneralSearchKind,
    InputKind,
    LimitPerPage,
    LogicalOperator,
    LogicalOperatorChainsSets,
    LogicalOperatorChainsSetsMap,
    ModifyQueryChainPayload,
    MongoComparisonOperator,
    MongoQueryOperator,
    QueryChain,
    QueryChainActions,
    QueryChainKind,
    QueryChains,
    QueryKind,
    QueryLink,
    QueryOperator,
    QueryState,
    QueryTemplate,
    SearchFieldsValuesSetMap,
    SortDirection,
    SortInputsType,
};
