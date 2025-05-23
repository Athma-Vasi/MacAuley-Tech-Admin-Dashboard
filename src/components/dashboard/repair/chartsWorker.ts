import { Some } from "ts-results";
import { RepairMetricsDocument, ResultSafeBox } from "../../../types";
import { createSafeErrorResult, parseSyncSafe } from "../../../utils";
import { MONTHS } from "../constants";
import { DashboardCalendarView, Month, Year } from "../types";
import { createRepairMetricsCardsSafe, RepairMetricsCards } from "./cards";
import {
    createRepairMetricsCalendarChartsSafe,
    createRepairMetricsChartsSafe,
    RepairMetricCalendarCharts,
    RepairMetricsCharts,
    returnSelectedDateRepairMetricsSafe,
} from "./chartsData";
import { messageEventRepairMainToWorkerZod } from "./schemas";

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
        repairMetricsDocument: RepairMetricsDocument;
        redColorShade: string;
        selectedDate: string;
        selectedMonth: Month;
        selectedYYYYMMDD: string;
        selectedYear: Year;
    }
>;

self.onmessage = async (
    event: MessageEventRepairMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventRepairMainToWorkerZod,
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
        repairMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageResult.val.safeUnwrap();

    try {
        const selectedDateRepairMetricsSafeResult =
            returnSelectedDateRepairMetricsSafe({
                repairMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        if (
            selectedDateRepairMetricsSafeResult.err ||
            selectedDateRepairMetricsSafeResult.val.data.none
        ) {
            self.postMessage(createSafeBoxResult({
                data: selectedDateRepairMetricsSafeResult.val.data,
                message: Some(
                    "Error getting selected date repair metrics",
                ),
            }));
            return;
        }
        const selectedDateRepairMetrics =
            selectedDateRepairMetricsSafeResult.val.data.val;

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
            self.postMessage(createSafeBoxResult({
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
            self.postMessage(createSafeBoxResult({
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
            self.postMessage(createSafeBoxResult({
                data: repairMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating repair metrics cards",
                ),
            }));
            return;
        }
        const repairMetricsCards = repairMetricsCardsSafeResult.val.data.val;

        self.postMessage(createSafeBoxResult({
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
        self.postMessage(createSafeBoxResult({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
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

export type { MessageEventRepairMainToWorker, MessageEventRepairWorkerToMain };
