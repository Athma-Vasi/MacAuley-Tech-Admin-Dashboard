import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createCustomerMetricsCards,
    CustomerMetricsCards,
} from "../components/dashboard/customer/cards";
import {
    createCustomerMetricsCalendarChartsSafe,
    createCustomerMetricsChartsSafe,
    CustomerMetricsCalendarCharts,
    CustomerMetricsCharts,
    SelectedDateCustomerMetrics,
} from "../components/dashboard/customer/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { CustomerMetricsDocument, ResultSafeBox } from "../types";
import { createResultSafeBox } from "../utils";

type MessageEventCustomerWorkerToMain = MessageEvent<
    ResultSafeBox<
        {
            currentYear: CustomerMetricsCalendarCharts;
            previousYear: CustomerMetricsCalendarCharts;
            customerMetricsCharts: CustomerMetricsCharts;
            customerMetricsCards: CustomerMetricsCards;
        }
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        greenColorShade: string;
        redColorShade: string;
        customerMetricsDocument: CustomerMetricsDocument;
        selectedDateCustomerMetrics: SelectedDateCustomerMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventCustomerMainToWorker,
) => {
    console.log(
        "Customer Charts Worker received message",
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
        customerMetricsDocument,
        selectedDateCustomerMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const createCustomerMetricsCalendarChartsResult =
            createCustomerMetricsCalendarChartsSafe(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );
        if (
            createCustomerMetricsCalendarChartsResult.err ||
            createCustomerMetricsCalendarChartsResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: createCustomerMetricsCalendarChartsResult.val.data,
                message: Some(
                    "Error creating customer metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createCustomerMetricsCalendarChartsResult.val.data.val;

        const customerMetricsChartsResult = createCustomerMetricsChartsSafe({
            customerMetricsDocument,
            months: MONTHS,
            selectedDateCustomerMetrics,
        });
        if (
            customerMetricsChartsResult.err ||
            customerMetricsChartsResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: customerMetricsChartsResult.val.data,
                message: Some(
                    "Error creating customer metrics charts",
                ),
            }));
            return;
        }
        const customerMetricsCharts = customerMetricsChartsResult.val.data.val;

        const customerMetricsCards = createCustomerMetricsCards({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateCustomerMetrics,
        });

        self.postMessage(createResultSafeBox({
            data: Some({
                currentYear,
                previousYear,
                customerMetricsCharts,
                customerMetricsCards,
            }),
            kind: "success",
        }));
    } catch (error) {
        console.error("Customer Charts Worker error:", error);
        self.postMessage(createResultSafeBox({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Customer Charts Worker error:", event);
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

export type {
    MessageEventCustomerMainToWorker,
    MessageEventCustomerWorkerToMain,
};
