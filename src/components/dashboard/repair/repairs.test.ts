import { shuffle } from "simple-statistics";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { RepairMetricsDocument, SafeBoxResult } from "../../../types";
import { createSafeBoxResult } from "../../../utils";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
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
import { RepairMetricCategory } from "./types";

type RepairMetricsTestCallbackInput = {
    calendarView: DashboardCalendarView;
    repairMetricCategory: RepairMetricCategory;
    storeLocation: AllStoreLocations;
};

async function repairMetricsTestCallback(
    { calendarView, repairMetricCategory, storeLocation }:
        RepairMetricsTestCallbackInput,
): Promise<SafeBoxResult> {
    try {
        const metricsResult = await handleMetricsMock({
            metricsView: "repairs",
            productMetricCategory: "All Products",
            repairMetricCategory,
            storeLocation,
        });

        if (metricsResult.err) {
            return createSafeBoxResult({
                message: metricsResult.val.message ??
                    "Error handling metrics mock",
            });
        }

        const data = metricsResult.safeUnwrap().data;
        if (data === undefined) {
            return createSafeBoxResult({
                message: "No data returned from metrics mock",
            });
        }
        const [businesMetricsDocument] = data;

        const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
            repairMetricsDocument:
                businesMetricsDocument as RepairMetricsDocument,
            day: "01",
            month: "January",
            months: MONTHS,
            year: "2025",
        });

        const { currentYear, previousYear } =
            await createRepairMetricsCalendarCharts(
                calendarView,
                selectedDateRepairMetrics,
                "2025-01-01",
            );

        const repairMetricsCharts = await createRepairMetricsCharts({
            repairMetricsDocument:
                businesMetricsDocument as RepairMetricsDocument,
            months: MONTHS,
            selectedDateRepairMetrics,
        });

        describe(
            `repairMetricsReducer 
               Store Location: ${storeLocation}
               Repair Metric: ${repairMetricCategory}
             `,
            () => {
                describe("repairMetricsReducer_setCalendarChartsData", () => {
                    it("should allow valid data", () => {
                        const dispatch = {
                            action: repairMetricsAction.setCalendarChartsData,
                            payload: {
                                currentYear,
                                previousYear,
                            },
                        };

                        const state =
                            repairMetricsReducer_setCalendarChartsData(
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
                                action:
                                    repairMetricsAction.setCalendarChartsData,
                                payload: {
                                    currentYear: value as any,
                                    previousYear: value as any,
                                },
                            };
                            const state =
                                repairMetricsReducer_setCalendarChartsData(
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
                        const initialIsGenerating =
                            initialRepairMetricsState.isGenerating;
                        INVALID_BOOLEANS.forEach((value) => {
                            const dispatch = {
                                action: repairMetricsAction.setIsGenerating,
                                payload: value as any,
                            };
                            const state = repairMetricsReducer_setIsGenerating(
                                initialRepairMetricsState,
                                dispatch,
                            );
                            expect(state.isGenerating).to.equal(
                                initialIsGenerating,
                            );
                        });
                    });
                });
            },
        );

        return createSafeBoxResult({ kind: "success" });
    } catch (error) {
        return createSafeBoxResult({ data: error, kind: "error" });
    }
}

function generateRepairMetricsPermutations() {
    const calendarViews: Array<DashboardCalendarView> = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);
    const repairMetricCategories: Array<RepairMetricCategory> = [
        "Accessory",
        "All Repairs",
        "Audio/Video",
        "Computer Component",
        "Electronic Device",
        "Mobile Device",
        "Peripheral",
    ];
    const shuffledRepairMetricCategories = shuffle(repairMetricCategories);
    const storeLocationViews: Array<AllStoreLocations> = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocationViews = shuffle(storeLocationViews);

    return shuffledCalendarViews.reduce((acc, calendarView) => {
        shuffledRepairMetricCategories.forEach((repairMetricCategory) => {
            shuffledStoreLocationViews.forEach((storeLocation) => {
                acc.validPermutations.push({
                    calendarView,
                    repairMetricCategory,
                    storeLocation,
                });
            });
        });
        //
        //
        return acc;
    }, {
        validPermutations: [] as Array<
            RepairMetricsTestCallbackInput
        >,
        invalidPermutations: [] as Array<
            RepairMetricsTestCallbackInput
        >,
    });
}

const { validPermutations, invalidPermutations } =
    generateRepairMetricsPermutations();
const TEST_SIZE = 1;
const slicedValids = validPermutations.slice(0, TEST_SIZE);
const slicedInvalids = invalidPermutations.slice(0, TEST_SIZE);

await Promise.all(
    slicedValids.map(
        async ({ calendarView, repairMetricCategory, storeLocation }) => {
            await repairMetricsTestCallback({
                calendarView,
                repairMetricCategory,
                storeLocation,
            });
        },
    ),
);

await Promise.all(
    slicedInvalids.map(
        async ({ calendarView, repairMetricCategory, storeLocation }) => {
            await repairMetricsTestCallback({
                calendarView,
                repairMetricCategory,
                storeLocation,
            });
        },
    ),
);
