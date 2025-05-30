import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
    VALID_STRINGS,
} from "../../constants";
import { loginAction } from "./actions";
import {
    loginReducer_setCustomerMetricsWorker,
    loginReducer_setErrorMessage,
    loginReducer_setFinancialMetricsGenerated,
    loginReducer_setFinancialMetricsWorker,
    loginReducer_setIsLoading,
    loginReducer_setIsSubmitting,
    loginReducer_setIsSuccessful,
    loginReducer_setLoginFetchWorker,
    loginReducer_setPassword,
    loginReducer_setProductMetricsGenerated,
    loginReducer_setProductMetricsWorker,
    loginReducer_setRepairMetricsGenerated,
    loginReducer_setRepairMetricsWorker,
    loginReducer_setUsername,
} from "./reducers";
import { initialLoginState } from "./state";

describe("loginReducer", () => {
    describe(loginAction.setIsLoading, () => {
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

    describe(loginAction.setIsSubmitting, () => {
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

    describe(loginAction.setIsSuccessful, () => {
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

    describe(loginAction.setPassword, () => {
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

    describe(loginAction.setUsername, () => {
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

    describe(loginAction.setLoginFetchWorker, () => {
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

    describe(loginAction.setErrorMessage, () => {
        it("should allow valid string values", () => {
            VALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setErrorMessage,
                    payload: value,
                };
                const state = loginReducer_setErrorMessage(
                    initialLoginState,
                    dispatch,
                );
                expect(state.errorMessage).toBe(value);
            });
        });

        it("should not allow invalid string values", () => {
            const initialErrorMessage = initialLoginState.errorMessage;

            INVALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setErrorMessage,
                    payload: value,
                };
                const state = loginReducer_setErrorMessage(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.errorMessage).toBe(initialErrorMessage);
            });
        });
    });

    describe(loginAction.setCustomerMetricsWorker, () => {
        it("should allow valid Worker values", () => {
            const worker = new Worker("");
            const dispatch = {
                action: loginAction.setCustomerMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setCustomerMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.customerMetricsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid Worker values", () => {
            const worker = {} as Worker;
            const dispatch = {
                action: loginAction.setCustomerMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setCustomerMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.customerMetricsWorker).toBeNull();
        });
    });

    describe(loginAction.setFinancialMetricsGenerated, () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setFinancialMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setFinancialMetricsGenerated(
                    initialLoginState,
                    dispatch,
                );
                expect(state.financialMetricsGenerated).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialFinancialMetricsGenerated =
                initialLoginState.financialMetricsGenerated;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setFinancialMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setFinancialMetricsGenerated(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.financialMetricsGenerated).toBe(
                    initialFinancialMetricsGenerated,
                );
            });
        });
    });

    describe(loginAction.setFinancialMetricsWorker, () => {
        it("should allow valid Worker values", () => {
            const worker = new Worker("");
            const dispatch = {
                action: loginAction.setFinancialMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setFinancialMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.financialMetricsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid Worker values", () => {
            const worker = {} as Worker;
            const dispatch = {
                action: loginAction.setFinancialMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setFinancialMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.financialMetricsWorker).toBeNull();
        });
    });

    describe(loginAction.setProductMetricsGenerated, () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setProductMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setProductMetricsGenerated(
                    initialLoginState,
                    dispatch,
                );
                expect(state.productMetricsGenerated).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialProductMetricsGenerated =
                initialLoginState.productMetricsGenerated;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setProductMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setProductMetricsGenerated(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.productMetricsGenerated).toBe(
                    initialProductMetricsGenerated,
                );
            });
        });
    });

    describe(loginAction.setProductMetricsWorker, () => {
        it("should allow valid Worker values", () => {
            const worker = new Worker("");
            const dispatch = {
                action: loginAction.setProductMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setProductMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.productMetricsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid Worker values", () => {
            const worker = {} as Worker;
            const dispatch = {
                action: loginAction.setProductMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setProductMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.productMetricsWorker).toBeNull();
        });
    });

    describe(loginAction.setRepairMetricsGenerated, () => {
        it("should allow valid boolean values", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setRepairMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setRepairMetricsGenerated(
                    initialLoginState,
                    dispatch,
                );
                expect(state.repairMetricsGenerated).toBe(value);
            });
        });

        it("should not allow invalid boolean values", () => {
            const initialRepairMetricsGenerated =
                initialLoginState.repairMetricsGenerated;

            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: loginAction.setRepairMetricsGenerated,
                    payload: value,
                };
                const state = loginReducer_setRepairMetricsGenerated(
                    initialLoginState,
                    dispatch as any,
                );
                expect(state.repairMetricsGenerated).toBe(
                    initialRepairMetricsGenerated,
                );
            });
        });
    });

    describe(loginAction.setRepairMetricsWorker, () => {
        it("should allow valid Worker values", () => {
            const worker = new Worker("");
            const dispatch = {
                action: loginAction.setRepairMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setRepairMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.repairMetricsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid Worker values", () => {
            const worker = {} as Worker;
            const dispatch = {
                action: loginAction.setRepairMetricsWorker,
                payload: worker,
            };
            const state = loginReducer_setRepairMetricsWorker(
                initialLoginState,
                dispatch,
            );
            expect(state.repairMetricsWorker).toBeNull();
        });
    });
});
