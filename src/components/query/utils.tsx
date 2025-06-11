import {
    Blockquote,
    Code,
    Flex,
    Group,
    List,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";

import type { CheckboxRadioSelectData, Validation } from "../../types";
import { ValidationKey } from "../../validations";

import { TbLogicAnd, TbLogicNor, TbLogicOr } from "react-icons/tb";
import { splitCamelCase } from "../../utils";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/AccessibleTextInput";
import { QueryAction } from "./actions";
import { QueryDispatch } from "./schemas";
import {
    InputKind,
    LogicalOperator,
    MongoQueryOperator,
    QueryChainKind,
    QueryOperator,
    QueryState,
    QueryTemplate,
} from "./types";

type OperatorsInputType = {
    operators: CheckboxRadioSelectData<QueryOperator>;
    inputKind: InputKind;
};

type InputsValidationsMap = Map<
    string,
    { validationKey: ValidationKey; validation: Validation }
>;

type QueryInputsData = {
    fieldNamesOperatorsTypesMap: Map<string, OperatorsInputType>;
    /** field names */
    filterFieldSelectInputData: CheckboxRadioSelectData;
    /** Map<field names, select data> */
    selectInputsDataMap: Map<string, CheckboxRadioSelectData>;
    projectionCheckboxData: CheckboxRadioSelectData;
    /** for search section */
    searchFieldSelectInputData: CheckboxRadioSelectData;
    /** for sort section */
    sortFieldSelectData: CheckboxRadioSelectData;
    /** Map<field names, validationKey> */
    inputsValidationsMap: InputsValidationsMap;
};

function removeProjectionExclusionFields(
    projectionFields: string[],
    selectData: CheckboxRadioSelectData,
) {
    const exclusionFieldsSet = new Set(projectionFields);

    return selectData.reduce<CheckboxRadioSelectData>((acc, field) => {
        if (!exclusionFieldsSet.has(field.value)) {
            acc.push(structuredClone(field));
        }

        return acc;
    }, []);
}

function returnSortableQueryFields(queryTemplates: QueryTemplate[]) {
    return queryTemplates.reduce((acc, curr) => {
        const SORTABLE_INPUT_KINDS = new Set<InputKind>(["date", "number"]);

        const { kind, name } = curr;
        if (SORTABLE_INPUT_KINDS.has(kind)) {
            acc.push({ label: splitCamelCase(name), value: name });
        }

        return acc;
    }, [] as CheckboxRadioSelectData);
}

function createQueryString(queryState: QueryState): string {
    const {
        generalSearchCase,
        generalSearchExclusionValue,
        generalSearchInclusionValue,
        limitPerPage,
        projectionFields,
        queryChains,
    } = queryState;

    const comparisonOperatorsMongoTable = new Map<
        QueryOperator,
        MongoQueryOperator
    >([
        ["equal to", "$eq"],
        ["greater than", "$gt"],
        ["greater than or equal to", "$gte"],
        ["less than", "$lt"],
        ["less than or equal to", "$lte"],
        ["not equal to", "$ne"],
        ["in", "$in"],
    ]);

    const filterAndSortQueryString = Object.entries(queryChains).reduce(
        (acc, [chainKind, chainMap]) => {
            Object.entries(chainMap).forEach(([logicalOperator, chains]) => {
                if (chainKind === "filter") {
                    const filterQueryString = chains.reduce(
                        (subAcc, [field, comparisonOperator, value]) => {
                            const mongoOperator =
                                comparisonOperatorsMongoTable.get(
                                    comparisonOperator,
                                ) ??
                                    "$in";
                            subAcc +=
                                `&$${logicalOperator}[${field}][${mongoOperator}]=${value}`;

                            return subAcc;
                        },
                        "",
                    );

                    acc += filterQueryString;
                } else if (chainKind === "sort") {
                    const sortQueryString = chains.reduce(
                        (
                            subAcc,
                            [field, _comparisonOperator, sortDirection],
                        ) => {
                            subAcc += `&sort[${field}]=${
                                sortDirection === "ascending" ? 1 : -1
                            }`;

                            return subAcc;
                        },
                        "",
                    );

                    acc += sortQueryString;
                }
            });

            return acc;
        },
        "?",
    );

    const projectionQueryString = projectionFields.length > 0
        ? `&projection=${projectionFields.join(",")}`
        : "";

    const searchQueryString = generalSearchInclusionValue.length > 0 ||
            generalSearchExclusionValue.length > 0
        ? `&$text[$search]=${generalSearchInclusionValue}${
            generalSearchExclusionValue.length > 0
                ? `-${generalSearchExclusionValue}`
                : ""
        }&$text[$caseSensitive]=${generalSearchCase === "case-sensitive"}`
        : "";

    return `${
        filterAndSortQueryString + projectionQueryString + searchQueryString
    }&limit=${Number.parseInt(limitPerPage) ?? 10}`;
}

function createDynamicInput(
    {
        chainLength,
        filterComparisonOperator,
        filterField,
        filterLogicalOperator,
        filterValue,
        queryAction,
        queryDispatch,
        queryTemplates,
    }: {
        chainLength: number;
        filterComparisonOperator: QueryOperator;
        filterField: string;
        filterLogicalOperator: LogicalOperator;
        filterValue: string;
        queryAction: QueryAction;
        queryDispatch: React.Dispatch<QueryDispatch>;
        queryTemplates: Array<QueryTemplate>;
    },
): React.JSX.Element {
    // subsets of inputs that are used in query filter
    const FILTER_INPUTS_SET = new Set<InputKind>([
        "date",
        "number",
        "text",
        "select",
    ]);
    const [filteredQueryTemplate] = queryTemplates.filter(
        ({ kind, name }) => FILTER_INPUTS_SET.has(kind) && filterField === name,
    );

    if (filteredQueryTemplate === null || filteredQueryTemplate === undefined) {
        return <></>;
    }

    const { kind, name } = filteredQueryTemplate;

    if (kind === "select") {
        const attributes = filteredQueryTemplate
            .attributes;
        const data = filteredQueryTemplate.data;

        return (
            <AccessibleSelectInput
                attributes={{
                    ...attributes,
                    data,
                    dataTestId: "dynamicValue-input",
                    name,
                    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                        queryDispatch({
                            action: queryAction.modifyQueryChains,
                            payload: {
                                index: chainLength,
                                logicalOperator: filterLogicalOperator,
                                queryChainActions: "insert",
                                queryChainKind: "filter",
                                queryLink: [
                                    filterField,
                                    filterComparisonOperator,
                                    event.currentTarget.value,
                                ],
                            },
                        });
                    },
                    validValueAction: queryAction.setFilterValue,
                    parentDispatch: queryDispatch,
                    value: filterValue,
                }}
            />
        );
    }

    if (kind === "text") {
        const attributes = filteredQueryTemplate
            .attributes;

        return (
            <AccessibleTextInput
                attributes={{
                    ...attributes,
                    additionalScreenreaderIds: [
                        `${filterField}-${filterComparisonOperator}-${filterValue}-screenreader-link`,
                        "filter-screenreader-link-heading",
                    ],
                    dataTestId: "dynamicValue-input",
                    invalidValueAction: queryAction.setIsError,
                    name,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                        queryDispatch({
                            action: queryAction.modifyQueryChains,
                            payload: {
                                index: chainLength,
                                logicalOperator: filterLogicalOperator,
                                queryChainActions: "insert",
                                queryChainKind: "filter",
                                queryLink: [
                                    filterField,
                                    filterComparisonOperator,
                                    event.currentTarget.value,
                                ],
                            },
                        });
                    },
                    parentDispatch: queryDispatch,
                    validValueAction: queryAction.setFilterValue,
                    value: filterValue,
                }}
            />
        );
    }

    if (kind === "number") {
        const attributes = filteredQueryTemplate
            .attributes;

        return (
            <AccessibleTextInput
                attributes={{
                    ...attributes,
                    additionalScreenreaderIds: [
                        `${filterField}-${filterComparisonOperator}-${filterValue}-screenreader-link`,
                        "filter-screenreader-link-heading",
                    ],
                    dataTestId: "dynamicValue-input",
                    invalidValueAction: queryAction.setIsError,
                    name,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                        queryDispatch({
                            action: queryAction.modifyQueryChains,
                            payload: {
                                index: chainLength,
                                logicalOperator: filterLogicalOperator,
                                queryChainActions: "insert",
                                queryChainKind: "filter",
                                queryLink: [
                                    filterField,
                                    filterComparisonOperator,
                                    event.currentTarget.value,
                                ],
                            },
                        });
                    },
                    parentDispatch: queryDispatch,
                    validValueAction: queryAction.setFilterValue,
                    value: filterValue,
                }}
            />
        );
    }

    if (kind === "date") {
        const attributes = filteredQueryTemplate
            .attributes;

        return (
            <AccessibleDateTimeInput
                attributes={{
                    ...attributes,
                    additionalScreenreaderIds: [
                        `${filterField}-${filterComparisonOperator}-${filterValue}-screenreader-link`,
                        "filter-screenreader-link-heading",
                    ],
                    dataTestId: "dynamicValue-input",
                    invalidValueAction: queryAction.setIsError,
                    name,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                        queryDispatch({
                            action: queryAction.modifyQueryChains,
                            payload: {
                                index: chainLength,
                                logicalOperator: filterLogicalOperator,
                                queryChainActions: "insert",
                                queryChainKind: "filter",
                                queryLink: [
                                    filterField,
                                    filterComparisonOperator,
                                    event.currentTarget.value,
                                ],
                            },
                        });
                    },
                    validValueAction: queryAction.setFilterValue,
                    parentDispatch: queryDispatch,
                    value: filterValue as string,
                }}
            />
        );
    }

    return <></>;
}

function returnDefaultFilterValue(
    filterField: string,
    queryTemplates: Array<QueryTemplate>,
): string {
    const [filteredQueryTemplate] = queryTemplates.filter(
        ({ name }) => filterField === name,
    );

    if (
        filteredQueryTemplate === null ||
        filteredQueryTemplate === undefined
    ) {
        return "";
    }

    const { kind } = filteredQueryTemplate;

    if (kind === "select") {
        return filteredQueryTemplate.data[0]?.value;
    }

    if (kind === "date") {
        return "2023-01-01";
    }

    if (kind === "number") {
        return "0";
    }

    if (kind === "text") {
        return "";
    }

    return "";
}

function returnFilterSelectData(
    filterField: string,
    queryTemplates: Array<QueryTemplate>,
    projectionFields: string[],
) {
    const projectionFieldsSet = new Set(projectionFields);
    return queryTemplates
        .reduce((acc, curr) => {
            const { name, comparisonOperators } = curr;

            if (projectionFieldsSet.has(name)) {
                return acc;
            }

            acc.fieldSelectData.push({
                label: splitCamelCase(name),
                value: name,
            });

            if (name === filterField) {
                Array.from(comparisonOperators).forEach(
                    (operator) => {
                        acc.filterComparisonOperatorData.push({
                            label: splitCamelCase(operator),
                            value: operator,
                        });
                    },
                );
            }

            return acc;
        }, {
            fieldSelectData: [] as CheckboxRadioSelectData,
            filterComparisonOperatorData: [] as CheckboxRadioSelectData,
        });
}

const FILTER_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Stack>
            <Text>
                The <strong>Filter Builder</strong>{" "}
                lets you create custom conditions to narrow down the results
                returned from the database. These filters are powered by logical
                expressions that are translated into MongoDB queries behind the
                scenes 🧠.
            </Text>

            <Text>
                Use <strong>filters</strong>{" "}
                to apply precise conditions to fields — for example, check if a
                date is after a certain value, or if a number is greater than a
                threshold. Combine multiple conditions using logical operators
                like <strong>AND</strong> or{" "}
                <strong>OR</strong>, and group them into blocks for more complex
                logic. All conditions within a group must be met for a document
                to match ✅.
            </Text>

            <Text size="lg">🧩 Components of a Filter Condition</Text>
            <Text>
                Each filter condition is made up of the following parts:
            </Text>

            <Text>
                <strong>🔗 Logical Operator</strong>{" "}
                – Determines how this condition connects to others (e.g.,{" "}
                <strong>AND</strong>, <strong>OR</strong>).
            </Text>

            <Text>
                <strong>📄 Field</strong>{" "}
                – The field in your documents you want to filter by (e.g.,{" "}
                <code>status</code>, <code>createdAt</code>,{" "}
                <code>userId</code>).
            </Text>

            <Text>
                <strong>⚖️ Comparison Operator</strong>{" "}
                – Defines how the value is compared (e.g., <code>equals</code>,
                {" "}
                <code>not equals</code>, <code>greater than</code>,{" "}
                <code>contains</code>, etc.).
            </Text>

            <Text>
                <strong>🔢 Value</strong>{" "}
                – The specific value you want to match against the selected
                field.
            </Text>

            <Text size="lg">🧱 Building a Query</Text>
            <Text>
                You can chain multiple filter conditions using logical operators
                like <strong>AND</strong> and{" "}
                <strong>OR</strong>. This allows you to construct complex,
                layered queries such as:
            </Text>

            <Blockquote icon={null}>
                <Code>status = active</Code>
                <Text>
                    <strong>AND</strong>
                </Text>
                <Code>createdAt &gt; 2023-01-01</Code>
                <Text>
                    <strong>OR</strong>
                </Text>
                {"("}
                <Code>userId = 12345</Code>
                <Text>
                    <strong>AND</strong>
                </Text>
                <Code>status = pending</Code>
                {")"}
            </Blockquote>

            <Text>
                These chains of conditions form{" "}
                <strong>filter groups</strong>. You can create multiple groups,
                which are evaluated separately to give you more flexibility and
                control over your results 🧠.
            </Text>

            <Text size="lg">💡 Tips & Tricks</Text>
            <List>
                <List.Item>
                    <Text>
                        ✅ Use <strong>AND</strong> when <i>all</i>{" "}
                        conditions must be true.
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        🔄 Use <strong>OR</strong> when <i>any</i>{" "}
                        condition can be true.
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        🧱 Filter groups act as independent logical blocks that
                        can be combined to shape more precise results.
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        🧹 Use the <strong>link</strong>{" "}
                        icon to remove a filter condition from the chain.
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        📁 Fields and values directly map to the document
                        structure in your database. Choose wisely!
                    </Text>
                </List.Item>
            </List>
        </Stack>
    </Stack>
);

const SEARCH_CHAIN_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column" rowGap="xs">
            <Text>
                The <strong>search</strong>{" "}
                operation helps you find documents where specified fields
                contain free-text input. Ideal for matching names, descriptions,
                or emails. You can chain multiple flexible search rules.
            </Text>

            <Text>
                🔗 If multiple conditions use the{" "}
                <strong>same field</strong>, they are evaluated with an{" "}
                <strong>OR</strong> operator — meaning if <em>any</em>{" "}
                of the conditions are true, the document will match.
            </Text>

            <Text>
                🧩 If conditions use{" "}
                <strong>different fields</strong>, they are evaluated with an
                {" "}
                <strong>AND</strong> operator — meaning <em>all</em>{" "}
                of them must be true for a document to match.
            </Text>

            <Text>
                🧠 You can combine both <strong>AND</strong> and{" "}
                <strong>OR</strong>{" "}
                logic to create more complex and specific search queries. For
                example:
                <br />
                Find documents where <strong>"Customer name"</strong> contains
                {" "}
                <code>"John"</code> <em>OR</em> <code>"Jane"</code>
                (always case-insensitive), <em>AND</em>{" "}
                <strong>"Created date"</strong> is on or after{" "}
                <code>2021-01-01</code>.
            </Text>

            <List>
                <Text>
                    ✅ For better accuracy and UX, each field is validated
                    according to its type:
                </Text>
                <List.Item>
                    <Text>📅 Date fields must contain valid dates</Text>
                </List.Item>
                <List.Item>
                    <Text>🔢 Number fields only accept numeric input</Text>
                </List.Item>
                <List.Item>
                    <Text>
                        📧 Email fields must be valid email addresses
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>✏️ Text fields accept general text</Text>
                </List.Item>
            </List>
        </Flex>

        <Text size="lg">📦 Statement Structure</Text>

        <List>
            <Text>
                Each search statement has two parts:
            </Text>
            <List.Item>
                <Text>
                    <strong>Field</strong>
                    : The document attribute you want to search (e.g., name,
                    status, createdAt)
                </Text>
            </List.Item>
            <List.Item>
                <Text>
                    <strong>Value</strong>
                    : The term to match within the selected field
                </Text>
            </List.Item>
        </List>
    </Stack>
);

const SORT_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Text>
            The <strong>sort</strong>{" "}
            operation lets you control the order in which documents are returned
            by sorting them based on specific fields and direction (ascending or
            descending).
        </Text>

        <Text>
            Each additional sort field acts as a <strong>tiebreaker</strong>
            {" "}
            if the previous field's values are identical. This allows for
            multi-level sorting — for example, sort by{" "}
            <code>"Status"</code>, then by <code>"Created date"</code>.
        </Text>

        <Text size="lg">⬆️ Ascending order:</Text>
        <Text>
            Ascending order (the default) arranges values from{" "}
            <strong>lowest to highest</strong>. It’s commonly used for dates,
            numbers, and alphabetical sorting.
        </Text>
        <Text>
            For example: sorting by <strong>"Created date"</strong>{" "}
            in ascending order will list the <em>oldest</em> documents first.
        </Text>

        <Text size="lg">⬇️ Descending order:</Text>
        <Text>
            Descending order arranges values from{" "}
            <strong>highest to lowest</strong>. This is useful when you want the
            most recent, largest, or highest-ranked items first.
        </Text>
        <Text>
            For example: sorting by <strong>"Updated date"</strong>{" "}
            in descending order will show the <em>most recently updated</em>
            {" "}
            documents first.
        </Text>
    </Stack>
);

const PROJECTION_HELP_MODAL_CONTENT = (
    <Stack>
        <Text>
            The <strong>projection</strong>{" "}
            operation lets you control which fields are{" "}
            <strong>included or excluded</strong>{" "}
            in the query results. This is useful when you want to limit the
            amount of data retrieved — either for performance, clarity, or
            privacy.
        </Text>

        <Text>
            🟢 By default, <strong>all fields</strong>{" "}
            are included in the results. To <strong>exclude</strong>{" "}
            a field, simply check its checkbox. To <strong>include</strong>{" "}
            a field back, just uncheck the checkbox.
        </Text>
        <Text>
            🆔 The <strong>document ID</strong> and <strong>user ID</strong>
            {" "}
            fields are always included for reference.
        </Text>
    </Stack>
);

function returnTimelineBullet(
    {
        linkIndex,
        logicalOperator,
        queryAction,
        queryChainKind,
        queryDispatch,
        queryLinkStatement,
    }: {
        linkIndex: number;
        logicalOperator: LogicalOperator;
        queryAction: QueryAction;
        queryChainKind: QueryChainKind;
        queryDispatch: React.Dispatch<
            QueryDispatch
        >;
        queryLinkStatement: string;
        textColorSliderLabel: string;
    },
) {
    function handleIconClick() {
        queryDispatch({
            action: queryAction
                .modifyQueryChains,
            payload: {
                index: linkIndex,
                logicalOperator,
                queryChainActions: "delete",
                queryChainKind,
                queryLink: [
                    "",
                    "equal to",
                    "",
                ],
            },
        });
    }

    return logicalOperator === "and"
        ? (
            <Tooltip label={`Delete link: ${queryLinkStatement}`}>
                <Group>
                    <TbLogicAnd
                        onClick={() => handleIconClick()}
                        size={18}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                </Group>
            </Tooltip>
        )
        : logicalOperator === "nor"
        ? (
            <Tooltip label={`Delete link: ${queryLinkStatement}`}>
                <TbLogicNor
                    onClick={() => handleIconClick()}
                    size={18}
                    style={{
                        cursor: "pointer",
                    }}
                />
            </Tooltip>
        )
        : (
            <Tooltip label={`Delete link: ${queryLinkStatement}`}>
                <TbLogicOr
                    onClick={() => handleIconClick()}
                    size={18}
                    style={{
                        cursor: "pointer",
                    }}
                />
            </Tooltip>
        );
}

function excludeSelectedProjectionFields(
    queryTemplates: Array<QueryTemplate>,
    queryState: QueryState,
) {
    const { queryChains } = queryState;

    const selectedFields = Object.entries(queryChains).reduce(
        (acc, [_queryChainKind, logicalChain]) => {
            Object.entries(logicalChain).forEach(
                ([_logicalOperator, qChain]) => {
                    qChain.forEach((queryLink) => {
                        const [field, _, __] = queryLink;
                        if (field) {
                            acc.add(field);
                        }
                    });
                },
            );
            return acc;
        },
        new Set<string>(),
    );

    return {
        inputData: queryTemplates.reduce((acc, { name }) => {
            const isFieldSelected = selectedFields.has(name);

            if (isFieldSelected) {
                return acc;
            }

            acc.push({
                label: splitCamelCase(name),
                value: name,
            });

            return acc;
        }, [] as CheckboxRadioSelectData),
    };
}

export {
    createDynamicInput,
    createQueryString,
    excludeSelectedProjectionFields,
    FILTER_HELP_MODAL_CONTENT,
    PROJECTION_HELP_MODAL_CONTENT,
    removeProjectionExclusionFields,
    returnDefaultFilterValue,
    returnFilterSelectData,
    returnSortableQueryFields,
    returnTimelineBullet,
    SEARCH_CHAIN_HELP_MODAL_CONTENT,
    SORT_HELP_MODAL_CONTENT,
};
export type { InputsValidationsMap, OperatorsInputType, QueryInputsData };
