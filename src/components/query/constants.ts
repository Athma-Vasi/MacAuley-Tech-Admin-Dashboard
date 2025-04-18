import type { CheckboxRadioSelectData } from "../../types";
import type {
    ComparisonOperator,
    GeneralSearchCase,
    LogicalOperator,
    SortDirection,
} from "./types";

const MAX_LINKS_AMOUNT = 11;

const COMPARISON_OPERATORS_DATA: CheckboxRadioSelectData<ComparisonOperator> = [
    { label: "equal to", value: "equal to" },
    { label: "not equal to", value: "not equal to" },
    { label: "greater than", value: "greater than" },
    { label: "greater than or equal to", value: "greater than or equal to" },
    { label: "less than", value: "less than" },
    { label: "less than or equal to", value: "less than or equal to" },
    // { label: "contains", value: "contains" },
    // { label: "does not contain", value: "does not contain" },
    // { label: "starts with", value: "starts with" },
    // { label: "ends with", value: "ends with" },
    // { label: "is empty", value: "is empty" },
    // { label: "is not empty", value: "is not empty" },
];

const IN_OPERATOR_DATA: CheckboxRadioSelectData = [{
    label: "in",
    value: "in",
}];

const BOOLEAN_OPERATOR_DATA: CheckboxRadioSelectData = [
    { label: "equal to", value: "eq" },
    { label: "not equal to", value: "ne" },
];

const LOGICAL_OPERATORS_DATA: CheckboxRadioSelectData<LogicalOperator> = [
    { label: "and", value: "and" },
    { label: "nor", value: "nor" },
    { label: "or", value: "or" },
];

const SORT_DIRECTION_DATA: CheckboxRadioSelectData<SortDirection> = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
];

const QUERY_SEARCH_CASE_DATA: CheckboxRadioSelectData<GeneralSearchCase> = [
    { label: "Case sensitive", value: "case-sensitive" },
    { label: "Case insensitive", value: "case-insensitive" },
];

const BOOLEAN_VALUES_DATA: CheckboxRadioSelectData<"true" | "false"> = [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
];

export {
    BOOLEAN_OPERATOR_DATA,
    BOOLEAN_VALUES_DATA,
    COMPARISON_OPERATORS_DATA,
    IN_OPERATOR_DATA,
    LOGICAL_OPERATORS_DATA,
    MAX_LINKS_AMOUNT,
    QUERY_SEARCH_CASE_DATA,
    SORT_DIRECTION_DATA,
};
