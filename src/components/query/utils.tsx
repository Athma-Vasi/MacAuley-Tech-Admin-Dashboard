import {
    Blockquote,
    Code,
    Flex,
    Group,
    List,
    Stack,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";

import type { CheckboxRadioSelectData, Validation } from "../../types";
import { ValidationKey } from "../../validations";

import { TbLogicAnd, TbLogicNor, TbLogicOr } from "react-icons/tb";
import { splitCamelCase } from "../../utils";
import { AccessibleDateTimeInput } from "../accessibleInputs/AccessibleDateTimeInput";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../accessibleInputs/text/AccessibleTextInput";
import { QueryAction } from "./actions";
import {
    InputKind,
    LogicalOperator,
    MongoQueryOperator,
    QueryChainKind,
    QueryDispatch,
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
    { filterField, filterValue, queryAction, queryDispatch, queryTemplates }: {
        filterField: string;
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

    const { comparisonOperators, kind, name } = filteredQueryTemplate;

    if (kind === "select") {
        const attributes = filteredQueryTemplate
            .attributes;
        const data = filteredQueryTemplate.data;

        return (
            <AccessibleSelectInput
                attributes={{
                    ...attributes,
                    data,
                    name,
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
                    invalidValueAction: queryAction.setIsError,
                    name,
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
                    name,
                    invalidValueAction: queryAction.setIsError,
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
                    name,
                    validValueAction: queryAction.setFilterValue,
                    parentDispatch: queryDispatch as any,
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
) {
    return queryTemplates
        .reduce((acc, curr) => {
            const { name, comparisonOperators } = curr;

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

const QUERY_BUILDER_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Text size="xl">🛠 How to use the Query Builder:</Text>
        <Text>
            The Query Builder lets you construct custom queries to retrieve
            documents from a collection. You can mix and match operations like
            <strong>Filter</strong>, <strong>Search</strong>,{" "}
            <strong>Sort</strong>, and <strong>Projection</strong>{" "}
            to fine-tune your results 🎯.
        </Text>

        <Text size="lg">🔎 Filter:</Text>
        <Text>
            Use <strong>filters</strong>{" "}
            to apply precise conditions to fields — for example, check if a date
            is after a certain value, or if a number is greater than a
            threshold. Combine multiple conditions using logical operators like
            {" "}
            <strong>AND</strong> or{" "}
            <strong>OR</strong>, and group them into blocks for more complex
            logic. All conditions within a group must be met for a document to
            match ✅.
        </Text>

        <Text size="lg">📝 Search:</Text>
        <Text>
            The <strong>search</strong>{" "}
            operation helps you find documents using free-text input. Ideal for
            matching names, descriptions, or emails. You can chain multiple
            search terms and group them with logical operators to build dynamic,
            flexible search rules.
        </Text>

        <Text size="lg">🔃 Sort:</Text>
        <Text>
            <strong>Sort</strong> your results by one or more fields in{" "}
            <strong>ascending</strong> (⬆️) or <strong>descending</strong>{" "}
            (⬇️) order — perfect for ordering by dates, status, priority, and
            more. You can use multiple sort fields for secondary sorting
            (tiebreakers).
        </Text>

        <Text size="lg">📦 Projection:</Text>
        <Text>
            Use <strong>projection</strong>{" "}
            to choose which fields to include or exclude in your results. This
            helps reduce clutter and return only the information you care about.
            By default, all fields are shown — toggle checkboxes to adjust
            visibility.
        </Text>

        <Text size="lg">💡 Example:</Text>
        <Text>
            Build a query to: filter documents where{" "}
            <strong>"Created date"</strong> is on or after{" "}
            <strong>2021-01-01</strong>, search <strong>"Customer name"</strong>
            {" "}
            for <strong>"John"</strong>, sort by <strong>"Created date"</strong>
            {" "}
            in descending order, and exclude the <strong>"Updated date"</strong>
            {" "}
            from the results.
        </Text>
    </Stack>
);

const FILTER_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Text size="xl">🛠 How to Use the Filter Builder</Text>

        <Stack>
            <Text>
                The <strong>Filter Builder</strong>{" "}
                lets you create custom conditions to narrow down the results
                returned from the database. These filters are powered by logical
                expressions that are translated into MongoDB queries behind the
                scenes 🧠.
            </Text>

            <Text size="md">🧩 Components of a Filter Condition</Text>
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

            <Text size="md">🧱 Building a Query</Text>
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

            <Text size="md">💡 Tips & Tricks</Text>
            <List>
                <List.Item>
                    ✅ Use <strong>AND</strong> when <i>all</i>{" "}
                    conditions must be true.
                </List.Item>
                <List.Item>
                    🔄 Use <strong>OR</strong> when <i>any</i>{" "}
                    condition can be true.
                </List.Item>
                <List.Item>
                    🧱 Filter groups act as independent logical blocks that can
                    be combined to shape more precise results.
                </List.Item>
                <List.Item>
                    🧹 Use the <strong>link</strong>{" "}
                    icon to remove a filter condition from the chain.
                </List.Item>
                <List.Item>
                    📁 Fields and values directly map to the document structure
                    in your database. Choose wisely!
                </List.Item>
            </List>
        </Stack>
    </Stack>
);

const GENERAL_SEARCH_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Text size="xl">🔍 How it works:</Text>
        <Flex direction="column" rowGap="xs">
            <Text>
                The <strong>general search</strong>{" "}
                operation allows you to search for documents based on free-form
                text. This is ideal for matching keywords across multiple fields
                where values aren’t strictly structured.
            </Text>
            <Text>
                Each space-separated word or phrase is treated as a{" "}
                <strong>token</strong>. Documents that contain <em>any</em>{" "}
                of these tokens will be included (or excluded) from the search
                results depending on your input.
            </Text>
        </Flex>

        <Title order={6}>💡 Example:</Title>
        <Flex direction="column" rowGap="xs">
            <Text>
                An inclusion string like <code>'John Doe'</code>{" "}
                will return documents that contain either the token{" "}
                <strong>"John"</strong> or <strong>"Doe"</strong>.
            </Text>
            <Text>
                An exclusion string like <code>'-Jane -Smith'</code>{" "}
                will return documents that
                <em>do not</em> contain the tokens <strong>"Jane"</strong> or
                {" "}
                <strong>"Smith"</strong>.
            </Text>
            <Text>
                If you combine them, for example:{" "}
                <code>'John Doe -Jane -Smith'</code>, the search will return
                documents that contain <strong>"John"</strong> or{" "}
                <strong>"Doe"</strong>
                <em>and</em> do <strong>not</strong> contain{" "}
                <strong>"Jane"</strong> or{" "}
                <strong>"Smith"</strong>. Searches are case-insensitive by
                default (e.g., <code>"john"</code> and <code>"JOHN"</code>{" "}
                are treated the same).
            </Text>
        </Flex>
    </Stack>
);

const SEARCH_CHAIN_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Text size="xl">🔍 How it works:</Text>
        <Flex direction="column" rowGap="xs">
            <Text>
                The <strong>search</strong>{" "}
                operation allows you to find documents where specified fields
                contain free-form text (e.g., inputs like text or textarea). You
                can chain multiple search statements together to build logical
                search chains.
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

            <Text>
                ✅ For better accuracy and UX, each field is validated according
                to its type:
                <ul style={{ marginLeft: "1rem" }}>
                    <li>📅 Date fields must contain valid dates</li>
                    <li>🔢 Number fields only accept numeric input</li>
                    <li>📧 Email fields must be valid email addresses</li>
                    <li>✏️ Text fields accept general text</li>
                </ul>
            </Text>
        </Flex>

        <Text size="lg">📦 Statement Structure</Text>
        <Text>
            Each search statement has two parts:
            <ul style={{ marginLeft: "1rem" }}>
                <li>
                    <strong>Field</strong>{" "}
                    – The document attribute you want to search (e.g., name,
                    status, createdAt)
                </li>
                <li>
                    <strong>Value</strong>{" "}
                    – The term to match within the selected field
                </li>
            </ul>
        </Text>
    </Stack>
);

const SORT_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>🔃 How it works:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    The <strong>sort</strong>{" "}
                    operation lets you control the order in which documents are
                    returned by sorting them based on specific fields and
                    direction (ascending or descending).
                </Text>
                <Text>
                    Each additional sort field acts as a{" "}
                    <strong>tiebreaker</strong>{" "}
                    if the previous field's values are identical. This allows
                    for multi-level sorting — for example, sort by{" "}
                    <code>"Status"</code>, then by <code>"Created date"</code>.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>⬆️ Ascending order:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Ascending order (the default) arranges values from{" "}
                    <strong>lowest to highest</strong>. It’s commonly used for
                    dates, numbers, and alphabetical sorting.
                </Text>
                <Text>
                    For example: sorting by <strong>"Created date"</strong>{" "}
                    in ascending order will list the <em>oldest</em>{" "}
                    documents first.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>⬇️ Descending order:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Descending order arranges values from{" "}
                    <strong>highest to lowest</strong>. This is useful when you
                    want the most recent, largest, or highest-ranked items
                    first.
                </Text>
                <Text>
                    For example: sorting by <strong>"Updated date"</strong>{" "}
                    in descending order will show the{" "}
                    <em>most recently updated</em> documents first.
                </Text>
            </Flex>
        </Flex>
    </Stack>
);

const PROJECTION_HELP_MODAL_CONTENT = (
    <Flex direction="column" w="100%">
        <Title order={6}>🧰 How it works:</Title>
        <Flex direction="column" rowGap="xs">
            <Text>
                The <strong>projection</strong>{" "}
                operation lets you control which fields are{" "}
                <strong>included or excluded</strong>
                in the query results. This is useful when you want to limit the
                amount of data retrieved — either for performance, clarity, or
                privacy.
            </Text>

            <Text>
                🟢 By default, <strong>all fields</strong>{" "}
                are included in the results. To <strong>exclude</strong>{" "}
                a field, simply check its checkbox. To <strong>include</strong>
                {" "}
                a field back, just uncheck the checkbox.
            </Text>

            <Text>
                🆔 The <strong>document ID</strong> and <strong>user ID</strong>
                {" "}
                fields are always included for reference.
            </Text>

            <Text>
                🖥️ If you're on desktop, you can toggle the{" "}
                <strong>"Table view"</strong> between
                <em>Condensed</em> and <em>Expanded</em>{" "}
                to hide or reveal these ID fields in the result table — without
                affecting the actual projection query.
            </Text>
        </Flex>
    </Flex>
);

function returnTimelineBullet(
    {
        linkIndex,
        logicalOperator,
        queryAction,
        queryChainKind,
        queryDispatch,
        queryLinkStatement,
        textColorSliderLabel,
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

    const tooltipLabel = (
        <Text color={textColorSliderLabel}>
            Delete link: {queryLinkStatement}
        </Text>
    );

    return logicalOperator === "and"
        ? (
            <Tooltip label={tooltipLabel}>
                <Group>
                    <TbLogicAnd
                        onClick={() => handleIconClick()}
                        size={20}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                </Group>
            </Tooltip>
        )
        : logicalOperator === "nor"
        ? (
            <Tooltip label={tooltipLabel}>
                <TbLogicNor
                    onClick={() => handleIconClick()}
                    size={20}
                    style={{
                        cursor: "pointer",
                    }}
                />
            </Tooltip>
        )
        : (
            <Tooltip label={tooltipLabel}>
                <TbLogicOr
                    onClick={() => handleIconClick()}
                    size={20}
                    style={{
                        cursor: "pointer",
                    }}
                />
            </Tooltip>
        );
}

export {
    createDynamicInput,
    createQueryString,
    FILTER_HELP_MODAL_CONTENT,
    GENERAL_SEARCH_HELP_MODAL_CONTENT,
    PROJECTION_HELP_MODAL_CONTENT,
    QUERY_BUILDER_HELP_MODAL_CONTENT,
    removeProjectionExclusionFields,
    returnDefaultFilterValue,
    returnFilterSelectData,
    returnSortableQueryFields,
    returnTimelineBullet,
    SEARCH_CHAIN_HELP_MODAL_CONTENT,
    SORT_HELP_MODAL_CONTENT,
};
export type { InputsValidationsMap, OperatorsInputType, QueryInputsData };
