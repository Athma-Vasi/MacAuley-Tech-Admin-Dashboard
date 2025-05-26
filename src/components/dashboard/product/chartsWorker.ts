import { ProductMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
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
import { messageEventProductMainToWorkerZod } from "./schemas";

type MessageEventProductWorkerToMain = MessageEvent<
    SafeResult<
        {
            currentYear: ProductMetricsCalendarCharts;
            previousYear: ProductMetricsCalendarCharts;
            productMetricsCharts: ProductMetricsCharts;
            productMetricsCards: ProductMetricsCards;
        }
    >
>;
type MessageEventProductMainToWorker = MessageEvent<
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
    event: MessageEventProductMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventProductMainToWorkerZod,
    });
    if (parsedMessageResult.err) {
        self.postMessage(parsedMessageResult);
        return;
    }
    if (parsedMessageResult.val.none) {
        self.postMessage(
            createSafeErrorResult("Error parsing input"),
        );
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
    } = parsedMessageResult.val.val;

    try {
        const selectedDateProductMetricsSafeResult =
            returnSelectedDateProductMetricsSafe({
                productMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        if (selectedDateProductMetricsSafeResult.err) {
            self.postMessage(selectedDateProductMetricsSafeResult);
            return;
        }
        if (selectedDateProductMetricsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No product metrics found for the selected date",
                ),
            );
            return;
        }
        const selectedDateProductMetrics = selectedDateProductMetricsSafeResult
            .val.val;

        const createProductMetricsCalendarChartsSafeResult =
            createProductMetricsCalendarChartsSafe(
                calendarView,
                selectedDateProductMetrics,
                selectedYYYYMMDD,
            );
        if (createProductMetricsCalendarChartsSafeResult.err) {
            self.postMessage(
                createProductMetricsCalendarChartsSafeResult,
            );
            return;
        }
        if (createProductMetricsCalendarChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No product metrics calendar charts found",
                ),
            );
            return;
        }
        const { currentYear, previousYear } =
            createProductMetricsCalendarChartsSafeResult.val.val;

        const productMetricsChartsSafeResult = createProductMetricsChartsSafe({
            productMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics,
        });
        if (productMetricsChartsSafeResult.err) {
            self.postMessage(productMetricsChartsSafeResult);
            return;
        }
        if (productMetricsChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No product metrics charts found",
                ),
            );
            return;
        }
        const productMetricsCharts = productMetricsChartsSafeResult.val
            .val;

        const productMetricsCardsSafeResult = createProductMetricsCardsSafe({
            grayBorderShade,
            greenColorShade,
            redColorShade,
            selectedDateProductMetrics,
        });
        if (productMetricsCardsSafeResult.err) {
            self.postMessage(
                productMetricsCardsSafeResult,
            );
            return;
        }
        if (productMetricsCardsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No product metrics cards found",
                ),
            );
            return;
        }
        const productMetricsCards = productMetricsCardsSafeResult.val
            .val;

        self.postMessage(
            createSafeSuccessResult({
                currentYear,
                previousYear,
                productMetricsCharts,
                productMetricsCards,
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
    MessageEventProductMainToWorker,
    MessageEventProductWorkerToMain,
};
