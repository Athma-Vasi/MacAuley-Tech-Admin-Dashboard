import { MONTHS } from "../components/dashboard/constants";
import {
    createCustomerMetricsCards,
    CustomerMetricsCards,
} from "../components/dashboard/customer/cards";
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
            customerMetricsCards: CustomerMetricsCards;
            customerMetricsCharts: CustomerMetricsCharts;
        }
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        customerMetricsDocument: CustomerMetricsDocument;
        greenColorShade: string;
        redColorShade: string;
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
        cardBgGradient,
        customerMetricsDocument,
        greenColorShade,
        redColorShade,
        selectedDateCustomerMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            createCustomerMetricsCalendarCharts(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );

        const customerMetricsCharts = createCustomerMetricsCharts({
            customerMetricsDocument,
            months: MONTHS,
            selectedDateCustomerMetrics,
        });

        const customerMetricsCards = createCustomerMetricsCards({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateCustomerMetrics,
        });

        self.postMessage(createSafeBoxResult({
            data: {
                currentYear,
                previousYear,
                customerMetricsCards,
                customerMetricsCharts,
            },
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
