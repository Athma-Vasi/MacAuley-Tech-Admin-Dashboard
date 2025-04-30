import { NavigateFunction } from "react-router-dom";
import { shuffle } from "simple-statistics";
import { describe, expect, it, vi } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    LOGIN_URL,
    VALID_BOOLEANS,
} from "../../constants";
import { AuthDispatch } from "../../context/authProvider";
import { GlobalDispatch } from "../../context/globalProvider";
import { createSafeBoxResult } from "../../utils";
import { DIRECTORY_EMPLOYEE_DATA } from "../directory/data";
import { handleLogoutMock } from "../testing/utils";
import { SAMPLE_USER_DOCUMENT } from "../usersQuery/constants";
import { loginAction } from "./actions";
import { handleLoginButtonClick } from "./handlers";
import {
    loginReducer_setIsLoading,
    loginReducer_setIsSubmitting,
    loginReducer_setIsSuccessful,
    loginReducer_setPassword,
    loginReducer_setUsername,
} from "./reducers";
import { LoginDispatch } from "./schemas";
import { initialLoginState } from "./state";

describe("loginReducer", () => {
    describe("setIsLoading", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsLoading,
                    payload: value,
                };
                const state = loginReducer_setIsLoading(
                    initialLoginState,
                    dispatch,
                );
                expect(state.isLoading).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialIsLoading = initialLoginState.isLoading;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsLoading,
                    payload: value,
                };
                const state = loginReducer_setIsLoading(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.isLoading).toBe(initialIsLoading);
            });
        });
    });

    describe("setIsSubmitting", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsSubmitting,
                    payload: value,
                };
                const state = loginReducer_setIsSubmitting(
                    initialLoginState,
                    dispatch,
                );
                expect(state.isSubmitting).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialIsSubmitting = initialLoginState.isSubmitting;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsSubmitting,
                    payload: value,
                };
                const state = loginReducer_setIsSubmitting(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.isSubmitting).toBe(initialIsSubmitting);
            });
        });
    });

    describe("setIsSuccessful", () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsSuccessful,
                    payload: value,
                };
                const state = loginReducer_setIsSuccessful(
                    initialLoginState,
                    dispatch,
                );
                expect(state.isSuccessful).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialIsSuccessful = initialLoginState.isSuccessful;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setIsSuccessful,
                    payload: value,
                };
                const state = loginReducer_setIsSuccessful(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.isSuccessful).toBe(initialIsSuccessful);
            });
        });
    });

    describe("setPassword", () => {
        it("should allow valid string values", () => {
            const validValues = [
                "password123Q!",
                "mypasswordQ1!",
                "testingQ1!",
            ];
            validValues.forEach((value) => {
                const dispatch = {
                    action: loginAction.setPassword,
                    payload: value,
                };
                const state = loginReducer_setPassword(
                    initialLoginState,
                    dispatch,
                );
                expect(state.password).toBe(value);
            });
        });

        it("should not allow invalid string values", () => {
            const initialPassword = initialLoginState.password;

            INVALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setPassword,
                    payload: value,
                };
                const state = loginReducer_setPassword(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.password).toBe(initialPassword);
            });
        });
    });

    describe("setUsername", () => {
        it("should allow valid string values", () => {
            const validValues = [
                "username123Q!",
                "myusernameQ1!",
                "testuserQ1!",
            ];
            validValues.forEach((value) => {
                const dispatch = {
                    action: loginAction.setUsername,
                    payload: value,
                };
                const state = loginReducer_setUsername(
                    initialLoginState,
                    dispatch,
                );
                expect(state.username).toBe(value);
            });
        });

        it("should not allow invalid string values", () => {
            const initialUsername = initialLoginState.username;

            INVALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setUsername,
                    payload: value,
                };
                const state = loginReducer_setUsername(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.username).toBe(initialUsername);
            });
        });
    });
});

async function handleLoginButtonClickTestMock(
    schema: { username: string; password: string },
    testKind: "error" | "success" = "success",
) {
    const authDispatch = vi.fn() as React.Dispatch<AuthDispatch>;
    const fetchAbortControllerRef = {
        current: null,
    } as React.RefObject<AbortController | null>;
    const globalDispatch = vi.fn() as React.Dispatch<GlobalDispatch>;
    const isComponentMountedRef = {
        current: true,
    } as React.RefObject<boolean>;
    const loginDispatch = vi.fn() as React.Dispatch<LoginDispatch>;
    const navigate = vi.fn() as NavigateFunction;
    const toLocation = "/dashboard/financials";
    const showBoundary = vi.fn() as (error: unknown) => void;
    const url = LOGIN_URL;

    try {
        const handleLoginButtonClickResult = await handleLoginButtonClick({
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            loginDispatch,
            navigate,
            schema,
            showBoundary,
            toLocation,
            url,
        });

        if (handleLoginButtonClickResult.err) {
            return createSafeBoxResult({
                message: handleLoginButtonClickResult.val.message ??
                    "Error logging in",
            });
        }

        const parsedServerResponse =
            handleLoginButtonClickResult.safeUnwrap().data;
        if (parsedServerResponse === undefined) {
            return createSafeBoxResult({
                message: "No data returned from server",
            });
        }

        if (testKind === "success" && parsedServerResponse.kind === "success") {
            const { accessToken: newAccessToken } = parsedServerResponse;

            const logoutResult = await handleLogoutMock({
                newAccessToken,
            });

            if (logoutResult.err) {
                return createSafeBoxResult({
                    message: logoutResult.val.message ?? "Logout failed",
                });
            }
        }

        describe(
            `handleLoginButtonClickTestMock - ${testKind} - login
            given 
            ${
                testKind === "success"
                    ? "valid"
                    : "invalid"
            } username: ${schema.username}
         and password: ${schema.password}
            `,
            () => {
                if (testKind === "success") {
                    it("should login successfully", () => {
                        expect(parsedServerResponse.data.length)
                            .toBeGreaterThanOrEqual(1);
                    });
                } else {
                    it("should login unsuccessfully", () => {
                        expect(parsedServerResponse.data)
                            .toBe(void 0);
                    });
                }
            },
        );

        return createSafeBoxResult({
            data: true,
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({ message: "Login error" });
    }
}

const EXISTING_USERNAMES = shuffle(DIRECTORY_EMPLOYEE_DATA).map(
    (employee) => employee.username,
);
await Promise.all(
    EXISTING_USERNAMES.map(
        async (username) => {
            const schema = {
                username,
                password: "passwordQ1!",
            };
            await handleLoginButtonClickTestMock(schema, "success");
        },
    ),
);

const TEST_SIZE = 5;
const NON_EXISTING_USERNAMES = Array.from({ length: TEST_SIZE }, (_, idx) => {
    return `${idx}${SAMPLE_USER_DOCUMENT.username}`;
});
await Promise.all(
    NON_EXISTING_USERNAMES.map(
        async (username) => {
            const schema = {
                username,
                password: "passwordQ1!",
            };
            await handleLoginButtonClickTestMock(schema, "error");
        },
    ),
);
