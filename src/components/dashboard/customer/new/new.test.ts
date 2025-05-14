import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { CustomerNewReturningYAxisKey } from "../types";
import { newAction } from "./actions";
import { newReducer_setYAxisKey } from "./reducers";
import { initialNewState } from "./state";
import { NewDispatch } from "./types";

describe(newAction.setYAxisKey, () => {
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
            const dispatch: NewDispatch = {
                action: newAction.setYAxisKey,
                payload: value,
            };

            const state = newReducer_setYAxisKey(
                initialNewState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: NewDispatch = {
                action: newAction.setYAxisKey,
                payload: value as any,
            };
            const state = newReducer_setYAxisKey(
                initialNewState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialNewState.yAxisKey);
        });
    });
});
