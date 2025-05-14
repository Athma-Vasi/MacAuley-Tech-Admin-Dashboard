import { shuffle } from "simple-statistics";
import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { ProductMetricsDocument, SafeBoxResult } from "../../../types";
import { createSafeBoxResult } from "../../../utils";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { productMetricsAction } from "./actions";
import {
    createProductMetricsCalendarCharts,
    createProductMetricsCharts,
    returnSelectedDateProductMetrics,
} from "./chartsData";
import {
    productMetricsReducer_setCalendarChartsData,
    productMetricsReducer_setCharts,
    productMetricsReducer_setIsGenerating,
} from "./reducers";
import { initialProductMetricsState } from "./state";
import { ProductMetricCategory, ProductMetricsDispatch } from "./types";

type ProductMetricsTestCallbackInput = {
    calendarView: DashboardCalendarView;
    productMetricCategory: ProductMetricCategory;
    storeLocation: AllStoreLocations;
};

async function productMetricsTestCallback(
    { calendarView, productMetricCategory, storeLocation }:
        ProductMetricsTestCallbackInput,
): Promise<SafeBoxResult> {
    try {
        const metricsResult = await handleMetricsMock({
            metricsView: "products",
            productMetricCategory,
            repairMetricCategory: "All Repairs",
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

        const selectedDateProductMetrics = returnSelectedDateProductMetrics({
            productMetricsDocument:
                businesMetricsDocument as ProductMetricsDocument,
            day: "01",
            month: "January",
            months: MONTHS,
            year: "2025",
        });

        const { currentYear, previousYear } =
            await createProductMetricsCalendarCharts(
                calendarView,
                selectedDateProductMetrics,
                "2025-01-01",
            );

        const productMetricsCharts = await createProductMetricsCharts({
            productMetricsDocument:
                businesMetricsDocument as ProductMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics,
        });

        describe(
            `productMetricsReducer 
           Store Location: ${storeLocation}
           Product Metric: ${productMetricCategory}
        `,
            () => {
                describe("productMetricsReducer_setCalendarChartsData", () => {
                    it("should allow valid data", () => {
                        const dispatch: ProductMetricsDispatch = {
                            action: productMetricsAction.setCalendarChartsData,
                            payload: {
                                currentYear,
                                previousYear,
                            },
                        };

                        const state =
                            productMetricsReducer_setCalendarChartsData(
                                initialProductMetricsState,
                                dispatch,
                            );

                        expect(state.calendarChartsData).to.not.equal(null);
                    });
                    it("should not allow invalid data", () => {
                        const initialCalendarChartsData =
                            initialProductMetricsState.calendarChartsData;
                        INVALID_STRINGS.forEach((value) => {
                            const dispatch: ProductMetricsDispatch = {
                                action:
                                    productMetricsAction.setCalendarChartsData,
                                payload: {
                                    currentYear: value as any,
                                    previousYear: value as any,
                                },
                            };
                            const state =
                                productMetricsReducer_setCalendarChartsData(
                                    initialProductMetricsState,
                                    dispatch as any,
                                );
                            expect(state.calendarChartsData).to.equal(
                                initialCalendarChartsData,
                            );
                        });
                    });
                });

                describe("productMetricsReducer_setCharts", () => {
                    it("should allow valid data", () => {
                        const dispatch: ProductMetricsDispatch = {
                            action: productMetricsAction.setCharts,
                            payload: productMetricsCharts,
                        };

                        const state = productMetricsReducer_setCharts(
                            initialProductMetricsState,
                            dispatch,
                        );

                        expect(state.charts).to.not.equal(null);
                    });
                    it("should not allow invalid data", () => {
                        const initialCharts = initialProductMetricsState.charts;
                        INVALID_STRINGS.forEach((value) => {
                            const dispatch: ProductMetricsDispatch = {
                                action: productMetricsAction.setCharts,
                                payload: value as any,
                            };
                            const state = productMetricsReducer_setCharts(
                                initialProductMetricsState,
                                dispatch as any,
                            );
                            expect(state.charts).to.equal(initialCharts);
                        });
                    });
                });

                describe("productMetricsReducer_setIsGenerating", () => {
                    it("should allow valid data", () => {
                        VALID_BOOLEANS.forEach((value) => {
                            const dispatch: ProductMetricsDispatch = {
                                action: productMetricsAction.setIsGenerating,
                                payload: value,
                            };
                            const state = productMetricsReducer_setIsGenerating(
                                initialProductMetricsState,
                                dispatch as any,
                            );
                            expect(state.isGenerating).to.equal(value);
                        });
                    });
                    it("should not allow invalid data", () => {
                        const initialIsGenerating =
                            initialProductMetricsState.isGenerating;
                        INVALID_BOOLEANS.forEach((value) => {
                            const dispatch: ProductMetricsDispatch = {
                                action: productMetricsAction.setIsGenerating,
                                payload: value as any,
                            };
                            const state = productMetricsReducer_setIsGenerating(
                                initialProductMetricsState,
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

        return createSafeBoxResult({
            kind: "success",
        });
    } catch (error) {
        return createSafeBoxResult({ data: error, kind: "error" });
    }
}

function generateProductMetricsPermutations() {
    const calendarViews: Array<DashboardCalendarView> = [
        "Daily",
        "Monthly",
        "Yearly",
    ];
    const shuffledCalendarViews = shuffle(calendarViews);
    const productMetricCategories: Array<ProductMetricCategory> = [
        "Accessory",
        "All Products",
        "Central Processing Unit (CPU)",
        "Computer Case",
        "Desktop Computer",
        "Display",
        "Graphics Processing Unit (GPU)",
        "Headphone",
        "Keyboard",
        "Memory (RAM)",
        "Microphone",
        "Motherboard",
        "Mouse",
        "Power Supply Unit (PSU)",
        "Speaker",
        "Storage",
        "Webcam",
    ];
    const shuffledProductMetricCategories = shuffle(productMetricCategories);
    const storeLocationViews: Array<AllStoreLocations> = [
        "All Locations",
        "Calgary",
        "Edmonton",
        "Vancouver",
    ];
    const shuffledStoreLocationViews = shuffle(storeLocationViews);

    return shuffledCalendarViews.reduce((acc, calendarView) => {
        shuffledProductMetricCategories.forEach((productMetricCategory) => {
            shuffledStoreLocationViews.forEach((storeLocation) => {
                acc.validPermutations.push({
                    calendarView,
                    productMetricCategory,
                    storeLocation,
                });
            });
        });
        //
        //
        return acc;
    }, {
        validPermutations: [] as Array<
            ProductMetricsTestCallbackInput
        >,
        invalidPermutations: [] as Array<
            ProductMetricsTestCallbackInput
        >,
    });
}

const { validPermutations, invalidPermutations } =
    generateProductMetricsPermutations();
const TEST_SIZE = 1;
const slicedValids = validPermutations.slice(0, TEST_SIZE);
const slicedInvalids = invalidPermutations.slice(0, TEST_SIZE);

await Promise.all(
    slicedValids.map(
        async ({ calendarView, productMetricCategory, storeLocation }) => {
            await productMetricsTestCallback({
                calendarView,
                productMetricCategory,
                storeLocation,
            });
        },
    ),
);

await Promise.all(
    slicedInvalids.map(
        async ({ calendarView, productMetricCategory, storeLocation }) => {
            await productMetricsTestCallback({
                calendarView,
                productMetricCategory,
                storeLocation,
            });
        },
    ),
);
