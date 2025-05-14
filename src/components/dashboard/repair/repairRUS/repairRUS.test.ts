import { describe, expect, it } from "vitest";
import { INVALID_STRINGS } from "../../../../constants";
import { RepairSubMetric } from "../types";
import { repairRUSAction } from "./actions";
import { repairRUSReducer_setYAxisKey } from "./reducers";
import { initialRepairRUSState } from "./state";
import { RepairRUSDispatch } from "./types";

describe(repairRUSAction.setYAxisKey, () => {
    it("should allow valid payload", () => {
        const validValues: RepairSubMetric[] = ["revenue", "unitsRepaired"];
        validValues.forEach((value) => {
            const dispatch: RepairRUSDispatch = {
                action: repairRUSAction.setYAxisKey,
                payload: value,
            };

            const state = repairRUSReducer_setYAxisKey(
                initialRepairRUSState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(value);
        });
    });

    it("should not allow invalid payload", () => {
        INVALID_STRINGS.forEach((value) => {
            const dispatch: RepairRUSDispatch = {
                action: repairRUSAction.setYAxisKey,
                payload: value as any,
            };
            const state = repairRUSReducer_setYAxisKey(
                initialRepairRUSState,
                dispatch,
            );
            expect(state.yAxisKey).toBe(initialRepairRUSState.yAxisKey);
        });
    });
});
