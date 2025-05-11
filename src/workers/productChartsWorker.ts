import { MONTHS } from "../components/dashboard/constants";
import {
    createProductMetricsCalendarCharts,
    createProductMetricsCharts,
    ProductMetricsCalendarCharts,
    ProductMetricsCharts,
    SelectedDateProductMetrics,
} from "../components/dashboard/product/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { ProductMetricsDocument, SafeBoxResult } from "../types";
import { createSafeBoxResult } from "../utils";

type MessageEventProductWorkerToMain = MessageEvent<
    SafeBoxResult<
        {
            currentYear: ProductMetricsCalendarCharts;
            previousYear: ProductMetricsCalendarCharts;
            productMetricsCharts: ProductMetricsCharts;
        }
    >
>;
type MessageEventProductMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        productMetricsDocument: ProductMetricsDocument;
        selectedDateProductMetrics: SelectedDateProductMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventProductMainToWorker,
) => {
    console.log(
        "Product Charts Worker received message in self",
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
        productMetricsDocument,
        selectedDateProductMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            await createProductMetricsCalendarCharts(
                calendarView,
                selectedDateProductMetrics,
                selectedYYYYMMDD,
            );

        const productMetricsCharts = await createProductMetricsCharts({
            productMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics,
        });

        self.postMessage(createSafeBoxResult({
            data: { currentYear, previousYear, productMetricsCharts },
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
    MessageEventProductMainToWorker,
    MessageEventProductWorkerToMain,
};
