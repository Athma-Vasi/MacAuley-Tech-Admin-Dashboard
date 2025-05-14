import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { FinancialYAxisKey } from "../../types";
import { pertAction } from "./actions";
import { pertReducer_setYAxisKey } from "./reducers";
import { initialPERTState } from "./state";
import { PERTDispatch } from "./types";

describe(pertAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: FinancialYAxisKey[] = [
            "total",
            "overview",
            "inStore",
            "online",
            "all",
            "repair",
            "sales",
        ];
        validValues.forEach((value) => {
            const dispatch: PERTDispatch = {
                action: pertAction.setYAxisKey,
                payload: value,
            };

            const state = pertReducer_setYAxisKey(
                initialPERTState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: PERTDispatch = {
                action: pertAction.setYAxisKey,
                payload: value as any,
            };
            const state = pertReducer_setYAxisKey(
                initialPERTState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialPERTState.yAxisKey);
        });
    });
});
