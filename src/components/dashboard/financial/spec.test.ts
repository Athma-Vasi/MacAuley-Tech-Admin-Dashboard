import { describe, expect, it } from "vitest";
import {
    ALL_STORE_LOCATIONS_DATA,
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { FinancialMetricsDocument } from "../../../types";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations } from "../types";
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

async function financialMetricsTestCallback(
    { storeLocation }: {
        storeLocation: AllStoreLocations;
    },
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
        selectedDateFinancialMetrics,
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

await Promise.all(
    ALL_STORE_LOCATIONS_DATA.map(
        async ({ value }) =>
            await financialMetricsTestCallback({
                storeLocation: value,
            }),
    ),
);
