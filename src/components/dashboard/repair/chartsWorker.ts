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
            currentYear: RepairMetricCalendarCharts;
            previousYear: RepairMetricCalendarCharts;
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
    // if (parsedMessageResult.err) {
    //     self.postMessage(parsedMessageResult);
    //     return;
    // }
    // if (parsedMessageResult.val.none) {
    //     self.postMessage(
    //         createSafeErrorResult("Error parsing input"),
    //     );
    //     return;
    // }
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
        // if (selectedDateRepairMetricsSafeResult.err) {
        //     self.postMessage(
        //         selectedDateRepairMetricsSafeResult,
        //     );
        //     return;
        // }
        // if (selectedDateRepairMetricsSafeResult.val.none) {
        //     self.postMessage(
        //         createSafeErrorResult(
        //             "No repair metrics found for the selected date",
        //         ),
        //     );
        //     return;
        // }
        // const selectedDateRepairMetrics = selectedDateRepairMetricsSafeResult
        //     .val.val;
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
        // if (createRepairMetricsCalendarChartsSafeResult.err) {
        //     self.postMessage(
        //         createRepairMetricsCalendarChartsSafeResult,
        //     );
        //     return;
        // }
        // if (createRepairMetricsCalendarChartsSafeResult.val.none) {
        //     self.postMessage(
        //         createSafeErrorResult(
        //             "No repair metrics calendar charts found",
        //         ),
        //     );
        //     return;
        // }
        const createRepairMetricsCalendarChartsOption =
            handleErrorResultAndNoneOptionInWorker(
                createRepairMetricsCalendarChartsSafeResult,
                "No repair metrics calendar charts found",
            );
        if (createRepairMetricsCalendarChartsOption.none) {
            return;
        }
        // const { currentYear, previousYear } =
        //     createRepairMetricsCalendarChartsSafeResult.val.val;

        const repairMetricsChartsSafeResult = createRepairMetricsChartsSafe({
            repairMetricsDocument,
            months: MONTHS,
            selectedDateRepairMetrics: selectedDateRepairMetricsOption.val,
        });
        // if (repairMetricsChartsSafeResult.err) {
        //     self.postMessage(repairMetricsChartsSafeResult);
        //     return;
        // }
        // if (repairMetricsChartsSafeResult.val.none) {
        //     self.postMessage(
        //         createSafeErrorResult(
        //             "No repair metrics charts found",
        //         ),
        //     );
        //     return;
        // }
        // const repairMetricsCharts = repairMetricsChartsSafeResult.val
        //     .val;
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
        // if (repairMetricsCardsSafeResult.err) {
        //     self.postMessage(
        //         repairMetricsCardsSafeResult,
        //     );
        //     return;
        // }
        // if (repairMetricsCardsSafeResult.val.none) {
        //     self.postMessage(
        //         createSafeErrorResult(
        //             "No repair metrics cards found",
        //         ),
        //     );
        //     return;
        // }
        // const repairMetricsCards = repairMetricsCardsSafeResult.val
        //     .val;
        const repairMetricsCardsOption = handleErrorResultAndNoneOptionInWorker(
            repairMetricsCardsSafeResult,
            "No repair metrics cards found",
        );
        if (repairMetricsCardsOption.none) {
            return;
        }

        self.postMessage(
            createSafeSuccessResult({
                currentYear:
                    createRepairMetricsCalendarChartsOption.val.currentYear,
                previousYear:
                    createRepairMetricsCalendarChartsOption.val.previousYear,
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
