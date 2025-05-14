import { shuffle } from "simple-statistics";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { CustomerMetricsDocument } from "../../../types";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { customerMetricsAction } from "./actions";
import {
    createCustomerMetricsCalendarCharts,
    createCustomerMetricsCharts,
    returnSelectedDateCustomerMetrics,
} from "./chartsData";
import {
    customerMetricsReducer_setCalendarChartsData,
    customerMetricsReducer_setCharts,
    customerMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialCustomerMetricsState } from "./state";
import { CustomerMetricsDispatch } from "./types";

type CustomerMetricsTestCallbackInput = {
    calendarView: DashboardCalendarView;
    storeLocation: AllStoreLocations;
};

async function customerMetricsTestCallback(
    { calendarView, storeLocation }: CustomerMetricsTestCallbackInput,
) {
    const metricsResult = await handleMetricsMock({
        metricsView: "customers",
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

    const selectedDateCustomerMetrics = returnSelectedDateCustomerMetrics({
        customerMetricsDocument:
            businessMetricsDocument as CustomerMetricsDocument,
        day: "01",
        month: "January",
        months: MONTHS,
        year: "2025",
    });

    const { currentYear, previousYear } =
        await createCustomerMetricsCalendarCharts(
            calendarView,
            selectedDateCustomerMetrics,
            "2025-01-01",
        );

    const customerMetricsCharts = await createCustomerMetricsCharts({
        customerMetricsDocument:
            businessMetricsDocument as CustomerMetricsDocument,
        months: MONTHS,
        selectedDateCustomerMetrics,
    });

    describe(
        `customerMetricsReducer 
           Store Location: ${storeLocation}
        `,
        () => {
            describe("customerMetricsReducer_setCalendarChartsData", () => {
                it("should allow valid data", () => {
                    const dispatch: CustomerMetricsDispatch = {
                        action: customerMetricsAction.setCalendarChartsData,
                        payload: {
                            currentYear,
                            previousYear,
                        },
                    };

                    const state = customerMetricsReducer_setCalendarChartsData(
                        initialCustomerMetricsState,
                        dispatch,
                    );

                    expect(state.calendarChartsData).to.not.equal(null);
                });
                it("should not allow invalid data", () => {
                    const initialCalendarChartsData =
                        initialCustomerMetricsState.calendarChartsData;
                    INVALID_STRINGS.forEach((value) => {
                        const dispatch: CustomerMetricsDispatch = {
                            action: customerMetricsAction.setCalendarChartsData,
                            payload: {
                                currentYear: value as any,
                                previousYear: value as any,
                            },
                        };
                        const state =
                            customerMetricsReducer_setCalendarChartsData(
                                initialCustomerMetricsState,
                                dispatch as any,
                            );
                        expect(state.calendarChartsData).to.equal(
                            initialCalendarChartsData,
                        );
                    });
                });
            });

            describe("customerMetricsReducer_setCharts", () => {
                it("should allow valid data", () => {
                    const dispatch: CustomerMetricsDispatch = {
                        action: customerMetricsAction.setCharts,
                        payload: customerMetricsCharts,
                    };

                    const state = customerMetricsReducer_setCharts(
                        initialCustomerMetricsState,
                        dispatch,
                    );

                    expect(state.charts).to.not.equal(null);
                });
                it("should not allow invalid data", () => {
                    const initialCharts = initialCustomerMetricsState.charts;
                    INVALID_STRINGS.forEach((value) => {
                        const dispatch: CustomerMetricsDispatch = {
                            action: customerMetricsAction.setCharts,
                            payload: value as any,
                        };
                        const state = customerMetricsReducer_setCharts(
                            initialCustomerMetricsState,
                            dispatch as any,
                        );
                        expect(state.charts).to.equal(initialCharts);
                    });
                });
            });

            describe("customerMetricsReducer_setIsGenerating", () => {
                it("should allow valid data", () => {
                    VALID_BOOLEANS.forEach((value) => {
                        const dispatch: CustomerMetricsDispatch = {
                            action: customerMetricsAction.setIsGenerating,
                            payload: value,
                        };
                        const state = customerMetricsReducer_setIsGenerating(
                            initialCustomerMetricsState,
                            dispatch as any,
                        );
                        expect(state.isGenerating).to.equal(value);
                    });
                });
                it("should not allow invalid data", () => {
                    const initialIsGenerating =
                        initialCustomerMetricsState.isGenerating;
                    INVALID_BOOLEANS.forEach((value) => {
                        const dispatch: CustomerMetricsDispatch = {
                            action: customerMetricsAction.setIsGenerating,
                            payload: value as any,
                        };
                        const state = customerMetricsReducer_setIsGenerating(
                            initialCustomerMetricsState,
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

function generateCustomerMetricsPermutations() {
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
            CustomerMetricsTestCallbackInput
        >,
        invalidPermutations: [] as Array<
            CustomerMetricsTestCallbackInput
        >,
    });
}

const { validPermutations, invalidPermutations } =
    generateCustomerMetricsPermutations();
const TEST_SIZE = 1;
const slicedValids = validPermutations.slice(0, TEST_SIZE);
const slicedInvalids = invalidPermutations.slice(0, TEST_SIZE);

await Promise.all(
    slicedValids.map(
        async ({ calendarView, storeLocation }) => {
            await customerMetricsTestCallback({
                calendarView,
                storeLocation,
            });
        },
    ),
);

await Promise.all(
    slicedInvalids.map(
        async ({ calendarView, storeLocation }) => {
            await customerMetricsTestCallback({
                calendarView,
                storeLocation,
            });
        },
    ),
);
