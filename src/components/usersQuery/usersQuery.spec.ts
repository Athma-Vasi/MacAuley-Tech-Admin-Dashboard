import { expect, test } from "@playwright/test";
import { UserDocument } from "../../types";
import { DIRECTORY_USER_DOCUMENTS } from "../directory/data";
import { initialQueryState } from "../query/state";
import {
    GeneralSearchCase,
    LimitPerPage,
    LogicalOperator,
    MongoQueryOperator,
    QueryChains,
    QueryLink,
    QueryOperator,
    QueryState,
} from "../query/types";
import { initialUsersQueryState } from "./state";
import { UsersQueryState } from "./types";

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

const queryStrings = generateUsersQueryTestInput(1);

test.describe("UsersQuery", async () => {
    // test("should fetch  directory when no query is provided", async ({ page }) => {
    //     const querySubmitButton = page.getByTestId("usersQuery-submit-button");
    //     await expect(querySubmitButton).toBeVisible();
    //     await querySubmitButton.click();
    //     const totalDocumentsTextElement = page.getByTestId(
    //         "usersQuery-totalDocuments",
    //     );
    //     await expect(totalDocumentsTextElement).toBeVisible();
    //     await expect(totalDocumentsTextElement).not.toHaveText(
    //         /Total Documents: 0/,
    //     );
    // });

    test(
        "should handle a valid query string permutation",
        async ({ page }) => {
            await Promise.all(
                queryStrings.map(async () => {
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
                        "exclusionFields-checkboxInputGroup",
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
                }),
            );
        },
    );
});

function createRandomUsersQueryStrings() {
    const generalSearchCases: Array<GeneralSearchCase> = [
        "case-sensitive",
        "case-insensitive",
    ];
    const generalSearchExclusionValues = [
        "Atlas",
        "Echo",
        "Ember",
    ];
    const generalSearchInclusionValues = [
        "Luna",
        "Nova",
        "Piper",
        "Zephyr",
    ];
    const limitPerPages: Array<LimitPerPage> = [
        "10",
        "25",
        "50",
    ];
    const projectionFields: Array<keyof UserDocument> = [
        "state",
        "province",
    ];

    function generateUsersQueryLink(): QueryLink {
        const length = DIRECTORY_USER_DOCUMENTS.length;
        const randomIdx = Math.floor(Math.random() * length);
        const randomEmployee = DIRECTORY_USER_DOCUMENTS[randomIdx];

        const excludedFields = new Set([
            "role",
            "active",
            "contactNumber",
            "preferredPronouns",
            "preferredName",
            "middleName",
            "orgId",
            "parentOrgId",
        ]);
        const safeRandomEmployee = Object.entries(randomEmployee).reduce(
            (acc, curr) => {
                const [key, value] = curr;
                if (excludedFields.has(key)) {
                    return acc;
                }
                Object.defineProperty(
                    acc,
                    key,
                    {
                        value,
                        enumerable: true,
                        writable: false,
                        configurable: false,
                    },
                );

                return acc;
            },
            {} as UserDocument,
        );

        const randomFieldIdx = Math.floor(
            Math.random() * Object.keys(safeRandomEmployee).length,
        );
        const randomField = Object.keys(safeRandomEmployee)[randomFieldIdx];
        const randomFieldsValue = safeRandomEmployee[
            randomField as keyof UserDocument
        ] as string;
        const comparisonOperator = "equal to";

        return [
            randomField,
            comparisonOperator,
            randomFieldsValue,
        ];
    }

    function generateUsersFilterQueryChain() {
        const initialFilterQueryChain: QueryChains["filter"] = {
            and: [],
            nor: [],
            or: [],
        };

        return Object.entries(initialFilterQueryChain).reduce(
            (acc, [logicalOperator, _empty]) => {
                Array.from({ length: 3 }).forEach((_) => {
                    acc[logicalOperator as LogicalOperator].push(
                        generateUsersQueryLink(),
                    );
                });

                return acc;
            },
            initialFilterQueryChain,
        );
    }

    function generateUsersSortQueryChain() {
        const initialSortQueryChain: QueryChains["sort"] = {
            and: [],
            nor: [],
            or: [],
        };

        return Object.entries(initialSortQueryChain).reduce(
            (acc, [logicalOperator, _empty]) => {
                Array.from({ length: 3 }).forEach((_) => {
                    acc[logicalOperator as LogicalOperator].push(
                        generateUsersQueryLink(),
                    );
                });

                return acc;
            },
            initialSortQueryChain,
        );
    }

    const filterQueryChain = generateUsersFilterQueryChain();
    const sortQueryChain = generateUsersSortQueryChain();

    function generateQueryStringInputPermutations(
        {
            filterQueryChain,
            generalSearchCases,
            generalSearchExclusionValues,
            generalSearchInclusionValues,
            limitPerPages,
            projectionFields,
            sortQueryChain,
        }: {
            filterQueryChain: QueryChains["filter"];
            generalSearchCases: Array<GeneralSearchCase>;
            generalSearchExclusionValues: Array<string>;
            generalSearchInclusionValues: Array<string>;
            limitPerPages: Array<LimitPerPage>;
            projectionFields: Array<keyof UserDocument>;
            sortQueryChain: QueryChains["sort"];
        },
    ) {
        return Object.entries(filterQueryChain).reduce<Array<string>>(
            (acc, [filterLogicalOperator, filterChains]) => {
                filterChains.forEach((filterChain) => {
                    const [filterField, filterComparisonOperator, filterValue] =
                        filterChain;

                    Object.entries(sortQueryChain).forEach(
                        ([sortLogicalOperator, sortChains]) => {
                            sortChains.forEach((sortChain) => {
                                const [
                                    sortField,
                                    _comparisonOperator,
                                    sortDirection,
                                ] = sortChain;

                                generalSearchCases.forEach(
                                    (generalSearchCase) => {
                                        generalSearchExclusionValues.forEach(
                                            (generalSearchExclusionValue) => {
                                                generalSearchInclusionValues
                                                    .forEach(
                                                        (
                                                            generalSearchInclusionValue,
                                                        ) => {
                                                            limitPerPages
                                                                .forEach(
                                                                    (
                                                                        limitPerPage,
                                                                    ) => {
                                                                        const queryString =
                                                                            createQueryString(
                                                                                {
                                                                                    ...initialQueryState,
                                                                                    generalSearchCase,
                                                                                    generalSearchExclusionValue,
                                                                                    generalSearchInclusionValue,
                                                                                    limitPerPage,
                                                                                    projectionFields,
                                                                                    queryChains:
                                                                                        {
                                                                                            filter:
                                                                                                {
                                                                                                    [filterLogicalOperator]:
                                                                                                        [
                                                                                                            [
                                                                                                                filterField,
                                                                                                                filterComparisonOperator,
                                                                                                                filterValue,
                                                                                                            ],
                                                                                                        ],
                                                                                                } as QueryChains[
                                                                                                    "filter"
                                                                                                ],
                                                                                            sort:
                                                                                                {
                                                                                                    [sortLogicalOperator]:
                                                                                                        [
                                                                                                            [
                                                                                                                sortField,
                                                                                                                _comparisonOperator,
                                                                                                                sortDirection,
                                                                                                            ],
                                                                                                        ],
                                                                                                } as QueryChains[
                                                                                                    "sort"
                                                                                                ],
                                                                                        },
                                                                                },
                                                                            );

                                                                        acc
                                                                            .push(
                                                                                queryString,
                                                                            );
                                                                    },
                                                                );
                                                        },
                                                    );
                                            },
                                        );
                                    },
                                );
                            });
                        },
                    );
                });
                //
                //
                return acc;
            },
            [],
        );
    }

    return generateQueryStringInputPermutations({
        filterQueryChain,
        generalSearchCases,
        generalSearchExclusionValues,
        generalSearchInclusionValues,
        limitPerPages,
        projectionFields,
        sortQueryChain,
    });
}

function generateUsersQueryTestInput(
    slicedAmount: number = 1,
): Array<UsersQueryState> {
    const randomQueryStrings = createRandomUsersQueryStrings();

    const randomIdx = Math.floor(
        Math.random() * randomQueryStrings.length - slicedAmount,
    );
    const sliced = randomQueryStrings.slice(
        randomIdx,
        randomIdx + slicedAmount,
    );

    return sliced.map((queryString) => {
        return {
            ...initialUsersQueryState,
            arrangeByDirection: "ascending",
            arrangeByField: "username",
            currentPage: 1,
            newQueryFlag: true,
            queryString,
            totalDocuments: 0,
        };
    });
}

// duplicate of the one in src/components/query/utils.tsx
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
