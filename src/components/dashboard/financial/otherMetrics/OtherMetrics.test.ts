import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { otherMetricsAction } from "./actions";
import { otherMetricsReducer_setYAxisKey } from "./reducers";
import { initialOtherMetricsState } from "./state";
import { OtherMetricsDispatch } from "./types";

describe(otherMetricsAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: FinancialMetricsOtherMetricsChartsKey[] = [
            "averageOrderValue",
            "conversionRate",
            "netProfitMargin",
        ];
        validValues.forEach((value) => {
            const dispatch: OtherMetricsDispatch = {
                action: otherMetricsAction.setYAxisKey,
                payload: value,
            };

            const state = otherMetricsReducer_setYAxisKey(
                initialOtherMetricsState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: OtherMetricsDispatch = {
                action: otherMetricsAction.setYAxisKey,
                payload: value as any,
            };
            const state = otherMetricsReducer_setYAxisKey(
                initialOtherMetricsState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialOtherMetricsState.yAxisKey);
        });
    });
});
