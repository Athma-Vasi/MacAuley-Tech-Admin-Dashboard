import { CustomerMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
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
            currentYear: CustomerMetricsCalendarCharts;
            previousYear: CustomerMetricsCalendarCharts;
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
        customerMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageResult.val.val;

    try {
        const selectedDateCustomerMetricsSafeResult =
            returnSelectedDateCustomerMetricsSafe({
                customerMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        if (selectedDateCustomerMetricsSafeResult.err) {
            self.postMessage(selectedDateCustomerMetricsSafeResult);
            return;
        }
        if (selectedDateCustomerMetricsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No customer metrics found for the selected date",
                ),
            );
            return;
        }
        const selectedDateCustomerMetrics =
            selectedDateCustomerMetricsSafeResult
                .val.val;

        const createCustomerMetricsCalendarChartsSafeResult =
            createCustomerMetricsCalendarChartsSafe(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );
        if (createCustomerMetricsCalendarChartsSafeResult.err) {
            self.postMessage(
                createCustomerMetricsCalendarChartsSafeResult,
            );
            return;
        }
        if (createCustomerMetricsCalendarChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No customer metrics calendar charts found",
                ),
            );
            return;
        }
        const { currentYear, previousYear } =
            createCustomerMetricsCalendarChartsSafeResult.val.val;

        const customerMetricsChartsSafeResult = createCustomerMetricsChartsSafe(
            {
                customerMetricsDocument,
                months: MONTHS,
                selectedDateCustomerMetrics,
            },
        );
        if (customerMetricsChartsSafeResult.err) {
            self.postMessage(customerMetricsChartsSafeResult);
            return;
        }
        if (customerMetricsChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No customer metrics charts found",
                ),
            );
            return;
        }
        const customerMetricsCharts = customerMetricsChartsSafeResult.val
            .val;

        const customerMetricsCardsSafeResult = createCustomerMetricsCardsSafe(
            {
                grayBorderShade,
                greenColorShade,
                redColorShade,
                selectedDateCustomerMetrics,
            },
        );
        if (customerMetricsCardsSafeResult.err) {
            self.postMessage(
                customerMetricsCardsSafeResult,
            );
            return;
        }
        if (customerMetricsCardsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No customer metrics cards found",
                ),
            );
            return;
        }
        const customerMetricsCards = customerMetricsCardsSafeResult.val
            .val;

        self.postMessage(
            createSafeSuccessResult({
                currentYear,
                previousYear,
                customerMetricsCharts,
                customerMetricsCards,
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
