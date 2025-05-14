import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { INVALID_BOOLEANS, VALID_BOOLEANS } from "../../../constants";
import { productMetricsAction } from "./actions";
import {
    productMetricsReducer_setCards,
    productMetricsReducer_setIsGenerating,
    productMetricsReducer_setProductChartsWorker,
} from "./reducers";
import { initialProductMetricsState } from "./state";
import { ProductMetricsDispatch } from "./types";

describe("Product Metrics Reducers", () => {
    describe(productMetricsAction.setCards, () => {
        it("should allow valid empty payload", () => {
            const payload = {
                dailyCards: {
                    revenue: [],
                    unitsSold: [],
                },
                monthlyCards: {
                    revenue: [],
                    unitsSold: [],
                },
                yearlyCards: {
                    revenue: [],
                    unitsSold: [],
                },
            };

            const dispatch: ProductMetricsDispatch = {
                action: productMetricsAction.setCards,
                payload,
            };
            const state = productMetricsReducer_setCards(
                initialProductMetricsState,
                dispatch,
            );
            expect(state.cards).toEqual(payload);
        });

        it("should not allow invalid payload", () => {
            const dispatch: ProductMetricsDispatch = {
                action: productMetricsAction.setCards,
                payload: void 0 as any,
            };
            const state = productMetricsReducer_setCards(
                initialProductMetricsState,
                dispatch,
            );
            expect(state.cards).toBeNull();
        });
    });

    describe(productMetricsAction.setIsGenerating, () => {
        it("should allow valid payload", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: ProductMetricsDispatch = {
                    action: productMetricsAction.setIsGenerating,
                    payload: value,
                };
                const state = productMetricsReducer_setIsGenerating(
                    initialProductMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: ProductMetricsDispatch = {
                    action: productMetricsAction.setIsGenerating,
                    payload: value as any,
                };
                const state = productMetricsReducer_setIsGenerating(
                    initialProductMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(
                    initialProductMetricsState.isGenerating,
                );
            });
        });
    });

    describe(productMetricsAction.setProductChartsWorker, () => {
        it("should allow valid payload", () => {
            const dispatch: ProductMetricsDispatch = {
                action: productMetricsAction.setProductChartsWorker,
                payload: new Worker(""),
            };
            const state = productMetricsReducer_setProductChartsWorker(
                initialProductMetricsState,
                dispatch,
            );
            expect(state.productChartsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid payload", () => {
            const dispatch: ProductMetricsDispatch = {
                action: productMetricsAction.setProductChartsWorker,
                payload: {} as any,
            };
            const state = productMetricsReducer_setProductChartsWorker(
                initialProductMetricsState,
                dispatch,
            );
            expect(state.productChartsWorker).toBe(
                initialProductMetricsState.productChartsWorker,
            );
        });
    });
});
