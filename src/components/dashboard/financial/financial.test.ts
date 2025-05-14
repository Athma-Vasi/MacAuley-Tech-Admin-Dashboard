import { shuffle } from "simple-statistics";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { FinancialMetricsDocument } from "../../../types";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { financialMetricsAction } from "./actions";
import {
    createFinancialMetricsCalendarCharts,
    createFinancialMetricsCharts,
    returnSelectedDateFinancialMetrics,
} from "./chartsData";
import {
    financialMetricsReducer_setCalendarChartsData,
    financialMetricsReducer_setCharts,
    financialMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialFinancialMetricsState } from "./state";
import { FinancialMetricsDispatch } from "./types";

type FinancialMetricsTestCallbackInput = {
    calendarView: DashboardCalendarView;
    storeLocation: AllStoreLocations;
};

async function financialMetricsTestCallback(
    { calendarView, storeLocation }: FinancialMetricsTestCallbackInput,
) {
    const metricsResult = await handleMetricsMock({
        metricsView: "financials",
        productMetricCategory: "Accessory",
        repairMetricCategory: "All Repairs",
        storeLocation,
    });

    if (metricsResult.err) {
        return;
    }

    const data = metricsResult.safeUnwrap().data;
    if (data === undefined) {
        return;
    }
    const [businessMetricsDocument] = data;

    const selectedDateFinancialMetrics = returnSelectedDateFinancialMetrics(
        {
            financialMetricsDocument:
                businessMetricsDocument as FinancialMetricsDocument,
            day: "01",
            month: "January",
            months: MONTHS,
            storeLocation,
            year: "2025",
        },
    );

    const {
        currentYear,
        previousYear,
    } = await createFinancialMetricsCalendarCharts(
        calendarView,
        selectedDateFinancialMetrics,
        "2025-01-01",
    );

    const financialMetricsCharts = await createFinancialMetricsCharts({
        financialMetricsDocument:
            businessMetricsDocument as FinancialMetricsDocument,
        months: MONTHS,
        selectedDateFinancialMetrics,
        storeLocation,
    });

    describe(
        `financialMetricsReducer 
           Store Location: ${storeLocation}
        `,
        () => {
            describe("financialMetricsReducer_setCalendarChartsData", () => {
                it("should allow valid data", () => {
                    const dispatch: FinancialMetricsDispatch = {
                        action: financialMetricsAction.setCalendarChartsData,
                        payload: {
                            currentYear,
                            previousYear,
                        },
                    };

                    const state = financialMetricsReducer_setCalendarChartsData(
                        initialFinancialMetricsState,
                        dispatch,
                    );

                    expect(state.calendarChartsData).to.not.equal(null);
                });
                it("should not allow invalid data", () => {
                    const initialCalendarChartsData =
                        initialFinancialMetricsState.calendarChartsData;
                    INVALID_STRINGS.forEach((value) => {
                        const dispatch: FinancialMetricsDispatch = {
                            action:
                                financialMetricsAction.setCalendarChartsData,
                            payload: {
                                currentYear: value as any,
                                previousYear: value as any,
                            },
                        };
                        const state =
                            financialMetricsReducer_setCalendarChartsData(
                                initialFinancialMetricsState,
                                dispatch as any,
                            );
                        expect(state.calendarChartsData).to.equal(
                            initialCalendarChartsData,
                        );
                    });
                });
            });

            describe("financialMetricsReducer_setCharts", () => {
                it("should allow valid data", () => {
                    const dispatch: FinancialMetricsDispatch = {
                        action: financialMetricsAction.setCharts,
                        payload: financialMetricsCharts,
                    };

                    const state = financialMetricsReducer_setCharts(
                        initialFinancialMetricsState,
                        dispatch,
                    );

                    expect(state.charts).to.not.equal(null);
                });
                it("should not allow invalid data", () => {
                    const initialCharts = initialFinancialMetricsState.charts;
                    INVALID_STRINGS.forEach((value) => {
                        const dispatch: FinancialMetricsDispatch = {
                            action: financialMetricsAction.setCharts,
                            payload: value as any,
                        };
                        const state = financialMetricsReducer_setCharts(
                            initialFinancialMetricsState,
                            dispatch as any,
                        );
                        expect(state.charts).to.equal(initialCharts);
                    });
                });
            });

            describe("financialMetricsReducer_setIsGenerating", () => {
                it("should allow valid data", () => {
                    VALID_BOOLEANS.forEach((value) => {
                        const dispatch: FinancialMetricsDispatch = {
                            action: financialMetricsAction.setIsGenerating,
                            payload: value,
                        };
                        const state = financialMetricsReducer_setIsGenerating(
                            initialFinancialMetricsState,
                            dispatch as any,
                        );
                        expect(state.isGenerating).to.equal(value);
                    });
                });
                it("should not allow invalid data", () => {
                    const initialIsGenerating =
                        initialFinancialMetricsState.isGenerating;
                    INVALID_BOOLEANS.forEach((value) => {
                        const dispatch: FinancialMetricsDispatch = {
                            action: financialMetricsAction.setIsGenerating,
                            payload: value as any,
                        };
                        const state = financialMetricsReducer_setIsGenerating(
                            initialFinancialMetricsState,
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

function generateFinancialMetricsPermutations() {
    const calendarViews: Array<DashboardCalendarView> = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);
    const storeLocationViews: Array<AllStoreLocations> = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocationViews = shuffle(storeLocationViews);

    return shuffledCalendarViews.reduce((acc, calendarView) => {
        shuffledStoreLocationViews.forEach((storeLocation) => {
            acc.validPermutations.push({
                calendarView,
                storeLocation,
            });
        });

        //
        //
        return acc;
    }, {
        validPermutations: [] as Array<
            FinancialMetricsTestCallbackInput
        >,
        invalidPermutations: [] as Array<
            FinancialMetricsTestCallbackInput
        >,
    });
}

const { validPermutations, invalidPermutations } =
    generateFinancialMetricsPermutations();
const TEST_SIZE = 1;
const slicedValids = validPermutations.slice(0, TEST_SIZE);
const slicedInvalids = invalidPermutations.slice(0, TEST_SIZE);

await Promise.all(
    slicedValids.map(
        async ({ calendarView, storeLocation }) => {
            await financialMetricsTestCallback({
                calendarView,
                storeLocation,
            });
        },
    ),
);

await Promise.all(
    slicedInvalids.map(
        async ({ calendarView, storeLocation }) => {
            await financialMetricsTestCallback({
                calendarView,
                storeLocation,
            });
        },
    ),
);
