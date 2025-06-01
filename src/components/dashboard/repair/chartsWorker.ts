import { RepairMetricsDocument, SafeResult } from "../../../types";
import {
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    parseSyncSafe,
} from "../../../utils";
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
import { messageEventRepairChartsMainToWorkerZod } from "./schemas";

type MessageEventRepairChartsWorkerToMain = MessageEvent<
    SafeResult<
        {
            calendarChartsData: {
                currentYear: RepairMetricCalendarCharts;
                previousYear: RepairMetricCalendarCharts;
            };
            repairMetricsCharts: RepairMetricsCharts;
            repairMetricsCards: RepairMetricsCards;
        }
    >
>;
type MessageEventRepairChartsMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        grayBorderShade: string;
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
    event: MessageEventRepairChartsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    const parsedMessageResult = parseSyncSafe({
        object: event.data,
        zSchema: messageEventRepairChartsMainToWorkerZod,
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
        repairMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedYYYYMMDD,
    } = parsedMessageOption.val;

    try {
        const selectedDateRepairMetricsSafeResult =
            returnSelectedDateRepairMetricsSafe({
                repairMetricsDocument,
                day: selectedDate,
                month: selectedMonth,
                months: MONTHS,
                year: selectedYear,
            });
        const selectedDateRepairMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                selectedDateRepairMetricsSafeResult,
                "No repair metrics found for the selected date",
            );
        if (selectedDateRepairMetricsOption.none) {
            return;
        }

        const createRepairMetricsCalendarChartsSafeResult =
            createRepairMetricsCalendarChartsSafe(
                calendarView,
                selectedDateRepairMetricsOption.val,
                selectedYYYYMMDD,
            );
        const repairMetricsCalendarChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                createRepairMetricsCalendarChartsSafeResult,
                "No repair metrics calendar charts found",
            );
        if (repairMetricsCalendarChartsOption.none) {
            return;
        }

        const repairMetricsChartsSafeResult = createRepairMetricsChartsSafe({
            repairMetricsDocument,
            months: MONTHS,
            selectedDateRepairMetrics: selectedDateRepairMetricsOption.val,
        });
        const repairMetricsChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                repairMetricsChartsSafeResult,
                "No repair metrics charts found",
            );
        if (repairMetricsChartsOption.none) {
            return;
        }

        const repairMetricsCardsSafeResult = createRepairMetricsCardsSafe({
            grayBorderShade,
            greenColorShade,
            redColorShade,
            selectedDateRepairMetrics: selectedDateRepairMetricsOption.val,
        });
        const repairMetricsCardsOption = handleErrorResultAndNoneOptionInWorker(
            repairMetricsCardsSafeResult,
            "No repair metrics cards found",
        );
        if (repairMetricsCardsOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                calendarChartsData: repairMetricsCalendarChartsOption.val,
                repairMetricsCharts: repairMetricsChartsOption.val,
                repairMetricsCards: repairMetricsCardsOption.val,
            }),
        );
    } catch (error) {
        console.error("Repair Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
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
    MessageEventRepairChartsMainToWorker,
    MessageEventRepairChartsWorkerToMain,
};
