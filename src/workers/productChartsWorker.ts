import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createProductMetricsCardsSafe,
    ProductMetricsCards,
} from "../components/dashboard/product/cards";
import {
    createProductMetricsCalendarChartsSafe,
    createProductMetricsChartsSafe,
    ProductMetricsCalendarCharts,
    ProductMetricsCharts,
    SelectedDateProductMetrics,
} from "../components/dashboard/product/chartsData";
import { DashboardCalendarView } from "../components/dashboard/types";
import { ProductMetricsDocument, ResultSafeBox } from "../types";
import { createResultSafeBox } from "../utils";

type MessageEventProductWorkerToMain = MessageEvent<
    ResultSafeBox<
        {
            currentYear: ProductMetricsCalendarCharts;
            previousYear: ProductMetricsCalendarCharts;
            productMetricsCharts: ProductMetricsCharts;
            productMetricsCards: ProductMetricsCards;
        }
    >
>;
type MessageEventProductMainToWorker = MessageEvent<
    {
        calendarView: DashboardCalendarView;
        cardBgGradient: string;
        greenColorShade: string;
        redColorShade: string;
        productMetricsDocument: ProductMetricsDocument;
        selectedDateProductMetrics: SelectedDateProductMetrics;
        selectedYYYYMMDD: string;
    }
>;

self.onmessage = async (
    event: MessageEventProductMainToWorker,
) => {
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
        productMetricsDocument,
        selectedDateProductMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const createProductMetricsCalendarChartsSafeResult =
            createProductMetricsCalendarChartsSafe(
                calendarView,
                selectedDateProductMetrics,
                selectedYYYYMMDD,
            );
        if (
            createProductMetricsCalendarChartsSafeResult.err ||
            createProductMetricsCalendarChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: createProductMetricsCalendarChartsSafeResult.val.data,
                message: Some(
                    "Error creating product metrics calendar charts",
                ),
            }));
            return;
        }
        const { currentYear, previousYear } =
            createProductMetricsCalendarChartsSafeResult.val.data.val;

        const productMetricsChartsSafeResult = createProductMetricsChartsSafe({
            productMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics,
        });
        if (
            productMetricsChartsSafeResult.err ||
            productMetricsChartsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: productMetricsChartsSafeResult.val.data,
                message: Some(
                    "Error creating product metrics charts",
                ),
            }));
            return;
        }
        const productMetricsCharts =
            productMetricsChartsSafeResult.val.data.val;

        const productMetricsCardsSafeResult = createProductMetricsCardsSafe({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateProductMetrics,
        });
        if (
            productMetricsCardsSafeResult.err ||
            productMetricsCardsSafeResult.val.data.none
        ) {
            self.postMessage(createResultSafeBox({
                data: productMetricsCardsSafeResult.val.data,
                message: Some(
                    "Error creating product metrics cards",
                ),
            }));
            return;
        }
        const productMetricsCards = productMetricsCardsSafeResult.val.data.val;

        self.postMessage(createResultSafeBox({
            data: Some({
                currentYear,
                previousYear,
                productMetricsCharts,
                productMetricsCards,
            }),
            kind: "success",
        }));
    } catch (error) {
        console.error("Product Charts Worker error:", error);
        self.postMessage(createResultSafeBox({
            data: Some(error),
            message: Some(
                error instanceof Error ? error.message : "Unknown error",
            ),
        }));
    }
};

self.onerror = (event: string | Event) => {
    console.error("Product Charts Worker error:", event);
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
    MessageEventProductMainToWorker,
    MessageEventProductWorkerToMain,
};
