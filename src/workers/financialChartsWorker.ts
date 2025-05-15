import { MONTHS } from "../components/dashboard/constants";
import {
    createFinancialMetricsCards,
    FinancialMetricsCards,
} from "../components/dashboard/financial/cards";
import {
    createFinancialMetricsCalendarCharts,
    createFinancialMetricsCharts,
    FinancialMetricsCalendarCharts,
    FinancialMetricsCharts,
    SelectedDateFinancialMetrics,
} from "../components/dashboard/financial/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { FinancialMetricsDocument, SafeBoxResult } from "../types";
import { createSafeBoxResult } from "../utils";

type MessageEventFinancialWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: FinancialMetricsCalendarCharts;
            previousYear: FinancialMetricsCalendarCharts;
            financialMetricsCards: FinancialMetricsCards;
            financialMetricsCharts: FinancialMetricsCharts;
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
        selectedDateFinancialMetrics: SelectedDateFinancialMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventFinancialMainToWorker,
) => {
    console.log(
        "Financial Charts Worker received message in self",
    );

    if (!event.data) {
        self.postMessage(createSafeBoxResult({
            data: new Error("No data received"),
            kind: "error",
        }));
        return;
    }

    const {
        calendarView,
        cardBgGradient,
        financialMetricsDocument,
        greenColorShade,
        redColorShade,
        selectedDateFinancialMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            createFinancialMetricsCalendarCharts(
                calendarView,
                selectedDateFinancialMetrics,
                selectedYYYYMMDD,
            );

        const financialMetricsCharts = createFinancialMetricsCharts({
            financialMetricsDocument,
            months: MONTHS,
            selectedDateFinancialMetrics,
        });

        const financialMetricsCards = createFinancialMetricsCards({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateFinancialMetrics,
        });

        self.postMessage(createSafeBoxResult({
            data: {
                currentYear,
                previousYear,
                financialMetricsCards,
                financialMetricsCharts,
            },
            kind: "success",
        }));
    } catch (error) {
        console.error("Worker error:", error);
        self.postMessage(createSafeBoxResult({
            data: error,
            kind: "error",
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Worker error:", event);
    self.postMessage(createSafeBoxResult({
        data: event,
        kind: "error",
    }));
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(createSafeBoxResult({
        kind: "error",
        message: `Promise error: ${event.reason?.message || event.reason}`,
    }));
});

export type {
    MessageEventFinancialMainToWorker,
    MessageEventFinancialWorkerToMain,
};
