import { Some } from "ts-results";
import { FinancialMetricsDocument, SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
import { MONTHS } from "../constants";
import { DashboardCalendarView, Month, Year } from "../types";
import {
    createFinancialMetricsCardsSafe,
    FinancialMetricsCards,
} from "./cards";
import {
    createFinancialMetricsCalendarChartsSafe,
    createFinancialMetricsChartsSafe,
    FinancialMetricsCalendarCharts,
    FinancialMetricsCharts,
    returnSelectedDateFinancialMetricsSafe,
} from "./chartsData";
import { messageEventFinancialMainToWorkerZod } from "./schemas";

type MessageEventFinancialWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: FinancialMetricsCalendarCharts;
            previousYear: FinancialMetricsCalendarCharts;
            financialMetricsCharts: FinancialMetricsCharts;
            financialMetricsCards: FinancialMetricsCards;
        }
    >
>;
type MessageEventFinancialMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        financialMetricsDocument: FinancialMetricsDocument;
        greenColorShade: string;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventFinancialMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: Some(new Error("No data received")),
            message: Some("No data received"),
        }));
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventFinancialMainToWorkerZod,
    });
    if (parsedMessageResult.err || parsedMessageResult.val.data.none) {
        self.postMessage(createSafeBoxResult({
            data: parsedMessageResult.val.data,
            message: Some("Error parsing message"),
        }));
        return;
    }

    const {
        calendarView,
        cardBgGradient,
        greenColorShade,
        redColorShade,
        financialMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageResult.val.data.val;

    try {
        const selectedDateFinancialMetricsSafeResult =
            returnSelectedDateFinancialMetricsSafe(
                {
                    financialMetricsDocument,
                    day: selectedDate,
                    month: selectedMonth,
                    months: MONTHS,
                    year: selectedYear,
                },
            );
        if (
            selectedDateFinancialMetricsSafeResult.err ||
            selectedDateFinancialMetricsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: selectedDateFinancialMetricsSafeResult.val.data,
                message: Some(
                    "Error creating selected date financial metrics",
                ),
            }));
            return;
        }
        const selectedDateFinancialMetrics =
            selectedDateFinancialMetricsSafeResult.val.data.val;

        const createFinancialMetricsCalendarChartsSafeResult =
            createFinancialMetricsCalendarChartsSafe(
                calendarView,
                selectedDateFinancialMetrics,
                selectedYYYYMMDD,
            );
        if (
            createFinancialMetricsCalendarChartsSafeResult.err ||
            createFinancialMetricsCalendarChartsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: createFinancialMetricsCalendarChartsSafeResult.val.data,
                message: Some(
                    "Error creating financial metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createFinancialMetricsCalendarChartsSafeResult.val.data.val;

        const financialMetricsChartsSafeResult =
            createFinancialMetricsChartsSafe({
                financialMetricsDocument,
                months: MONTHS,
                selectedDateFinancialMetrics,
            });
        if (
            financialMetricsChartsSafeResult.err ||
            financialMetricsChartsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: financialMetricsChartsSafeResult.val.data,
                message: Some(
                    "Error creating financial metrics charts",
                ),
            }));
            return;
        }
        const financialMetricsCharts =
            financialMetricsChartsSafeResult.val.data.val;

        const financialMetricsCardsSafeResult = createFinancialMetricsCardsSafe(
            {
                cardBgGradient,
                greenColorShade,
                redColorShade,
                selectedDateFinancialMetrics,
            },
        );
        if (
            financialMetricsCardsSafeResult.err ||
            financialMetricsCardsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: financialMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating financial metrics cards",
                ),
            }));
            return;
        }
        const financialMetricsCards =
            financialMetricsCardsSafeResult.val.data.val;

        self.postMessage(createSafeBoxResult({
            data: Some({
                currentYear,
                previousYear,
                financialMetricsCharts,
                financialMetricsCards,
            }),
            kind: "success",
        }));
    } catch (error) {
        console.error("Financial Charts Worker error:", error);
        self.postMessage(createSafeBoxResult({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Financial Charts Worker error:", event);
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
    MessageEventFinancialMainToWorker,
    MessageEventFinancialWorkerToMain,
};
