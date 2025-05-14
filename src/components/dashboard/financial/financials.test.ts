import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { INVALID_BOOLEANS, VALID_BOOLEANS } from "../../../constants";
import { financialMetricsAction } from "./actions";
import {
    financialMetricsReducer_setCards,
    financialMetricsReducer_setFinancialChartsWorker,
    financialMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialFinancialMetricsState } from "./state";
import { FinancialMetricsDispatch } from "./types";

describe("Financial Metrics Reducers", () => {
    describe(financialMetricsAction.setCards, () => {
        it("should allow valid empty payload", () => {
            const payload = {
                dailyCards: {
                    profit: [],
                    expenses: [],
                    transactions: [],
                    revenue: [],
                    otherMetrics: [],
                },
                monthlyCards: {
                    profit: [],
                    expenses: [],
                    transactions: [],
                    revenue: [],
                    otherMetrics: [],
                },
                yearlyCards: {
                    profit: [],
                    expenses: [],
                    transactions: [],
                    revenue: [],
                    otherMetrics: [],
                },
            };

            const dispatch: FinancialMetricsDispatch = {
                action: financialMetricsAction.setCards,
                payload,
            };
            const state = financialMetricsReducer_setCards(
                initialFinancialMetricsState,
                dispatch,
            );
            expect(state.cards).toEqual(payload);
        });

        it("should not allow invalid payload", () => {
            const dispatch: FinancialMetricsDispatch = {
                action: financialMetricsAction.setCards,
                payload: void 0 as any,
            };
            const state = financialMetricsReducer_setCards(
                initialFinancialMetricsState,
                dispatch,
            );
            expect(state.cards).toBeNull();
        });
    });

    describe(financialMetricsAction.setIsGenerating, () => {
        it("should allow valid payload", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: FinancialMetricsDispatch = {
                    action: financialMetricsAction.setIsGenerating,
                    payload: value,
                };
                const state = financialMetricsReducer_setIsGenerating(
                    initialFinancialMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: FinancialMetricsDispatch = {
                    action: financialMetricsAction.setIsGenerating,
                    payload: value as any,
                };
                const state = financialMetricsReducer_setIsGenerating(
                    initialFinancialMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(
                    initialFinancialMetricsState.isGenerating,
                );
            });
        });
    });

    describe(financialMetricsAction.setFinancialChartsWorker, () => {
        it("should allow valid payload", () => {
            const dispatch: FinancialMetricsDispatch = {
                action: financialMetricsAction.setFinancialChartsWorker,
                payload: new Worker(""),
            };
            const state = financialMetricsReducer_setFinancialChartsWorker(
                initialFinancialMetricsState,
                dispatch,
            );
            expect(state.financialChartsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid payload", () => {
            const dispatch: FinancialMetricsDispatch = {
                action: financialMetricsAction.setFinancialChartsWorker,
                payload: {} as any,
            };
            const state = financialMetricsReducer_setFinancialChartsWorker(
                initialFinancialMetricsState,
                dispatch,
            );
            expect(state.financialChartsWorker).toBe(
                initialFinancialMetricsState.financialChartsWorker,
            );
        });
    });
});
