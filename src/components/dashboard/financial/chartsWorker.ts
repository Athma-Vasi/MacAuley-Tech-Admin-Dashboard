import { FinancialMetricsDocument, ResultSafeBox } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
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
import { messageEventFinancialMainToWorkerZod } from "./schemas";

type MessageEventFinancialWorkerToMain = MessageEvent<
    ResultSafeBox<
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
    event: MessageEventFinancialMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventFinancialMainToWorkerZod,
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
        cardBgGradient,
        greenColorShade,
        redColorShade,
        financialMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageResult.val.safeUnwrap();

    try {
        const selectedDateFinancialMetricsSafeResult =
            returnSelectedDateFinancialMetricsSafe({
                financialMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        if (selectedDateFinancialMetricsSafeResult.err) {
            self.postMessage(selectedDateFinancialMetricsSafeResult);
            return;
        }
        if (selectedDateFinancialMetricsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No financial metrics found for the selected date",
                ),
            );
            return;
        }
        const selectedDateFinancialMetrics =
            selectedDateFinancialMetricsSafeResult
                .val.safeUnwrap();

        const createFinancialMetricsCalendarChartsSafeResult =
            createFinancialMetricsCalendarChartsSafe(
                calendarView,
                selectedDateFinancialMetrics,
                selectedYYYYMMDD,
            );
        if (createFinancialMetricsCalendarChartsSafeResult.err) {
            self.postMessage(
                createFinancialMetricsCalendarChartsSafeResult,
            );
            return;
        }
        if (createFinancialMetricsCalendarChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No financial metrics calendar charts found",
                ),
            );
            return;
        }
        const { currentYear, previousYear } =
            createFinancialMetricsCalendarChartsSafeResult.val.safeUnwrap();

        const financialMetricsChartsSafeResult =
            createFinancialMetricsChartsSafe({
                financialMetricsDocument,
                months: MONTHS,
                selectedDateFinancialMetrics,
            });
        if (financialMetricsChartsSafeResult.err) {
            self.postMessage(financialMetricsChartsSafeResult);
            return;
        }
        if (financialMetricsChartsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No financial metrics charts found",
                ),
            );
            return;
        }
        const financialMetricsCharts = financialMetricsChartsSafeResult.val
            .safeUnwrap();

        const financialMetricsCardsSafeResult = createFinancialMetricsCardsSafe(
            {
                cardBgGradient,
                greenColorShade,
                redColorShade,
                selectedDateFinancialMetrics,
            },
        );
        if (financialMetricsCardsSafeResult.err) {
            self.postMessage(
                financialMetricsCardsSafeResult,
            );
            return;
        }
        if (financialMetricsCardsSafeResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No financial metrics cards found",
                ),
            );
            return;
        }
        const financialMetricsCards = financialMetricsCardsSafeResult.val
            .safeUnwrap();

        self.postMessage(
            createSafeSuccessResult({
                currentYear,
                previousYear,
                financialMetricsCharts,
                financialMetricsCards,
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
    MessageEventFinancialMainToWorker,
    MessageEventFinancialWorkerToMain,
};
