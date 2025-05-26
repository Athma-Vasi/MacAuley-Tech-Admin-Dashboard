import { expect, test } from "@playwright/test";
import { shuffle } from "simple-statistics";
import { UserDocument } from "../../types";
import {
    SAMPLE_USER_DOCUMENT,
    USER_QUERY_TEMPLATES,
} from "../usersQuery/constants";
import {
    GeneralSearchCase,
    LogicalOperator,
    QueryChainKind,
    QueryOperator,
    SortDirection,
} from "./types";

// Users Query is used to test Query component

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const usernameInput = page.getByTestId("username-textInput");
    await expect(usernameInput).toBeVisible();
    const passwordInput = page.getByTestId("password-textInput");
    await expect(passwordInput).toBeVisible();
    const loginButton = page.getByTestId("login-button");
    await expect(loginButton).toBeVisible();
    await usernameInput.fill("manager");
    await passwordInput.fill("passwordQ1!");
    await loginButton.click();
    await page.waitForURL("http://localhost:5173/dashboard/financials");
    const usersNavlink = page.getByTestId("users-navlink");
    await expect(usersNavlink).toBeVisible();
    await usersNavlink.click();
    await page.waitForURL("http://localhost:5173/dashboard/users");
});

test.afterEach(async ({ page }) => {
    const logoutButton = page.getByTestId("logout-button");
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    await page.waitForURL("http://localhost:5173/");
    const usernameInput = page.getByTestId("username-textInput");
    expect(await usernameInput.isVisible());
    const passwordInput = page.getByTestId("password-textInput");
    expect(await passwordInput.isVisible());
    const loginButton = page.getByTestId("login-button");
    expect(await loginButton.isVisible());
});

const filterPermutations = generateFilterPermutations();
const searchPermutations = generateSearchPermutations();
const sortPermutations = generateSortPermutations();
const projectionPermutations = generateProjectionPermutations();

test.describe("UsersQuery", async () => {
    test("should fetch  directory when no query is provided", async ({ page }) => {
        const querySubmitButton = page.getByTestId("usersQuery-submit-button");
        await expect(querySubmitButton).toBeVisible();
        await querySubmitButton.click();
        const totalDocumentsTextElement = page.getByTestId(
            "usersQuery-totalDocuments",
        );
        await expect(totalDocumentsTextElement).toBeVisible();
        await expect(totalDocumentsTextElement).not.toHaveText(
            /Total Documents: 0/,
        );
    });

    test(
        "should display all Query pages correctly",
        async ({ page }) => {
            const limitPerPageSelectInput = page.getByTestId(
                "limitPerPage-selectInput",
            );
            await expect(limitPerPageSelectInput).toBeVisible();
            const queryKindSelectInput = page.getByTestId(
                "queryKind-selectInput",
            );
            await expect(queryKindSelectInput).toBeVisible();

            const queryRefreshButton = page.getByTestId(
                "query-refresh-button",
            );
            await expect(queryRefreshButton).toBeVisible();

            // filter
            const filterLogicalOperatorSelectInput = page.getByTestId(
                "filterLogicalOperator-selectInput",
            );
            await expect(filterLogicalOperatorSelectInput)
                .toBeVisible();
            const filterFieldSelectInput = page.getByTestId(
                "filterField-selectInput",
            );
            await expect(filterFieldSelectInput).toBeVisible();
            const filterComparisonOperatorSelectInput = page
                .getByTestId(
                    "filterComparisonOperator-selectInput",
                );
            await expect(
                filterComparisonOperatorSelectInput,
            ).toBeVisible();
            const addFilterLinkButton = page.getByTestId(
                "add-filter-link-button",
            );
            await expect(addFilterLinkButton).toBeVisible();
            const dynamicValueInput = page.getByTestId(
                "dynamicValue-input",
            );
            await expect(dynamicValueInput).toBeVisible();

            // projection
            await queryKindSelectInput.selectOption("projection");
            const projectionFieldSelectInput = page.getByTestId(
                "exclusionFields-_id-checkboxInputGroup",
            );
            await expect(projectionFieldSelectInput).toBeVisible();

            // search
            await queryKindSelectInput.selectOption("search");
            const inclusionTextInput = page.getByTestId(
                "inclusion-textInput",
            );
            await expect(inclusionTextInput).toBeVisible();
            const exclusionTextInput = page.getByTestId(
                "exclusion-textInput",
            );
            await expect(exclusionTextInput).toBeVisible();
            const caseSegmentedControl = page.getByTestId(
                "case-segmentedControl",
            );
            await expect(caseSegmentedControl).toBeVisible();
            const addSearchLinkButton = page.getByTestId(
                "add-search-link-button",
            );
            await expect(addSearchLinkButton).toBeVisible();

            // sort
            await queryKindSelectInput.selectOption("sort");
            const sortFieldSelectInput = page.getByTestId(
                "sortField-selectInput",
            );
            await expect(sortFieldSelectInput).toBeVisible();
            const sortDirectionSelectInput = page.getByTestId(
                "sortDirection-selectInput",
            );
            await expect(sortDirectionSelectInput).toBeVisible();
            const addSortLinkButton = page.getByTestId(
                "add-sort-link-button",
            );
            await expect(addSortLinkButton).toBeVisible();

            // submit
            const querySubmitButton = page.getByTestId(
                "usersQuery-submit-button",
            );
            await expect(querySubmitButton).toBeVisible();
        },
    );

    test.describe("Filter", () => {
        test("should handle a random filter permutation", async ({ page }) => {
            await Promise.all(
                filterPermutations.slice(4, 5).map(
                    async ({
                        comparisonOperator,
                        field,
                        logicalOperator,
                        value,
                    }) => {
                        const filterLogicalOperatorSelectInput = page
                            .getByTestId(
                                "filterLogicalOperator-selectInput",
                            );
                        await expect(filterLogicalOperatorSelectInput)
                            .toBeVisible();
                        await filterLogicalOperatorSelectInput.selectOption(
                            logicalOperator,
                        );

                        const filterFieldSelectInput = page.getByTestId(
                            "filterField-selectInput",
                        );
                        await expect(filterFieldSelectInput).toBeVisible();
                        await filterFieldSelectInput.selectOption(field);

                        const filterComparisonOperatorSelectInput = page
                            .getByTestId(
                                "filterComparisonOperator-selectInput",
                            );
                        await expect(
                            filterComparisonOperatorSelectInput,
                        ).toBeVisible();
                        await filterComparisonOperatorSelectInput
                            .selectOption(
                                comparisonOperator,
                            );

                        const dynamicValueInput = page.getByTestId(
                            "dynamicValue-input",
                        );
                        await expect(dynamicValueInput).toBeVisible();
                        await dynamicValueInput.fill(value as string);

                        const addFilterLinkButton = page.getByTestId(
                            "add-filter-link-button",
                        );
                        await expect(addFilterLinkButton).toBeVisible();
                        await addFilterLinkButton.click();

                        const queryLinkText = page.getByTestId(
                            "query-link-text",
                        );
                        await expect(queryLinkText).toBeVisible();
                        const queryLinkStatement = createQueryLinkStatement(
                            {
                                field,
                                index: 0,
                                logicalOperator,
                                operator: comparisonOperator,
                                queryChainKind: "filter",
                                value: value?.toString() ?? "",
                            },
                        );
                        await expect(queryLinkText).toHaveText(
                            `${queryLinkStatement}.`,
                        );

                        const submitQueryButton = page.getByTestId(
                            "usersQuery-submit-button",
                        );
                        await expect(submitQueryButton).toBeVisible();
                        await submitQueryButton.click();
                        const totalDocumentsTextElement = page.getByTestId(
                            "usersQuery-totalDocuments",
                        );
                        await expect(totalDocumentsTextElement).toBeVisible();
                        await expect(totalDocumentsTextElement).not.toHaveText(
                            /Total Documents: 0/,
                        );
                    },
                ),
            );
        });
    });

    test.describe("Sort", () => {
        test("should handle a random sort permutation", async ({ page }) => {
            await Promise.all(
                sortPermutations.slice(0, 1).map(
                    async ({ field, value }) => {
                        const queryKindSelectInput = page.getByTestId(
                            "queryKind-selectInput",
                        );
                        await expect(queryKindSelectInput).toBeVisible();
                        await queryKindSelectInput.selectOption("sort");

                        const sortFieldSelectInput = page.getByTestId(
                            "sortField-selectInput",
                        );
                        await expect(sortFieldSelectInput).toBeVisible();
                        await sortFieldSelectInput.selectOption(field);

                        const sortDirectionSelectInput = page.getByTestId(
                            "sortDirection-selectInput",
                        );
                        await expect(sortDirectionSelectInput).toBeVisible();
                        await sortDirectionSelectInput.selectOption(value);

                        const addSortLinkButton = page.getByTestId(
                            "add-sort-link-button",
                        );
                        await expect(addSortLinkButton).toBeVisible();
                        await addSortLinkButton.click();

                        const queryLinkText = page.getByTestId(
                            "query-link-text",
                        );
                        await expect(queryLinkText).toBeVisible();
                        const queryLinkStatement = createQueryLinkStatement(
                            {
                                field,
                                index: 0,
                                logicalOperator: "and",
                                operator: "",
                                queryChainKind: "sort",
                                value: value?.toString() ?? "",
                            },
                        );
                        await expect(queryLinkText).toHaveText(
                            `${queryLinkStatement}.`,
                        );

                        const submitQueryButton = page.getByTestId(
                            "usersQuery-submit-button",
                        );
                        await expect(submitQueryButton).toBeVisible();
                        await submitQueryButton.click();
                        const totalDocumentsTextElement = page.getByTestId(
                            "usersQuery-totalDocuments",
                        );
                        await expect(totalDocumentsTextElement).toBeVisible();
                        await expect(totalDocumentsTextElement).not.toHaveText(
                            /Total Documents: 0/,
                        );
                    },
                ),
            );
        });
    });

    test.describe("Search", () => {
        test("should handle a random search permutation", async ({ page }) => {
            await Promise.all(
                searchPermutations.slice(0, 1).map(
                    async ({
                        generalSearchCase,
                        generalSearchExclusionValue,
                        generalSearchInclusionValue,
                    }) => {
                        const queryKindSelectInput = page.getByTestId(
                            "queryKind-selectInput",
                        );
                        await expect(queryKindSelectInput).toBeVisible();
                        await queryKindSelectInput.selectOption("search");

                        const inclusionTextInput = page.getByTestId(
                            "inclusion-textInput",
                        );
                        await expect(inclusionTextInput).toBeVisible();
                        await inclusionTextInput.fill(
                            generalSearchInclusionValue,
                        );

                        const exclusionTextInput = page.getByTestId(
                            "exclusion-textInput",
                        );
                        await expect(exclusionTextInput).toBeVisible();
                        await exclusionTextInput.fill(
                            generalSearchExclusionValue,
                        );

                        const addSearchLinkButton = page.getByTestId(
                            "add-search-link-button",
                        );
                        await expect(addSearchLinkButton).toBeVisible();
                        await addSearchLinkButton.click();

                        const queryLinkText = page.getByTestId(
                            "general-search-link",
                        );
                        await expect(queryLinkText).toBeVisible();
                        await expect(
                            queryLinkText,
                        ).toHaveText(/Search Users by text fields where: /);

                        const submitQueryButton = page.getByTestId(
                            "usersQuery-submit-button",
                        );
                        await expect(submitQueryButton).toBeVisible();
                        await submitQueryButton.click();
                        const totalDocumentsTextElement = page.getByTestId(
                            "usersQuery-totalDocuments",
                        );
                        await expect(totalDocumentsTextElement).toBeVisible();
                        await expect(totalDocumentsTextElement).toHaveText(
                            /Total Documents/,
                        );
                    },
                ),
            );
        });
    });

    test.describe("Projection", () => {
        test("should handle a random projection permutation", async ({ page }) => {
            await Promise.all(
                projectionPermutations.slice(0, 1).map(
                    async (field) => {
                        const queryKindSelectInput = page.getByTestId(
                            "queryKind-selectInput",
                        );
                        await expect(queryKindSelectInput).toBeVisible();
                        await queryKindSelectInput.selectOption("projection");

                        const projectionFieldCheckboxInputGroup = page
                            .getByTestId(
                                `exclusionFields-${field}-checkboxInputGroup`,
                            );
                        await expect(
                            projectionFieldCheckboxInputGroup,
                        ).toBeVisible();
                        await projectionFieldCheckboxInputGroup.check();

                        const queryLinkText = page.getByTestId(
                            "projection-link",
                        );
                        await expect(queryLinkText).toBeVisible();

                        const submitQueryButton = page.getByTestId(
                            "usersQuery-submit-button",
                        );
                        await expect(submitQueryButton).toBeVisible();
                        await submitQueryButton.click();
                        const totalDocumentsTextElement = page.getByTestId(
                            "usersQuery-totalDocuments",
                        );
                        await expect(totalDocumentsTextElement).toBeVisible();
                        await expect(totalDocumentsTextElement).not.toHaveText(
                            /Total Documents: 0/,
                        );
                    },
                ),
            );
        });
    });
});

function createQueryLinkStatement({
    field,
    index,
    logicalOperator,
    operator,
    queryChainKind,
    value,
}: {
    field: string;
    index: number;
    logicalOperator: LogicalOperator;
    operator: string;
    queryChainKind: QueryChainKind;
    value: string;
}) {
    // projection
    let queryLinkStatement = "";

    if (queryChainKind === "filter") {
        queryLinkStatement = `${index === 0 ? logicalOperator + " " : ""}${
            splitCamelCase(field)
        } ${operator === "in" ? "equals" : `is ${operator}`} ${value}`;
    }

    if (queryChainKind === "sort") {
        queryLinkStatement = `${splitCamelCase(field)} in ${value} order`;
    }

    return queryLinkStatement;
}

function splitCamelCase(word: string): string {
    // Replace lowercase-uppercase pairs with a space in between
    const splitStr = word.replace(/([a-z])([A-Z])/g, "$1 $2");
    // Capitalize the first letter of the resulting string
    return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
}

function generateFilterPermutations() {
    const excludedFields = new Set<keyof UserDocument>([
        "country",
        "province",
        "department",
        "jobPosition",
        "postalCodeUS",
        "roles",
        "state",
        "storeLocation",
    ]);

    const logicalOperators: Array<LogicalOperator> = shuffle([
        "and",
        "nor",
        "or",
    ]);

    return Object.entries(SAMPLE_USER_DOCUMENT).reduce<
        Array<{
            comparisonOperator: QueryOperator;
            field: keyof UserDocument;
            logicalOperator: LogicalOperator;
            value: UserDocument[keyof UserDocument];
        }>
    >(
        (acc, curr) => {
            const [key, value] = curr as [
                keyof UserDocument,
                UserDocument[keyof UserDocument],
            ];
            if (excludedFields.has(key)) {
                return acc;
            }

            const queryTemplate = USER_QUERY_TEMPLATES.find(
                (template) => template.name === key,
            );
            if (!queryTemplate) {
                return acc;
            }
            const { comparisonOperators } = queryTemplate;

            logicalOperators.forEach((logicalOperator) => {
                Array.from(comparisonOperators).forEach(
                    (comparisonOperator) => {
                        acc.push({
                            comparisonOperator,
                            field: key,
                            logicalOperator,
                            value: value,
                        });
                    },
                );
            });

            return acc;
        },
        [],
    );
}

function generateSearchPermutations() {
    const generalSearchExclusionValues = shuffle([
        "Atlas",
        "Echo",
        "Ember",
        "Luna",
        "Nova",
        "Zephyr",
    ]);
    const generalSearchInclusionValues = Object.entries(SAMPLE_USER_DOCUMENT)
        .reduce(
            (acc, [_key, value]) => {
                if (typeof value === "string") {
                    acc.push(value);
                }
                return acc;
            },
            [] as Array<string>,
        );

    const generalSearchCases: Array<GeneralSearchCase> = shuffle([
        "case-sensitive",
        "case-insensitive",
    ]);

    return generalSearchExclusionValues.reduce<
        Array<{
            generalSearchCase: GeneralSearchCase;
            generalSearchExclusionValue: string;
            generalSearchInclusionValue: string;
        }>
    >((acc, generalSearchExclusionValue) => {
        generalSearchInclusionValues.forEach(
            (generalSearchInclusionValue) => {
                generalSearchCases.forEach((generalSearchCase) => {
                    if (generalSearchCase === "case-insensitive") {
                        acc.push({
                            generalSearchCase,
                            generalSearchExclusionValue:
                                generalSearchExclusionValue.toLowerCase(),
                            generalSearchInclusionValue:
                                generalSearchInclusionValue.toLowerCase(),
                        });
                    } else {
                        acc.push({
                            generalSearchCase,
                            generalSearchExclusionValue,
                            generalSearchInclusionValue,
                        });
                    }
                });
            },
        );

        return acc;
    }, []);
}

function generateSortPermutations() {
    const sortDirections: Array<SortDirection> = shuffle([
        "ascending",
        "descending",
    ]);

    return Object.entries(SAMPLE_USER_DOCUMENT).reduce<
        Array<{
            field: keyof UserDocument;
            value: SortDirection;
        }>
    >(
        (acc, curr) => {
            const [key, _value] = curr as [
                keyof UserDocument,
                SortDirection,
            ];

            const queryTemplate = USER_QUERY_TEMPLATES.find(
                (template) =>
                    template.name === key &&
                    (template.kind === "date" || template.kind === "number"),
            );
            if (!queryTemplate) {
                return acc;
            }

            sortDirections.forEach((sortDirection) => {
                acc.push({
                    field: key,
                    value: sortDirection,
                });
            });

            return acc;
        },
        [],
    );
}

function generateProjectionPermutations() {
    return Object.keys(SAMPLE_USER_DOCUMENT);
}
