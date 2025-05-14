import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";
import { churnRetentionAction } from "./actions";
import { churnRetentionReducer_setYAxisKey } from "./reducers";
import { initialChurnRetentionState } from "./state";
import { ChurnRetentionDispatch } from "./types";

describe(churnRetentionAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: CustomerMetricsChurnRetentionChartsKey[] = [
            "overview",
            "churnRate",
            "retentionRate",
        ];
        validValues.forEach((value) => {
            const dispatch: ChurnRetentionDispatch = {
                action: churnRetentionAction.setYAxisKey,
                payload: value,
            };

            const state = churnRetentionReducer_setYAxisKey(
                initialChurnRetentionState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: ChurnRetentionDispatch = {
                action: churnRetentionAction.setYAxisKey,
                payload: value as any,
            };
            const state = churnRetentionReducer_setYAxisKey(
                initialChurnRetentionState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialChurnRetentionState.yAxisKey);
        });
    });
});
