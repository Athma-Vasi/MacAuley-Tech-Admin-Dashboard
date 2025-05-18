import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createCustomerMetricsCardsSafe,
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
            message: Some("No data received"),
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
        const createCustomerMetricsCalendarChartsSafeResult =
            createCustomerMetricsCalendarChartsSafe(
                calendarView,
                selectedDateCustomerMetrics,
                selectedYYYYMMDD,
            );
        if (
            createCustomerMetricsCalendarChartsSafeResult.err ||
            createCustomerMetricsCalendarChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: createCustomerMetricsCalendarChartsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createCustomerMetricsCalendarChartsSafeResult.val.data.val;

        const customerMetricsChartsSafeResult = createCustomerMetricsChartsSafe(
            {
                customerMetricsDocument,
                months: MONTHS,
                selectedDateCustomerMetrics,
            },
        );
        if (
            customerMetricsChartsSafeResult.err ||
            customerMetricsChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: customerMetricsChartsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics charts",
                ),
            }));
            return;
        }
        const customerMetricsCharts =
            customerMetricsChartsSafeResult.val.data.val;

        const customerMetricsCardsSafeResult = createCustomerMetricsCardsSafe({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateCustomerMetrics,
        });
        if (
            customerMetricsCardsSafeResult.err ||
            customerMetricsCardsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: customerMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating customer metrics cards",
                ),
            }));
            return;
        }
        const customerMetricsCards =
            customerMetricsCardsSafeResult.val.data.val;

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
