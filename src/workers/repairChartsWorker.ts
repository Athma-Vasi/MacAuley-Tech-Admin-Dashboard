import { MONTHS } from "../components/dashboard/constants";
import {
    createRepairMetricsCalendarCharts,
    createRepairMetricsCharts,
} from "../components/dashboard/repair/chartsData";
import { MessageEventRepairMainToWorker } from "../components/dashboard/repair/types";
import { createSafeBoxResult } from "../utils";

self.onmessage = async (
    event: MessageEventRepairMainToWorker,
) => {
    console.log(
        "Repair Charts Worker received message in self:",
        JSON.stringify(event.data),
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
