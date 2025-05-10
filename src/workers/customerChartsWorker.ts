import { MONTHS } from "../components/dashboard/constants";
import {
    createCustomerMetricsCalendarCharts,
    createCustomerMetricsCharts,
    CustomerMetricsCalendarCharts,
    CustomerMetricsCharts,
    SelectedDateCustomerMetrics,
} from "../components/dashboard/customer/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { CustomerMetricsDocument, SafeBoxResult } from "../types";
import { createSafeBoxResult } from "../utils";

type MessageEventCustomerWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: CustomerMetricsCalendarCharts;
            previousYear: CustomerMetricsCalendarCharts;
            customerMetricsCharts: CustomerMetricsCharts;
        }
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        customerMetricsDocument: CustomerMetricsDocument;
        selectedDateCustomerMetrics: SelectedDateCustomerMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventCustomerMainToWorker,
) => {
    console.log(
        "Customer Charts Worker received message in self",
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
        customerMetricsDocument,
        selectedDateCustomerMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            await createCustomerMetricsCalendarCharts(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );

        const customerMetricsCharts = await createCustomerMetricsCharts({
            customerMetricsDocument,
            months: MONTHS,
            selectedDateCustomerMetrics,
        });

        self.postMessage(createSafeBoxResult({
            data: { currentYear, previousYear, customerMetricsCharts },
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
    MessageEventCustomerMainToWorker,
    MessageEventCustomerWorkerToMain,
};
