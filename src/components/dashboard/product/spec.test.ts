import { describe, expect, it } from "vitest";
import {
    INVALID_BOOLEANS,
    INVALID_STRINGS,
    VALID_BOOLEANS,
} from "../../../constants";
import { ProductMetricsDocument } from "../../../types";
import { handleMetricsMock } from "../../testing/utils";
import { MONTHS } from "../constants";
import { AllStoreLocations } from "../types";
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
import { PRODUCT_METRICS_TEST_INPUT } from "./testData";
import { ProductMetricCategory, ProductMetricsDispatch } from "./types";

async function productMetricsTestCallback(
    { productMetricCategory, storeLocation }: {
        storeLocation: AllStoreLocations;
        productMetricCategory: ProductMetricCategory;
    },
) {
    const metricsResult = await handleMetricsMock({
        metricsView: "products",
        productMetricCategory,
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
        await createProductMetricsCalendarCharts(selectedDateProductMetrics);

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

                    const state = productMetricsReducer_setCalendarChartsData(
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
                            action: productMetricsAction.setCalendarChartsData,
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
}

await Promise.all(
    PRODUCT_METRICS_TEST_INPUT.map(
        async ({ productMetricCategory, storeLocation }) =>
            await productMetricsTestCallback({
                productMetricCategory,
                storeLocation,
            }),
    ),
);
