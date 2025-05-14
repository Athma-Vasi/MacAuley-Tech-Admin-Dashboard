import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { INVALID_BOOLEANS, VALID_BOOLEANS } from "../../../constants";
import { customerMetricsAction } from "./actions";
import {
    customerMetricsReducer_setCards,
    customerMetricsReducer_setCustomerChartsWorker,
    customerMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialCustomerMetricsState } from "./state";
import { CustomerMetricsDispatch } from "./types";

describe("Customer Metrics Reducers", () => {
    describe(customerMetricsAction.setCards, () => {
        it("should allow valid empty payload", () => {
            const payload = {
                dailyCards: {
                    overview: [],
                    new: [],
                    returning: [],
                    churnRate: [],
                    retentionRate: [],
                },
                monthlyCards: {
                    overview: [],
                    new: [],
                    returning: [],
                    churnRate: [],
                    retentionRate: [],
                },
                yearlyCards: {
                    overview: [],
                    new: [],
                    returning: [],
                    churnRate: [],
                    retentionRate: [],
                },
            };

            const dispatch: CustomerMetricsDispatch = {
                action: customerMetricsAction.setCards,
                payload,
            };
            const state = customerMetricsReducer_setCards(
                initialCustomerMetricsState,
                dispatch,
            );
            expect(state.cards).toEqual(payload);
        });

        it("should not allow invalid payload", () => {
            const dispatch: CustomerMetricsDispatch = {
                action: customerMetricsAction.setCards,
                payload: void 0 as any,
            };
            const state = customerMetricsReducer_setCards(
                initialCustomerMetricsState,
                dispatch,
            );
            expect(state.cards).toBeNull();
        });
    });

    describe(customerMetricsAction.setIsGenerating, () => {
        it("should allow valid payload", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: CustomerMetricsDispatch = {
                    action: customerMetricsAction.setIsGenerating,
                    payload: value,
                };
                const state = customerMetricsReducer_setIsGenerating(
                    initialCustomerMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: CustomerMetricsDispatch = {
                    action: customerMetricsAction.setIsGenerating,
                    payload: value as any,
                };
                const state = customerMetricsReducer_setIsGenerating(
                    initialCustomerMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(
                    initialCustomerMetricsState.isGenerating,
                );
            });
        });
    });

    describe(customerMetricsAction.setCustomerChartsWorker, () => {
        it("should allow valid payload", () => {
            const dispatch: CustomerMetricsDispatch = {
                action: customerMetricsAction.setCustomerChartsWorker,
                payload: new Worker(""),
            };
            const state = customerMetricsReducer_setCustomerChartsWorker(
                initialCustomerMetricsState,
                dispatch,
            );
            expect(state.customerChartsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid payload", () => {
            const dispatch: CustomerMetricsDispatch = {
                action: customerMetricsAction.setCustomerChartsWorker,
                payload: {} as any,
            };
            const state = customerMetricsReducer_setCustomerChartsWorker(
                initialCustomerMetricsState,
                dispatch,
            );
            expect(state.customerChartsWorker).toBe(
                initialCustomerMetricsState.customerChartsWorker,
            );
        });
    });
});
