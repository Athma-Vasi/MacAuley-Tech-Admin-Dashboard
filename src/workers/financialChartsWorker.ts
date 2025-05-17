import { Some } from "ts-results";
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
