import { MONTHS } from "../components/dashboard/constants";
import {
    createFinancialMetricsCalendarCharts,
    createFinancialMetricsCharts,
} from "../components/dashboard/financial/chartsData";
import { MessageEventFinancialMainToWorker } from "../components/dashboard/financial/types";
import { createSafeBoxResult } from "../utils";

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
        financialMetricsDocument,
        selectedDateFinancialMetrics,
        selectedYYYYMMDD,
        storeLocation,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            await createFinancialMetricsCalendarCharts(
                calendarView,
                selectedDateFinancialMetrics,
                selectedYYYYMMDD,
            );

        const financialMetricsCharts = await createFinancialMetricsCharts({
            financialMetricsDocument,
            months: MONTHS,
            selectedDateFinancialMetrics,
            storeLocation,
        });

        self.postMessage(createSafeBoxResult({
            data: { currentYear, previousYear, financialMetricsCharts },
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
