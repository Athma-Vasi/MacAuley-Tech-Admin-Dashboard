import { MONTHS } from "../components/dashboard/constants";
import {
    createRepairMetricsCalendarCharts,
    createRepairMetricsCharts,
    RepairMetricCalendarCharts,
    RepairMetricsCharts,
    SelectedDateRepairMetrics,
} from "../components/dashboard/repair/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { RepairMetricsDocument, SafeBoxResult } from "../types";
import { createSafeBoxResult } from "../utils";

type MessageEventRepairWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: RepairMetricCalendarCharts;
            previousYear: RepairMetricCalendarCharts;
            repairMetricsCharts: RepairMetricsCharts;
        }
    >
>;
type MessageEventRepairMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        repairMetricsDocument: RepairMetricsDocument;
        selectedDateRepairMetrics: SelectedDateRepairMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventRepairMainToWorker,
) => {
    console.log(
        "Repair Charts Worker received message in self",
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
        repairMetricsDocument,
        selectedDateRepairMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            await createRepairMetricsCalendarCharts(
                calendarView,
                selectedDateRepairMetrics,
                selectedYYYYMMDD,
            );

        const repairMetricsCharts = await createRepairMetricsCharts({
            repairMetricsDocument,
            months: MONTHS,
            selectedDateRepairMetrics,
        });

        self.postMessage(createSafeBoxResult({
            data: { currentYear, previousYear, repairMetricsCharts },
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

export type { MessageEventRepairMainToWorker, MessageEventRepairWorkerToMain };
