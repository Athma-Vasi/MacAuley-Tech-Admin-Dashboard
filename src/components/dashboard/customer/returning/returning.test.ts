import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { CustomerNewReturningYAxisKey } from "../types";
import { returningAction } from "./actions";
import { returningReducer_setYAxisKey } from "./reducers";
import { initialReturningState } from "./state";
import { ReturningDispatch } from "./types";

describe(returningAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: CustomerNewReturningYAxisKey[] = [
            "total",
            "all",
            "overview",
            "repair",
            "sales",
            "inStore",
            "online",
        ];
        validValues.forEach((value) => {
            const dispatch: ReturningDispatch = {
                action: returningAction.setYAxisKey,
                payload: value,
            };

            const state = returningReducer_setYAxisKey(
                initialReturningState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: ReturningDispatch = {
                action: returningAction.setYAxisKey,
                payload: value as any,
            };
            const state = returningReducer_setYAxisKey(
                initialReturningState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialReturningState.yAxisKey);
        });
    });
});
