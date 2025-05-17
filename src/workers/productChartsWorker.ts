import { Some } from "ts-results";
import { MONTHS } from "../components/dashboard/constants";
import {
    createProductMetricsCards,
    ProductMetricsCards,
} from "../components/dashboard/product/cards";
import {
    createProductMetricsCalendarCharts,
    createProductMetricsCharts,
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
    console.log(
        "Product Charts Worker received message",
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
        productMetricsDocument,
        selectedDateProductMetrics,
        selectedYYYYMMDD,
    } = event.data;

    try {
        const { currentYear, previousYear } =
            createProductMetricsCalendarCharts(
                calendarView,
                selectedDateProductMetrics,
                selectedYYYYMMDD,
            );

        const productMetricsCharts = createProductMetricsCharts({
            productMetricsDocument,
            months: MONTHS,
            selectedDateProductMetrics,
        });

        const productMetricsCards = createProductMetricsCards({
            cardBgGradient,
            greenColorShade,
            redColorShade,
            selectedDateProductMetrics,
        });

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
