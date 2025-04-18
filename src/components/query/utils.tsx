import { Flex, Stack, Text, Title } from "@mantine/core";
import {
    VALIDATION_FUNCTIONS_TABLE,
    type ValidationKey,
} from "../../constants/validations";
import type {
    CheckboxRadioSelectData,
    InputType,
    StepperChild,
    StepperPage,
    Validation,
} from "../../types";
import { splitCamelCase } from "../../utils";
import {
    BOOLEAN_OPERATOR_DATA,
    COMPARISON_OPERATORS_DATA,
    IN_OPERATOR_DATA,
} from "./constants";
import type {
    FilterInputsType,
    GeneralSearchCase,
    MongoComparisonOperator,
    QueryChains,
    QueryOperator,
    SortInputsType,
} from "./types";

function addInputsToStepperPages(stepperPages: StepperPage[]): StepperPage[] {
    // createdAt and updatedAt are guaranteed to exist in all models and are used as initial values for filter & sort
    // username and userId exist in all models and are used as initial values for search
    // the fields must be added here because the stepper pages are used to populate and validate query inputs

    const createdAtInput: StepperChild = {
        inputType: "date",
        name: "createdAt",
        validationKey: "dateNearPast",
    };

    const updatedAtInput: StepperChild = {
        inputType: "date",
        name: "updatedAt",
        validationKey: "dateNearPast",
    };

    const usernameInput: StepperChild = {
        inputType: "text",
        name: "username",
        validationKey: "username",
    };

    const clonedStepperPages = structuredClone(stepperPages);
    clonedStepperPages[0].children.push(
        createdAtInput,
        updatedAtInput,
        usernameInput,
    );

    return clonedStepperPages;
}

type OperatorsInputType = {
    operators: CheckboxRadioSelectData<QueryOperator>;
    inputType: InputType;
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

/**
 * - Extracts the names, input data from the stepper pages and used in the corresponding query sections
 */
function createQueryInputsData(stepperPages: StepperPage[]): QueryInputsData {
    // data created with these input types can have a subset of operators applied to them

    const filterInputsTypeSet = new Set<FilterInputsType>([
        "boolean", // 'equal to' operator
        "date", // comparison operators
        "number", // comparison operators
        "select", // 'in' operator
        "time", // comparison operators
    ]);
    const sortInputsSet = new Set<SortInputsType>(["date", "number", "time"]); // can apply sort: ascending | descending

    const validatedInputsSet = new Set<InputType>([
        "text",
        "date",
        "number",
        "time",
    ]);

    const initialAcc: QueryInputsData = {
        fieldNamesOperatorsTypesMap: new Map<string, OperatorsInputType>(),
        filterFieldSelectInputData: [],
        selectInputsDataMap: new Map<string, CheckboxRadioSelectData>(),
        projectionCheckboxData: [],
        searchFieldSelectInputData: [],
        sortFieldSelectData: [],
        inputsValidationsMap: new Map(),
    };

    const stepperPagesWithAddedInputs = addInputsToStepperPages(stepperPages);
    return stepperPagesWithAddedInputs.reduce<QueryInputsData>((acc, page) => {
        const {
            fieldNamesOperatorsTypesMap,
            filterFieldSelectInputData,
            projectionCheckboxData,
            selectInputsDataMap,
            searchFieldSelectInputData,
            sortFieldSelectData,
            inputsValidationsMap,
        } = acc;

        page.children.forEach((child) => {
            const { inputType, name, selectInputData, validationKey } = child;

            const checkboxRadioSelectData = {
                label: splitCamelCase(name),
                value: name,
            };

            const comparisonOperatorsInputsSet = new Set<InputType>([
                "date",
                "number",
                "time",
            ]); // can apply comparison operators

            const operatorsInputTypeObject = {
                inputType,
                operators: comparisonOperatorsInputsSet.has(inputType)
                    ? COMPARISON_OPERATORS_DATA
                    : inputType === "boolean"
                    ? BOOLEAN_OPERATOR_DATA
                    : IN_OPERATOR_DATA,
            } as OperatorsInputType;
            fieldNamesOperatorsTypesMap.set(name, operatorsInputTypeObject);

            projectionCheckboxData.push(checkboxRadioSelectData);

            if (filterInputsTypeSet.has(inputType as FilterInputsType)) {
                filterFieldSelectInputData.push(checkboxRadioSelectData);
            }

            if (inputType === "text") {
                searchFieldSelectInputData.push(checkboxRadioSelectData);
            }

            if (sortInputsSet.has(inputType as SortInputsType)) {
                sortFieldSelectData.push(checkboxRadioSelectData);
            }

            if (selectInputData !== undefined) {
                selectInputsDataMap.set(name, selectInputData);
            }

            if (validatedInputsSet.has(inputType)) {
                if (validationKey === undefined) {
                    return acc;
                }

                inputsValidationsMap.set(name, {
                    validationKey,
                    validation: VALIDATION_FUNCTIONS_TABLE[validationKey],
                });
            }
        });

        return acc;
    }, initialAcc);
}

function removeProjectionExclusionFields(
    projectionExclusionFields: string[],
    selectData: CheckboxRadioSelectData,
) {
    const exclusionFieldsSet = new Set(projectionExclusionFields);

    return selectData.reduce<CheckboxRadioSelectData>((acc, field) => {
        if (!exclusionFieldsSet.has(field.value)) {
            acc.push(structuredClone(field));
        }

        return acc;
    }, []);
}

function createQueryString({
    generalSearchCase,
    generalSearchExclusionValue,
    generalSearchInclusionValue,
    limitPerPage,
    projectionExclusionFields,
    queryChains,
}: {
    generalSearchCase: GeneralSearchCase;
    generalSearchExclusionValue: string;
    generalSearchInclusionValue: string;
    limitPerPage: string;
    projectionExclusionFields: string[];
    queryChains: QueryChains;
}): string {
    const comparisonOperatorsMongoTable = new Map<
        QueryOperator,
        MongoComparisonOperator
    >([
        ["equal to", "$eq"],
        ["greater than", "$gt"],
        ["greater than or equal to", "$gte"],
        ["less than", "$lt"],
        ["less than or equal to", "$lte"],
        ["not equal to", "$ne"],
    ]);

    const filterAndSortQueryString = Object.entries(queryChains).reduce(
        (acc, [chainKind, chainMap]) => {
            Array.from(chainMap).forEach(([logicalOperator, chains]) => {
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

    const projectionQueryString = projectionExclusionFields.length > 0
        ? `&projection=${projectionExclusionFields.join(",")}`
        : "";

    const searchQueryString = generalSearchInclusionValue.length > 0 ||
            generalSearchExclusionValue.length > 0
        ? `&$text[$search]=${generalSearchInclusionValue} ${
            generalSearchExclusionValue.length > 0
                ? `-${generalSearchExclusionValue}`
                : ""
        }&$text[$caseSensitive]=${generalSearchCase === "case-sensitive"}`
        : "";

    return `${
        filterAndSortQueryString + projectionQueryString + searchQueryString
    }&limit=${Number.parseInt(limitPerPage) ?? 10}`;
}

const QUERY_BUILDER_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>How it works:</Title>
            <Text>
                The query builder allows you to build a query to retrieve
                documents from a collection. The query can be built using the
                filter, search, sort, and projection operations.
            </Text>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Filter:</Title>
            <Text>
                The filter operation allows you to filter the returned documents
                by the specified fields, each representing a specific filtering
                condition. All of the conditions within the chain must be met
                for a document to be included in the query result.
            </Text>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Search:</Title>
            <Text>
                The search operation allows you to search for documents whose
                fields contain unconstrained values (text / textarea inputs).
                All of the conditions within the chain must be met for a
                document to be included in the query result.
            </Text>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Sort:</Title>
            <Text>
                The sort operation allows you to sort the filtered documents by
                the specified fields and operator. This allows control of the
                order in which documents are retrieved from a collection.
            </Text>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Projection:</Title>
            <Text>
                The projection operation allows you to specify which fields to
                include or exclude in the query result. This allows you to limit
                the amount of data that is returned from the query.
            </Text>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Example:</Title>
            <Text>
                You can use the query builder (in one query) to filter all
                documents that have a "Created date" that is greater than or
                equal to 2021-01-01, search "Customer name" for "John", sort the
                documents by "Created date" in descending order, and exclude the
                "Updated date" field from the query result.
            </Text>
        </Flex>
    </Stack>
);

const FILTER_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>How it works:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    The filter operation allows you to filter the returned
                    documents by the specified fields, each representing a
                    specific filtering condition. These conditions are
                    transformed into MongoDB queries.
                </Text>
                <Text>
                    You can chain multiple filter statements together to create
                    logical filter chains. Currently, only "AND" is supported,
                    meaning that all conditions within the chain must be met for
                    a document to be included in the query result.
                </Text>
                <Text>
                    The filter chain is executed in the order that the
                    statements are added (top to bottom).
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Statement structure</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Each filter statement consists of three parts: a field, an
                    operator, and a value. The field is the field that you want
                    to filter by. The operator is the operator that you want to
                    use to filter the field. The value is the value that you
                    want to filter the field by.
                </Text>
                <Text>
                    'in' Operator is for fields that have a constrained set of
                    values, the rest ('equal to', etc.) are for unconstrained
                    set of values.
                </Text>
            </Flex>
        </Flex>
    </Stack>
);

const GENERAL_SEARCH_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>How it works:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    The general search operation allows searching for documents
                    based on unconstrained text values.
                </Text>
                <Text>
                    However, it's important to note that due to the broader
                    search scope, general searches may be slower compared to
                    targeted searches using 'Search Chain', as this search
                    method scans multiple fields in your documents.
                </Text>
                <Text>
                    Each space-delimited phrase is treated as a token, and
                    documents containing any of these tokens will be included or
                    excluded in the searcTexth results.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Example:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Inclusion string of 'John Doe' will return documents that
                    contain either a "John" or "Doe" token . Exclusion string of
                    '-Jane -Smith' will return documents that do not contain
                    either a "Jane" or "Smith" token.
                </Text>
                <Text>
                    Combining both inclusion and exclusion strings will return
                    documents that contain a "John" or "Doe" token (or if
                    case-insensitive: "john" or "doe"), 'AND' do not contain a
                    "Jane" or "Smith" (or if case-insensitive: "jane" or
                    "smith") token.
                </Text>
            </Flex>
        </Flex>
    </Stack>
);

const SEARCH_CHAIN_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>How it works:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    The search operation allows you to search for documents
                    whose fields contain unconstrained values (text / textarea
                    inputs). You can chain multiple search statements together
                    to create logical search chains.
                </Text>
                <Text>
                    If there are multiple identical fields, search chain will be
                    treated as 'OR', meaning that if <i>any</i>{" "}
                    of the conditions within the ('OR')chain are met, the
                    document will be included in the query result.
                </Text>
                <Text>
                    If there are no identical fields, search chain will be
                    treated as 'AND', meaning that <i>all</i>{" "}
                    of the conditions within the ('AND')chain must be met for a
                    document to be included in the query result.
                </Text>
                <Text>
                    You can combine 'OR' and 'AND' search chains together to
                    create complex or more specific search chains. For example,
                    you can search for documents that have a "Customer name"
                    that contains "John" <i>OR</i>{" "}
                    "Jane" (always case-insensitive) <i>AND</i>{" "}
                    a "Created date" that is greater than or equal to
                    2021-01-01.
                </Text>
                <Text>
                    For improved accuracy and user experience, each field has
                    validation rules corresponding to the type of data it
                    stores. For example, a date field will only accept valid
                    dates, a number field will only accept valid numbers, a text
                    field that is 'email' will only accept valid emails, etc.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Statement structure</Title>
            <Text>
                Each search statement consists of two components: a field and a
                value. The field represents the specific attribute you want to
                search within a document, while the value is the term used to
                perform the search within that field.
            </Text>
        </Flex>
    </Stack>
);

const SORT_HELP_MODAL_CONTENT = (
    <Stack w="100%">
        <Flex direction="column">
            <Title order={6}>How it works:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    The sort operation allows you to sort the filtered documents
                    by the specified fields and operator. This allows control of
                    the order in which documents are retrieved from a
                    collection.
                </Text>
                <Text>
                    Each consecutive sort statement is treated as a tiebreaker
                    and is used to sort the documents that have the same value
                    in the previous sort field.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Ascending order:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Ascending order is the default sort order. In ascending
                    order, the documents are arranged in a field from the lowest
                    value to the highest. This is often used for fields like
                    dates or numerical values.
                </Text>
                <Text>
                    For example, sorting by "Created date" in ascending order
                    would display the oldest records first, followed by newer
                    ones.
                </Text>
            </Flex>
        </Flex>

        <Flex direction="column">
            <Title order={6}>Descending order:</Title>
            <Flex direction="column" rowGap="xs">
                <Text>
                    Conversely, when you sort in descending order, documents are
                    arranged in a field from the highest value to the lowest.
                    This is useful for retrieving the most recent or
                    highest-valued records.
                </Text>
                <Text>
                    For example, sorting by "Updated date" in descending order
                    would display the newest records first, followed by older
                    ones.
                </Text>
            </Flex>
        </Flex>
    </Stack>
);

const PROJECTION_HELP_MODAL_CONTENT = (
    <Flex direction="column" w="100%">
        <Title order={6}>How it works:</Title>
        <Flex direction="column" rowGap="xs">
            <Text>
                The projection operation allows you to specify which fields to
                include or exclude in the query result. This allows you to limit
                the amount of data that is returned from the query.
            </Text>
            <Text>
                By default, all fields are included in the query result. To
                exclude a field, simply select a field name's checkbox. To
                include a field, unselect the checkbox.
            </Text>
            <Text>
                The document and user Ids fields are always included in the
                query result. Toggling the "Table view" option (only for desktop
                users) between "Condensed" and "Expanded" will hide/reveal the
                Id fields.
            </Text>
        </Flex>
    </Flex>
);

export {
    createQueryInputsData,
    createQueryString,
    FILTER_HELP_MODAL_CONTENT,
    GENERAL_SEARCH_HELP_MODAL_CONTENT,
    PROJECTION_HELP_MODAL_CONTENT,
    QUERY_BUILDER_HELP_MODAL_CONTENT,
    removeProjectionExclusionFields,
    SEARCH_CHAIN_HELP_MODAL_CONTENT,
    SORT_HELP_MODAL_CONTENT,
};
export type { InputsValidationsMap, OperatorsInputType, QueryInputsData };
