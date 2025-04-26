/**
 * isLoading: boolean;
  isSubmitting: boolean;
  isSuccessful: boolean;
  password: string;
  username: string;
 */

import { describe, expect, it } from "vitest";
import { loginAction } from "./actions";
import {
    loginReducer_setIsLoading,
    loginReducer_setIsSubmitting,
    loginReducer_setIsSuccessful,
    loginReducer_setPassword,
    loginReducer_setUsername,
} from "./reducers";
import { initialLoginState } from "./state";

describe("loginReducer_setIsLoading", () => {
    it("should allow valid boolean values", () => {
        const validValues = [true, false];
        validValues.forEach((value) => {
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
        const invalidValues = [null, undefined, 0, 1, "", "true", "false"];
        const initialIsLoading = initialLoginState.isLoading;
        invalidValues.forEach((value) => {
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

describe("loginReducer_setIsSubmitting", () => {
    it("should allow valid boolean values", () => {
        const validValues = [true, false];
        validValues.forEach((value) => {
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
        const invalidValues = [null, undefined, 0, 1, "", "true", "false"];
        const initialIsSubmitting = initialLoginState.isSubmitting;

        invalidValues.forEach((value) => {
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

describe("loginReducer_setIsSuccessful", () => {
    it("should allow valid boolean values", () => {
        const validValues = [true, false];
        validValues.forEach((value) => {
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
        const invalidValues = [null, undefined, 0, 1, "", "true", "false"];
        const initialIsSuccessful = initialLoginState.isSuccessful;

        invalidValues.forEach((value) => {
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

describe("loginReducer_setPassword", () => {
    it("should allow valid string values", () => {
        const validValues = ["password123Q!", "mypasswordQ1!", "testingQ1!"];
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
        const invalidValues = [null, undefined, 0, 1, true, false];
        const initialPassword = initialLoginState.password;

        invalidValues.forEach((value) => {
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

describe("loginReducer_setUsername", () => {
    it("should allow valid string values", () => {
        const validValues = ["username123Q!", "myusernameQ1!", "testuserQ1!"];
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
        const invalidValues = [null, undefined, 0, 1, true, false];
        const initialUsername = initialLoginState.username;

        invalidValues.forEach((value) => {
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
