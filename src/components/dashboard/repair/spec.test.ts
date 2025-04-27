import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { MONTHS } from "../constants";
import { repairMetricsAction } from "./actions";
import {
    createRepairMetricsCalendarCharts,
    createRepairMetricsCharts,
    returnSelectedDateRepairMetrics,
} from "./chartsData";
import {
    repairMetricsReducer_setCalendarChartsData,
    repairMetricsReducer_setCharts,
    repairMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialRepairMetricsState } from "./state";
import { REPAIR_METRICS_DOCUMENT_SAMPLE } from "./testData";

describe("repairMetricsReducer", async () => {
    const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
        repairMetricsDocument: REPAIR_METRICS_DOCUMENT_SAMPLE,
        day: "01",
        month: "January",
        months: MONTHS,
        year: "2025",
    });

    const { currentYear, previousYear } =
        await createRepairMetricsCalendarCharts(selectedDateRepairMetrics);

    const repairMetricsCharts = await createRepairMetricsCharts({
        repairMetricsDocument: REPAIR_METRICS_DOCUMENT_SAMPLE,
        months: MONTHS,
        selectedDateRepairMetrics,
    });

    describe("repairMetricsReducer_setCalendarChartsData", () => {
        it("should allow valid data", () => {
            const dispatch = {
                action: repairMetricsAction.setCalendarChartsData,
                payload: {
                    currentYear,
                    previousYear,
                },
            };

            const state = repairMetricsReducer_setCalendarChartsData(
                initialRepairMetricsState,
                dispatch,
            );

            expect(state.calendarChartsData).to.not.equal(null);
        });
        it("should not allow invalid data", () => {
            const initialCalendarChartsData =
                initialRepairMetricsState.calendarChartsData;
            INVALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: repairMetricsAction.setCalendarChartsData,
                    payload: {
                        currentYear: value as any,
                        previousYear: value as any,
                    },
                };
                const state = repairMetricsReducer_setCalendarChartsData(
                    initialRepairMetricsState,
                    dispatch as any,
                );
                expect(state.calendarChartsData).to.equal(
                    initialCalendarChartsData,
                );
            });
        });
    });

    describe("repairMetricsReducer_setCharts", () => {
        it("should allow valid data", () => {
            const dispatch = {
                action: repairMetricsAction.setCharts,
                payload: repairMetricsCharts,
            };

            const state = repairMetricsReducer_setCharts(
                initialRepairMetricsState,
                dispatch,
            );

            expect(state.charts).to.not.equal(null);
        });
        it("should not allow invalid data", () => {
            const initialCharts = initialRepairMetricsState.charts;
            INVALID_STRINGS.forEach((value) => {
                const dispatch = {
                    action: repairMetricsAction.setCharts,
                    payload: value as any,
                };
                const state = repairMetricsReducer_setCharts(
                    initialRepairMetricsState,
                    dispatch as any,
                );
                expect(state.charts).to.equal(initialCharts);
            });
        });
    });

    describe("repairMetricsReducer_setIsGenerating", () => {
        it("should allow valid data", () => {
            VALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: repairMetricsAction.setIsGenerating,
                    payload: value,
                };
                const state = repairMetricsReducer_setIsGenerating(
                    initialRepairMetricsState,
                    dispatch as any,
                );
                expect(state.isGenerating).to.equal(value);
            });
        });
        it("should not allow invalid data", () => {
            const initialIsGenerating = initialRepairMetricsState.isGenerating;
            INVALID_BOOLEANS.forEach((value) => {
                const dispatch = {
                    action: repairMetricsAction.setIsGenerating,
                    payload: value as any,
                };
                const state = repairMetricsReducer_setIsGenerating(
                    initialRepairMetricsState,
                    dispatch,
                );
                expect(state.isGenerating).to.equal(initialIsGenerating);
            });
        });
    });
});
