import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../constants";
import { loginAction } from "./actions";
import {
    loginReducer_setIsLoading,
    loginReducer_setIsSubmitting,
    loginReducer_setIsSuccessful,
    loginReducer_setLoginFetchWorker,
    loginReducer_setPassword,
    loginReducer_setUsername,
} from "./reducers";
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

    describe("setLoginFetchWorker", () => {
        it("should allow valid Worker values", () => {
            const worker = new Worker("");
            const dispatch = {
                action: loginAction.setLoginFetchWorker,
                payload: worker,
            };
            const state = loginReducer_setLoginFetchWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.loginFetchWorker).toBeInstanceOf(Worker);
        });
        it("should not allow invalid Worker values", () => {
            const worker = {} as Worker;
            const dispatch = {
                action: loginAction.setLoginFetchWorker,
                payload: worker,
            };
            const state = loginReducer_setLoginFetchWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.loginFetchWorker).toBeNull();
        });
    });
});
