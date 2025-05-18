import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createRepairMetricsCardsSafe,
    RepairMetricsCards,
} from "../components/dashboard/repair/cards";
import {
    createRepairMetricsCalendarChartsSafe,
    createRepairMetricsChartsSafe,
    RepairMetricCalendarCharts,
    RepairMetricsCharts,
    SelectedDateRepairMetrics,
} from "../components/dashboard/repair/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { RepairMetricsDocument, ResultSafeBox } from "../types";
import { createResultSafeBox } from "../utils";

type MessageEventRepairWorkerToMain = MessageEvent<
    ResultSafeBox<
        {
            currentYear: RepairMetricCalendarCharts;
            previousYear: RepairMetricCalendarCharts;
            repairMetricsCharts: RepairMetricsCharts;
            repairMetricsCards: RepairMetricsCards;
        }
    >
>;
type MessageEventRepairMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        greenColorShade: string;
        redColorShade: string;
        repairMetricsDocument: RepairMetricsDocument;
        selectedDateRepairMetrics: SelectedDateRepairMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventRepairMainToWorker,
) => {
    console.log(
        "Repair Charts Worker received message",
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
        repairMetricsDocument,
        selectedDateRepairMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const createRepairMetricsCalendarChartsSafeResult =
            createRepairMetricsCalendarChartsSafe(
                calendarView,
                selectedDateRepairMetrics,
                selectedYYYYMMDD,
            );
        if (
            createRepairMetricsCalendarChartsSafeResult.err ||
            createRepairMetricsCalendarChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: createRepairMetricsCalendarChartsSafeResult.val.data,
                message: Some(
                    "Error creating repair metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createRepairMetricsCalendarChartsSafeResult.val.data.val;

        const repairMetricsChartsSafeResult = createRepairMetricsChartsSafe({
            repairMetricsDocument,
            months: MONTHS,
            selectedDateRepairMetrics,
        });
        if (
            repairMetricsChartsSafeResult.err ||
            repairMetricsChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: repairMetricsChartsSafeResult.val.data,
                message: Some(
                    "Error creating repair metrics charts",
                ),
            }));
            return;
        }
        const repairMetricsCharts = repairMetricsChartsSafeResult.val.data.val;

        const repairMetricsCardsSafeResult = createRepairMetricsCardsSafe({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateRepairMetrics,
        });
        if (
            repairMetricsCardsSafeResult.err ||
            repairMetricsCardsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: repairMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating repair metrics cards",
                ),
            }));
            return;
        }
        const repairMetricsCards = repairMetricsCardsSafeResult.val.data.val;

        self.postMessage(createResultSafeBox({
            data: Some({
                currentYear,
                previousYear,
                repairMetricsCharts,
                repairMetricsCards,
            }),
            kind: "success",
        }));
    } catch (error) {
        console.error("Repair Charts Worker error:", error);
        self.postMessage(createResultSafeBox({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
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

export type { MessageEventRepairMainToWorker, MessageEventRepairWorkerToMain };
