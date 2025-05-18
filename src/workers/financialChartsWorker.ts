import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createFinancialMetricsCardsSafe,
    FinancialMetricsCards,
} from "../components/dashboard/financial/cards";
import {
    createFinancialMetricsCalendarChartsSafe,
    createFinancialMetricsChartsSafe,
    FinancialMetricsCalendarCharts,
    FinancialMetricsCharts,
    SelectedDateFinancialMetrics,
} from "../components/dashboard/financial/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { FinancialMetricsDocument, ResultSafeBox } from "../types";
import { createResultSafeBox } from "../utils";

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
        redColorShade: string;
        financialMetricsDocument: FinancialMetricsDocument;
        selectedDateFinancialMetrics: SelectedDateFinancialMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventFinancialMainToWorker,
) => {
    console.log(
        "Financial Charts Worker received message",
    );

    if (!event.data) {
        self.postMessage(createResultSafeBox({
            data: Some(new Error("No data received")),
        }));
        return;
    }

    const {
        calendarView,
        cardBgGradient,
        greenColorShade,
        redColorShade,
        financialMetricsDocument,
        selectedDateFinancialMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const createFinancialMetricsCalendarChartsResult =
            createFinancialMetricsCalendarChartsSafe(
                calendarView,
                selectedDateFinancialMetrics,
                selectedYYYYMMDD,
            );
        if (
            createFinancialMetricsCalendarChartsResult.err ||
            createFinancialMetricsCalendarChartsResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: createFinancialMetricsCalendarChartsResult.val.data,
                message: Some(
                    "Error creating financial metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createFinancialMetricsCalendarChartsResult.val.data.val;

        const financialMetricsChartsResult = createFinancialMetricsChartsSafe({
            financialMetricsDocument,
            months: MONTHS,
            selectedDateFinancialMetrics,
        });
        if (
            financialMetricsChartsResult.err ||
            financialMetricsChartsResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: financialMetricsChartsResult.val.data,
                message: Some(
                    "Error creating financial metrics charts",
                ),
            }));
            return;
        }
        const financialMetricsCharts =
            financialMetricsChartsResult.val.data.val;

        const financialMetricsCardsResult = createFinancialMetricsCardsSafe({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateFinancialMetrics,
        });
        if (
            financialMetricsCardsResult.err ||
            financialMetricsCardsResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: financialMetricsCardsResult.val.data,
                message: Some(
                    "Error creating financial metrics cards",
                ),
            }));
            return;
        }
        const financialMetricsCards = financialMetricsCardsResult.val.data.val;

        self.postMessage(createResultSafeBox({
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
        self.postMessage(createResultSafeBox({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Financial Charts Worker error:", event);
    self.postMessage(createResultSafeBox({
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
    self.postMessage(createResultSafeBox({
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
