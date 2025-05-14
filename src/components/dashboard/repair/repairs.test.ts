import "@vitest/web-worker";
import { describe, expect, it } from "vitest";
import { INVALID_BOOLEANS, VALID_BOOLEANS } from "../../../constants";
import { repairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import {
    repairMetricsReducer_setCards,
    repairMetricsReducer_setIsGenerating,
    repairMetricsReducer_setRepairChartsWorker,
} from "./reducers";
import { initialRepairMetricsState } from "./state";
import { RepairMetricsDispatch } from "./types";

describe("Repair Metrics Reducers", () => {
    describe(repairMetricsAction.setCards, () => {
        it("should allow valid empty payload", () => {
            const dispatch: RepairMetricsDispatch = {
                action: repairMetricsAction.setCards,
                payload: {
                    dailyCards: [],
                    monthlyCards: [],
                    yearlyCards: [],
                } as RepairMetricsCards,
            };
            const state = repairMetricsReducer_setCards(
                initialRepairMetricsState,
                dispatch,
            );
            expect(state.cards).toEqual({
                dailyCards: [],
                monthlyCards: [],
                yearlyCards: [],
            });
        });

        it("should not allow invalid payload", () => {
            const dispatch: RepairMetricsDispatch = {
                action: repairMetricsAction.setCards,
                payload: void 0 as any,
            };
            const state = repairMetricsReducer_setCards(
                initialRepairMetricsState,
                dispatch,
            );
            expect(state.cards).toBeNull();
        });
    });

    describe(repairMetricsAction.setIsGenerating, () => {
        it("should allow valid payload", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch: RepairMetricsDispatch = {
                    action: repairMetricsAction.setIsGenerating,
                    payload: value,
                };
                const state = repairMetricsReducer_setIsGenerating(
                    initialRepairMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(value);
            });
        });

        it("should not allow invalid payload", () => {
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch: RepairMetricsDispatch = {
                    action: repairMetricsAction.setIsGenerating,
                    payload: value as any,
                };
                const state = repairMetricsReducer_setIsGenerating(
                    initialRepairMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).toBe(
                    initialRepairMetricsState.isGenerating,
                );
            });
        });
    });

    describe(repairMetricsAction.setRepairChartsWorker, () => {
        it("should allow valid payload", () => {
            const dispatch: RepairMetricsDispatch = {
                action: repairMetricsAction.setRepairChartsWorker,
                payload: new Worker(""),
            };
            const state = repairMetricsReducer_setRepairChartsWorker(
                initialRepairMetricsState,
                dispatch,
            );
            expect(state.repairChartsWorker).toBeInstanceOf(Worker);
        });

        it("should not allow invalid payload", () => {
            const dispatch: RepairMetricsDispatch = {
                action: repairMetricsAction.setRepairChartsWorker,
                payload: {} as any,
            };
            const state = repairMetricsReducer_setRepairChartsWorker(
                initialRepairMetricsState,
                dispatch,
            );
            expect(state.repairChartsWorker).toBe(
                initialRepairMetricsState.repairChartsWorker,
            );
        });
    });
});
