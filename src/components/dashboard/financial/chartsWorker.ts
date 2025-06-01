import { FinancialMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
} from "../../../utils";
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
import { messageEventFinancialChartsMainToWorkerZod } from "./schemas";

type MessageEventFinancialChartsWorkerToMain = MessageEvent<
    SafeResult<
        {
            calendarChartsData: {
                currentYear: FinancialMetricsCalendarCharts;
                previousYear: FinancialMetricsCalendarCharts;
            };
            financialMetricsCharts: FinancialMetricsCharts;
            financialMetricsCards: FinancialMetricsCards;
        }
    >
>;
type MessageEventFinancialChartsMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        grayBorderShade: string;
        greenColorShade: string;
        financialMetricsDocument: FinancialMetricsDocument;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventFinancialChartsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventFinancialChartsMainToWorkerZod,
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
        financialMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageOption.val;

    try {
        const selectedDateFinancialMetricsSafeResult =
            returnSelectedDateFinancialMetricsSafe({
                financialMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        const selectedDateFinancialMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                selectedDateFinancialMetricsSafeResult,
                "No financial metrics found for the selected date",
            );
        if (selectedDateFinancialMetricsOption.none) {
            return;
        }

        const financialMetricsCalendarChartsSafeResult =
            createFinancialMetricsCalendarChartsSafe(
                calendarView,
                selectedDateFinancialMetricsOption.val,
                selectedYYYYMMDD,
            );
        const financialMetricsCalendarChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                financialMetricsCalendarChartsSafeResult,
                "No financial metrics calendar charts found",
            );
        if (financialMetricsCalendarChartsOption.none) {
            return;
        }

        const financialMetricsChartsSafeResult =
            createFinancialMetricsChartsSafe({
                financialMetricsDocument,
                months: MONTHS,
                selectedDateFinancialMetrics:
                    selectedDateFinancialMetricsOption.val,
            });
        const financialMetricsChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                financialMetricsChartsSafeResult,
                "No financial metrics charts found",
            );
        if (financialMetricsChartsOption.none) {
            return;
        }

        const financialMetricsCardsSafeResult = createFinancialMetricsCardsSafe(
            {
                grayBorderShade,
                greenColorShade,
                redColorShade,
                selectedDateFinancialMetrics:
                    selectedDateFinancialMetricsOption.val,
            },
        );
        const financialMetricsCardsOption =
            handleErrorResultAndNoneOptionInWorker(
                financialMetricsCardsSafeResult,
                "No financial metrics cards found",
            );
        if (financialMetricsCardsOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                calendarChartsData: financialMetricsCalendarChartsOption.val,
                financialMetricsCharts: financialMetricsChartsOption.val,
                financialMetricsCards: financialMetricsCardsOption.val,
            }),
        );
    } catch (error) {
        console.error("Financial Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Financial Charts Worker error:", event);
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
    MessageEventFinancialChartsMainToWorker,
    MessageEventFinancialChartsWorkerToMain,
};
