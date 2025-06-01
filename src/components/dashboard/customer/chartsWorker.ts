import { CustomerMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
} from "../../../utils";
import { MONTHS } from "../constants";
import { DashboardCalendarView, Month, Year } from "../types";
import { createCustomerMetricsCardsSafe, CustomerMetricsCards } from "./cards";
import {
    createCustomerMetricsCalendarChartsSafe,
    createCustomerMetricsChartsSafe,
    CustomerMetricsCalendarCharts,
    CustomerMetricsCharts,
    returnSelectedDateCustomerMetricsSafe,
} from "./chartsData";
import { messageEventCustomerChartsMainToWorkerZod } from "./schemas";

type MessageEventCustomerChartsWorkerToMain = MessageEvent<
    SafeResult<
        {
            calendarChartsData: {
                currentYear: CustomerMetricsCalendarCharts;
                previousYear: CustomerMetricsCalendarCharts;
            };
            customerMetricsCharts: CustomerMetricsCharts;
            customerMetricsCards: CustomerMetricsCards;
        }
    >
>;
type MessageEventCustomerChartsMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        grayBorderShade: string;
        greenColorShade: string;
        customerMetricsDocument: CustomerMetricsDocument;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventCustomerChartsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventCustomerChartsMainToWorkerZod,
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
        customerMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageOption.val;

    try {
        const selectedDateCustomerMetricsSafeResult =
            returnSelectedDateCustomerMetricsSafe({
                customerMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        const selectedDateCustomerMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                selectedDateCustomerMetricsSafeResult,
                "No customer metrics found for the selected date",
            );
        if (selectedDateCustomerMetricsOption.none) {
            return;
        }

        const customerMetricsCalendarChartsSafeResult =
            createCustomerMetricsCalendarChartsSafe(
                calendarView,
                selectedDateCustomerMetricsOption.val,
                selectedYYYYMMDD,
            );
        const customerMetricsCalendarChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                customerMetricsCalendarChartsSafeResult,
                "No customer metrics calendar charts found",
            );
        if (customerMetricsCalendarChartsOption.none) {
            return;
        }

        const customerMetricsChartsSafeResult = createCustomerMetricsChartsSafe(
            {
                customerMetricsDocument,
                months: MONTHS,
                selectedDateCustomerMetrics:
                    selectedDateCustomerMetricsOption.val,
            },
        );
        const customerMetricsChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                customerMetricsChartsSafeResult,
                "No customer metrics charts found",
            );
        if (customerMetricsChartsOption.none) {
            return;
        }

        const customerMetricsCardsSafeResult = createCustomerMetricsCardsSafe(
            {
                grayBorderShade,
                greenColorShade,
                redColorShade,
                selectedDateCustomerMetrics:
                    selectedDateCustomerMetricsOption.val,
            },
        );
        const customerMetricsCardsOption =
            handleErrorResultAndNoneOptionInWorker(
                customerMetricsCardsSafeResult,
                "No customer metrics cards found",
            );
        if (customerMetricsCardsOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                calendarChartsData: customerMetricsCalendarChartsOption.val,
                customerMetricsCharts: customerMetricsChartsOption.val,
                customerMetricsCards: customerMetricsCardsOption.val,
            }),
        );
    } catch (error) {
        console.error("Customer Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Customer Charts Worker error:", event);
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
    MessageEventCustomerChartsMainToWorker,
    MessageEventCustomerChartsWorkerToMain,
};
