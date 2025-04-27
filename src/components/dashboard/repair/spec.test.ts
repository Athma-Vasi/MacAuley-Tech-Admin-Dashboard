import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { RepairMetricsDocument } from "../../../types";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations } from "../types";
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
import { RepairMetricCategory } from "./types";

async function repairMetricsTestCallback(
    { repairMetricCategory, storeLocation }: {
        storeLocation: AllStoreLocations;
        repairMetricCategory: RepairMetricCategory;
    },
) {
    const metricsResult = await handleMetricsMock({
        metricsView: "repairs",
        productMetricCategory: "All Products",
        repairMetricCategory,
        storeLocation,
    });

    if (metricsResult.err) {
        return;
    }

    const data = metricsResult.safeUnwrap().data;
    if (data === undefined) {
        return;
    }
    const [businesMetricsDocument] = data;

    const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
        repairMetricsDocument: businesMetricsDocument as RepairMetricsDocument,
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

    describe(
        `repairMetricsReducer 
        Store Location: ${storeLocation}
        Repair Metric: ${repairMetricCategory}`,
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
}

const repairMetricsTestInput: Array<
    {
        repairMetricCategory: RepairMetricCategory;
        storeLocation: AllStoreLocations;
    }
> = [
    {
        repairMetricCategory: "All Repairs",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Computer Component",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Peripheral",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Electronic Device",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Mobile Device",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Audio/Video",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "Accessory",
        storeLocation: "All Locations",
    },
    {
        repairMetricCategory: "All Repairs",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Computer Component",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Peripheral",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Electronic Device",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Mobile Device",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Audio/Video",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "Accessory",
        storeLocation: "Edmonton",
    },
    {
        repairMetricCategory: "All Repairs",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Computer Component",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Peripheral",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Electronic Device",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Mobile Device",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Audio/Video",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "Accessory",
        storeLocation: "Calgary",
    },
    {
        repairMetricCategory: "All Repairs",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Computer Component",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Peripheral",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Electronic Device",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Mobile Device",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Audio/Video",
        storeLocation: "Vancouver",
    },
    {
        repairMetricCategory: "Accessory",
        storeLocation: "Vancouver",
    },
];

for (const { repairMetricCategory, storeLocation } of repairMetricsTestInput) {
    await repairMetricsTestCallback({
        repairMetricCategory,
        storeLocation,
    });
}
