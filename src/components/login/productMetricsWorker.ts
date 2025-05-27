import { STORE_LOCATIONS } from "../../constants";
import { SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
} from "../../utils";
import { AllStoreLocations, ProductMetric } from "../dashboard/types";
import {
    createAllLocationsAggregatedProductMetricsSafe,
    createAllProductsAggregatedProductMetricsSafe,
    createRandomProductMetricsSafe,
} from "./productMetricsGen";

type MessageEventProductWorkerToMain = MessageEvent<
    SafeResult<
        Record<AllStoreLocations, ProductMetric[]>
    >
>;
type MessageEventProductMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventProductMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        const [
            calgaryProductMetricsResult,
            edmontonProductMetricsResult,
            vancouverProductMetricsResult,
        ] = STORE_LOCATIONS.map(
            ({ value: storeLocation }) => {
                const defaultMetrics: ProductMetric[] = [];

                const daysInMonthsInYearsResult = createDaysInMonthsInYearsSafe(
                    {
                        storeLocation,
                    },
                );
                if (
                    daysInMonthsInYearsResult.err ||
                    daysInMonthsInYearsResult.val.none
                ) {
                    return createSafeErrorResult(defaultMetrics);
                }
                const daysInMonthsInYears = daysInMonthsInYearsResult.val.val;

                const productMetricsResult = createRandomProductMetricsSafe({
                    storeLocation,
                    daysInMonthsInYears,
                });
                if (productMetricsResult.err || productMetricsResult.val.none) {
                    return createSafeErrorResult(defaultMetrics);
                }

                const aggregatedProductMetricsResult =
                    createAllProductsAggregatedProductMetricsSafe(
                        productMetricsResult.val.val,
                    );
                if (
                    aggregatedProductMetricsResult.err ||
                    aggregatedProductMetricsResult.val.none
                ) {
                    return createSafeErrorResult(defaultMetrics);
                }

                return createSafeSuccessResult([
                    ...productMetricsResult.val.val,
                    aggregatedProductMetricsResult.val.val,
                ]);
            },
        );

        if (
            calgaryProductMetricsResult.err ||
            calgaryProductMetricsResult.val.none ||
            edmontonProductMetricsResult.err ||
            edmontonProductMetricsResult.val.none ||
            vancouverProductMetricsResult.err ||
            vancouverProductMetricsResult.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to generate product metrics"),
            );
            return;
        }

        const allLocationsAggregatedProductMetrics =
            createAllLocationsAggregatedProductMetricsSafe({
                calgaryProductMetrics: calgaryProductMetricsResult.val.val,
                edmontonProductMetrics: edmontonProductMetricsResult.val.val,
                vancouverProductMetrics: vancouverProductMetricsResult.val.val,
            });
        if (
            allLocationsAggregatedProductMetrics.err ||
            allLocationsAggregatedProductMetrics.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to aggregate product metrics"),
            );
            return;
        }

        self.postMessage(createSafeSuccessResult(
            {
                Calgary: calgaryProductMetricsResult.val.val,
                Edmonton: edmontonProductMetricsResult.val.val,
                Vancouver: vancouverProductMetricsResult.val.val,
                "All Locations": allLocationsAggregatedProductMetrics.val.val,
            },
        ));
    } catch (error) {
        console.error("Product Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Product Charts Worker error:", event);
    self.postMessage(
        createSafeErrorResult(event),
    );
    return true; // Prevents default logging to console
};

self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection in worker:", event.reason);
    self.postMessage(
        createSafeErrorResult(event),
    );
});

export type {
    MessageEventProductMainToWorker,
    MessageEventProductWorkerToMain,
};
