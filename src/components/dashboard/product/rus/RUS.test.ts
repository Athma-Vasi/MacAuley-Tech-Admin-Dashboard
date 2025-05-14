import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { ProductMetricsChartKey } from "../chartsData";
import { rusAction } from "./actions";
import { rusReducer_setYAxisKey } from "./reducers";
import { initialRUSState } from "./state";
import { RUSDispatch } from "./types";

describe(rusAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: ProductMetricsChartKey[] = [
            "total",
            "overview",
            "inStore",
            "online",
        ];
        validValues.forEach((value) => {
            const dispatch: RUSDispatch = {
                action: rusAction.setYAxisKey,
                payload: value,
            };

            const state = rusReducer_setYAxisKey(
                initialRUSState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: RUSDispatch = {
                action: rusAction.setYAxisKey,
                payload: value as any,
            };
            const state = rusReducer_setYAxisKey(
                initialRUSState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialRUSState.yAxisKey);
        });
    });
});
