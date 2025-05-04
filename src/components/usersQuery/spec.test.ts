import { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import {
    API_URL,
    ARRANGE_BY_DIRECTIONS,
    INVALID_BOOLEANS,
    INVALID_NUMBERS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../constants";
import { authAction } from "../../context/authProvider";
import { UserDocument } from "../../types";
import { createSafeBoxResult, parseSafeSync } from "../../utils";
import { DIRECTORY_EMPLOYEE_DATA, EmployeeDoc } from "../directory/data";
import { initialQueryState } from "../query/state";
import {
    GeneralSearchCase,
    LimitPerPage,
    LogicalOperator,
    QueryChains,
    QueryLink,
    SortDirection,
} from "../query/types";
import { createQueryString } from "../query/utils";
import { handleLoginMock, handleLogoutMock } from "../testing/utils";
import { usersQueryAction } from "./actions";
import { SAMPLE_USER_DOCUMENT } from "./constants";
import { handleUsersQuerySubmitGET } from "./handlers";
import {
    usersQueryReducer_resetToInitial,
    usersQueryReducer_setArrangeByDirection,
    usersQueryReducer_setArrangeByField,
    usersQueryReducer_setCurrentPage,
    usersQueryReducer_setIsError,
    usersQueryReducer_setIsLoading,
    usersQueryReducer_setNewQueryFlag,
    usersQueryReducer_setPages,
    usersQueryReducer_setQueryString,
    usersQueryReducer_setResourceData,
    usersQueryReducer_setTotalDocuments,
} from "./reducers";
import { userDocumentOptionalsZod, UsersQueryDispatch } from "./schemas";
import { initialUsersQueryState } from "./state";
import { UsersQueryState } from "./types";

describe("usersQueryReducer", () => {
    describe("usersQueryReducer_resetToInitial", () => {
        it("should return the initial state", () => {
            const dispatch: UsersQueryDispatch = {
                action: usersQueryAction.resetToInitial,
                payload: initialUsersQueryState,
            };
            const state = usersQueryReducer_resetToInitial(
                initialUsersQueryState,
                dispatch,
            );
            expect(state).toEqual(initialUsersQueryState);
        });
    });

    describe("usersQueryReducer_setArrangeByDirection", () => {
        it("should allow valid string values", () => {
            ARRANGE_BY_DIRECTIONS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setArrangeByDirection,
                    payload: value,
                };
                const state = usersQueryReducer_setArrangeByDirection(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.arrangeByDirection).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialArrangeByDirection =
                initialUsersQueryState.arrangeByDirection;
            INVALID_STRINGS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setArrangeByDirection,
                    payload: value as any,
                };
                const state = usersQueryReducer_setArrangeByDirection(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.arrangeByDirection).toBe(
                    initialArrangeByDirection,
                );
            });
        });
    });

    describe("usersQueryReducer_setArrangeByField", () => {
        it("should allow valid string values", () => {
            const VALID_FIELDS: Array<keyof UserDocument> = [
                "addressLine",
                "city",
                "country",
                "department",
                "email",
                "firstName",
                "jobPosition",
                "lastName",
                "orgId",
                "parentOrgId",
                "password",
                "postalCodeCanada",
                "postalCodeUS",
                "profilePictureUrl",
                "province",
                "roles",
                "state",
                "storeLocation",
                "fileUploadId",
                "username",
                "_id",
                "createdAt",
                "updatedAt",
                "__v",
            ];
            VALID_FIELDS.forEach((value) => {
                const dispatch = {
                    action: usersQueryAction.setArrangeByField,
                    payload: value,
                };
                const state = usersQueryReducer_setArrangeByField(
                    initialUsersQueryState,
                    dispatch as any,
                );
                expect(state.arrangeByField).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialArrangeByField = initialUsersQueryState.arrangeByField;
            INVALID_STRINGS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setArrangeByField,
                    payload: value as any,
                };
                const state = usersQueryReducer_setArrangeByField(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.arrangeByField).toBe(initialArrangeByField);
            });
        });
    });

    describe("usersQueryReducer_setCurrentPage", () => {
        it("should allow valid number values", () => {
            const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
            VALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setCurrentPage,
                    payload: value,
                };
                const state = usersQueryReducer_setCurrentPage(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.currentPage).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialCurrentPage = initialUsersQueryState.currentPage;

            INVALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setCurrentPage,
                    payload: value as any,
                };
                const state = usersQueryReducer_setCurrentPage(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.currentPage).toBe(initialCurrentPage);
            });
        });
    });

    describe("usersQueryReducer_setIsError", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setIsError,
                    payload: value,
                };
                const state = usersQueryReducer_setIsError(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.isError).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialIsError = initialUsersQueryState.isError;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setIsError,
                    payload: value as any,
                };
                const state = usersQueryReducer_setIsError(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.isError).toBe(initialIsError);
            });
        });
    });

    describe("usersQueryReducer_setIsLoading", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setIsLoading,
                    payload: value,
                };
                const state = usersQueryReducer_setIsLoading(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.isLoading).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialIsLoading = initialUsersQueryState.isLoading;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setIsLoading,
                    payload: value as any,
                };
                const state = usersQueryReducer_setIsLoading(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.isLoading).toBe(initialIsLoading);
            });
        });
    });

    describe("usersQueryReducer_setNewQueryFlag", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setNewQueryFlag,
                    payload: value,
                };
                const state = usersQueryReducer_setNewQueryFlag(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.newQueryFlag).toBe(value);
            });
        });
        it("should not allow invalid boolean values", () => {
            const initialNewQueryFlag = initialUsersQueryState.newQueryFlag;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setNewQueryFlag,
                    payload: value as any,
                };
                const state = usersQueryReducer_setNewQueryFlag(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.newQueryFlag).toBe(initialNewQueryFlag);
            });
        });
    });

    describe("usersQueryReducer_setPages", () => {
        it("should allow valid number values", () => {
            const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
            VALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setPages,
                    payload: value,
                };
                const state = usersQueryReducer_setPages(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.pages).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialPages = initialUsersQueryState.pages;
            INVALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setPages,
                    payload: value as any,
                };
                const state = usersQueryReducer_setPages(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.pages).toBe(initialPages);
            });
        });
    });

    describe("usersQueryReducer_setQueryString", () => {
        it("should allow valid string values", () => {
            const VALID_STRINGS = ["", "test", "query"];
            VALID_STRINGS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setQueryString,
                    payload: value,
                };
                const state = usersQueryReducer_setQueryString(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.queryString).toBe(value);
            });
        });
        it("should not allow invalid string values", () => {
            const initialQueryString = initialUsersQueryState.queryString;
            INVALID_STRINGS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setQueryString,
                    payload: value as any,
                };
                const state = usersQueryReducer_setQueryString(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.queryString).toBe(initialQueryString);
            });
        });
    });

    describe("usersQueryReducer_setResourceData", () => {
        it("should allow valid array values", () => {
            const VALID_ARRAYS: Array<Omit<UserDocument, "password">> = [
                SAMPLE_USER_DOCUMENT,
            ];

            const dispatch: UsersQueryDispatch = {
                action: usersQueryAction.setResourceData,
                payload: VALID_ARRAYS,
            };
            const state = usersQueryReducer_setResourceData(
                initialUsersQueryState,
                dispatch,
            );
            expect(state.resourceData).toEqual(VALID_ARRAYS);
        });
        it("should not allow invalid array values", () => {
            const initialResourceData = initialUsersQueryState.resourceData;
            INVALID_STRINGS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setResourceData,
                    payload: value as any,
                };
                const state = usersQueryReducer_setResourceData(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.resourceData).toEqual(initialResourceData);
            });
        });
    });

    describe("usersQueryReducer_setTotalDocuments", () => {
        it("should allow valid number values", () => {
            const VALID_NUMBERS = [0, 1, 2, 3, 4, 5];
            VALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setTotalDocuments,
                    payload: value,
                };
                const state = usersQueryReducer_setTotalDocuments(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.totalDocuments).toBe(value);
            });
        });
        it("should not allow invalid number values", () => {
            const initialTotalDocuments = initialUsersQueryState.totalDocuments;
            INVALID_NUMBERS.forEach((value) => {
                const dispatch: UsersQueryDispatch = {
                    action: usersQueryAction.setTotalDocuments,
                    payload: value as any,
                };
                const state = usersQueryReducer_setTotalDocuments(
                    initialUsersQueryState,
                    dispatch,
                );
                expect(state.totalDocuments).toBe(initialTotalDocuments);
            });
        });
    });
});

async function handleUsersQuerySubmitGETTestMock(
    {
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    }: {
        arrangeByDirection: SortDirection;
        arrangeByField: keyof Omit<UserDocument, "password">;
        currentPage: number;
        newQueryFlag: boolean;
        queryString: string;
        totalDocuments: number;
    },
) {
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const authDispatch = vi.fn() as React.Dispatch<any>;
    const usersQueryDispatch = vi.fn() as React.Dispatch<any>;
    const navigate = vi.fn() as NavigateFunction;
    const showBoundary = vi.fn() as (error: unknown) => void;
    const url = API_URL;
    const usersQueryState: UsersQueryState = {
        ...initialUsersQueryState,
        arrangeByDirection,
        arrangeByField,
        currentPage,
        newQueryFlag,
        queryString,
        totalDocuments,
    };

    try {
        const loginResult = await handleLoginMock({});
        if (loginResult.err) {
            return createSafeBoxResult({ message: "Login failed" });
        }

        const loginUnwrapped = loginResult.safeUnwrap().data;
        if (loginUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Login data is undefined" });
        }

        const { accessToken } = loginUnwrapped[0];

        const usersQueryResult = await handleUsersQuerySubmitGET({
            accessToken,
            authDispatch,
            usersQueryDispatch,
            fetchAbortControllerRef,
            isComponentMountedRef,
            navigate,
            showBoundary,
            url,
            usersQueryState,
        });

        if (usersQueryResult.err) {
            return createSafeBoxResult({ message: "Users query failed" });
        }

        const usersQueryUnwrapped = usersQueryResult.safeUnwrap().data;
        if (usersQueryUnwrapped === undefined) {
            return createSafeBoxResult({
                message: "Users query data is undefined",
            });
        }

        const { newAccessToken, userDocuments } = usersQueryUnwrapped;

        const parsedResult = parseSafeSync({
            object: userDocuments,
            zSchema: userDocumentOptionalsZod,
        });

        if (parsedResult.err) {
            return createSafeBoxResult({ message: "Parsing failed" });
        }

        const logoutResult = await handleLogoutMock({ newAccessToken });
        if (logoutResult.err) {
            return createSafeBoxResult({ message: "Logout failed" });
        }

        const logoutUnwrapped = logoutResult.safeUnwrap().data;
        if (logoutUnwrapped === undefined) {
            return createSafeBoxResult({ message: "Logout data is undefined" });
        }

        describe(
            `handleUsersQuerySubmitGET
               when given: 
                 arrangeByDirection: ${arrangeByDirection}
                 arrangeByField: ${arrangeByField}
                 currentPage: ${currentPage}
                 newQueryFlag: ${newQueryFlag}
                 queryString: ${queryString}
                 totalDocuments: ${totalDocuments}
            `,
            () => {
                it("should return a SafeBoxResult with kind 'success'", () => {
                    expect(usersQueryResult.safeUnwrap().kind).toBe("success");
                });

                it("should call authDispatch to set accessToken", () => {
                    expect(authDispatch).toHaveBeenCalledWith({
                        action: authAction.setAccessToken,
                        payload: newAccessToken,
                    });
                });

                it("should call usersQueryDispatch to set resourceData", () => {
                    expect(usersQueryDispatch).toHaveBeenCalledWith({
                        action: usersQueryAction.setResourceData,
                        payload: parsedResult.safeUnwrap().data,
                    });
                });
            },
        );

        return createSafeBoxResult({ kind: "success" });
    } catch (error) {
        return createSafeBoxResult({ data: error, message: "Error occurred" });
    }
}

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
    const projectionFields: Array<keyof EmployeeDoc> = [
        "state",
        "province",
    ];

    function generateUsersQueryLink(): QueryLink {
        const length = DIRECTORY_EMPLOYEE_DATA.length;
        const randomIdx = Math.floor(Math.random() * length);
        const randomEmployee = DIRECTORY_EMPLOYEE_DATA[randomIdx];

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
            {} as EmployeeDoc,
        );

        const randomFieldIdx = Math.floor(
            Math.random() * Object.keys(safeRandomEmployee).length,
        );
        const randomField = Object.keys(safeRandomEmployee)[randomFieldIdx];
        const randomFieldsValue = safeRandomEmployee[
            randomField as keyof EmployeeDoc
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
            projectionFields: Array<keyof EmployeeDoc>;
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
    slicedAmount: number = 50,
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

await Promise.all(
    generateUsersQueryTestInput().map(
        async ({
            arrangeByDirection,
            arrangeByField,
            currentPage,
            newQueryFlag,
            queryString,
            totalDocuments,
        }) => {
            await handleUsersQuerySubmitGETTestMock({
                arrangeByDirection,
                arrangeByField,
                currentPage,
                newQueryFlag,
                queryString,
                totalDocuments,
            });
        },
    ),
);
