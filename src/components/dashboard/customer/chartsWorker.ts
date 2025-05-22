import { Some } from "ts-results";
import { CustomerMetricsDocument, SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
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
import { messageEventCustomerMainToWorkerZod } from "./schemas";

type MessageEventCustomerWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: CustomerMetricsCalendarCharts;
            previousYear: CustomerMetricsCalendarCharts;
            customerMetricsCharts: CustomerMetricsCharts;
            customerMetricsCards: CustomerMetricsCards;
        }
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        customerMetricsDocument: CustomerMetricsDocument;
        greenColorShade: string;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventCustomerMainToWorker,
) => {
    console.log(
        "Customer Charts Worker received message",
    );

    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: Some(new Error("No data received")),
            message: Some("No data received"),
        }));
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventCustomerMainToWorkerZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.none) {
        self.postMessage(createSafeBoxResult({
            data: Some("Error parsing message"),
        }));
        return;
    }

    const {
        calendarView,
        cardBgGradient,
        greenColorShade,
        redColorShade,
        customerMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageResult.val.safeUnwrap();

    try {
        const selectedDateCustomerMetricsSafeResult =
            returnSelectedDateCustomerMetricsSafe({
                customerMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        if (
            selectedDateCustomerMetricsSafeResult.err ||
            selectedDateCustomerMetricsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: selectedDateCustomerMetricsSafeResult.val.data,
                message: Some(
                    "Error getting selected date customer metrics",
                ),
            }));
            return;
        }
        const selectedDateCustomerMetrics =
            selectedDateCustomerMetricsSafeResult.val.data.val;

        const createCustomerMetricsCalendarChartsSafeResult =
            createCustomerMetricsCalendarChartsSafe(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );
        if (
            createCustomerMetricsCalendarChartsSafeResult.err ||
            createCustomerMetricsCalendarChartsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: createCustomerMetricsCalendarChartsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createCustomerMetricsCalendarChartsSafeResult.val.data.val;

        const customerMetricsChartsSafeResult = createCustomerMetricsChartsSafe(
            {
                customerMetricsDocument,
                months: MONTHS,
                selectedDateCustomerMetrics,
            },
        );
        if (
            customerMetricsChartsSafeResult.err ||
            customerMetricsChartsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: customerMetricsChartsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics charts",
                ),
            }));
            return;
        }
        const customerMetricsCharts =
            customerMetricsChartsSafeResult.val.data.val;

        const customerMetricsCardsSafeResult = createCustomerMetricsCardsSafe({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateCustomerMetrics,
        });
        if (
            customerMetricsCardsSafeResult.err ||
            customerMetricsCardsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: customerMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics cards",
                ),
            }));
            return;
        }
        const customerMetricsCards =
            customerMetricsCardsSafeResult.val.data.val;

        self.postMessage(createSafeBoxResult({
            data: Some({
                currentYear,
                previousYear,
                customerMetricsCharts,
                customerMetricsCards,
            }),
            kind: "success",
        }));
    } catch (error) {
        console.error("Customer Charts Worker error:", error);
        self.postMessage(createSafeBoxResult({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Customer Charts Worker error:", event);
    self.postMessage(createSafeBoxResult({
        data: Some(event),
        message: Some(
            event instanceof Error
                ? event.message
                : typeof event === "string"
                ? event
                : "Unknown error",
        ),
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeBoxResult({
        data: Some(event.reason),
        message: Some(
            event.reason instanceof Error
                ? event.reason.message
                : typeof event.reason === "string"
                ? event.reason
                : "Unknown error",
        ),
    }));
});

export type {
    MessageEventCustomerMainToWorker,
    MessageEventCustomerWorkerToMain,
};
