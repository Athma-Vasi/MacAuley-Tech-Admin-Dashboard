import { ProductMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
} from "../../../utils";
import { MONTHS } from "../constants";
import { DashboardCalendarView, Month, Year } from "../types";
import { createProductMetricsCardsSafe, ProductMetricsCards } from "./cards";
import {
    createProductMetricsCalendarChartsSafe,
    createProductMetricsChartsSafe,
    ProductMetricsCalendarCharts,
    ProductMetricsCharts,
    returnSelectedDateProductMetricsSafe,
} from "./chartsData";
import { messageEventProductChartsMainToWorkerZod } from "./schemas";

type MessageEventProductChartsWorkerToMain = MessageEvent<
    SafeResult<
        {
            currentYear: ProductMetricsCalendarCharts;
            previousYear: ProductMetricsCalendarCharts;
            productMetricsCharts: ProductMetricsCharts;
            productMetricsCards: ProductMetricsCards;
        }
    >
>;
type MessageEventProductChartsMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        grayBorderShade: string;
        greenColorShade: string;
        productMetricsDocument: ProductMetricsDocument;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventProductChartsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventProductChartsMainToWorkerZod,
    });
    const parsedMessageOption = handleErrorResultAndNoneOptionInWorker(
        parsedMessageResult,
        "Error parsing message",
    );
    if (parsedMessageOption.none) {
        return;
    }

    const {
        calendarView,
        grayBorderShade,
        greenColorShade,
        redColorShade,
        productMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageOption.val;

    try {
        const selectedDateProductMetricsSafeResult =
            returnSelectedDateProductMetricsSafe({
                productMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        const selectedDateProductMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                selectedDateProductMetricsSafeResult,
                "No product metrics found for the selected date",
            );
        if (selectedDateProductMetricsOption.none) {
            return;
        }

        const createProductMetricsCalendarChartsSafeResult =
            createProductMetricsCalendarChartsSafe(
                calendarView,
                selectedDateProductMetricsOption.val,
                selectedYYYYMMDD,
            );
        const createProductMetricsCalendarChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                createProductMetricsCalendarChartsSafeResult,
                "No product metrics calendar charts found",
            );
        if (createProductMetricsCalendarChartsOption.none) {
            return;
        }

        const productMetricsChartsSafeResult = createProductMetricsChartsSafe({
            productMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics: selectedDateProductMetricsOption.val,
        });
        const productMetricsChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                productMetricsChartsSafeResult,
                "No product metrics charts found",
            );
        if (productMetricsChartsOption.none) {
            return;
        }

        const productMetricsCardsSafeResult = createProductMetricsCardsSafe({
            grayBorderShade,
            greenColorShade,
            redColorShade,
            selectedDateProductMetrics: selectedDateProductMetricsOption.val,
        });
        const productMetricsCardsOption =
            handleErrorResultAndNoneOptionInWorker(
                productMetricsCardsSafeResult,
                "No product metrics cards found",
            );
        if (productMetricsCardsOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                currentYear:
                    createProductMetricsCalendarChartsOption.val.currentYear,
                previousYear:
                    createProductMetricsCalendarChartsOption.val.previousYear,
                productMetricsCharts: productMetricsChartsOption.val,
                productMetricsCards: productMetricsCardsOption.val,
            }),
        );
    } catch (error) {
        console.error("Product Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Product Charts Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event),
    );
});

export type {
    MessageEventProductChartsMainToWorker,
    MessageEventProductChartsWorkerToMain,
};
