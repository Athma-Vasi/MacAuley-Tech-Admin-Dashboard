import { describe, expect, it } from "vitest";
import {
    ARRANGE_BY_DIRECTIONS,
    INVALID_BOOLEANS,
    INVALID_NUMBERS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../constants";
import { UserDocument } from "../../types";
import { usersQueryAction } from "./actions";
import { SAMPLE_USER_DOCUMENT } from "./constants";
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
import { UsersQueryDispatch } from "./schemas";
import { initialUsersQueryState } from "./state";

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
