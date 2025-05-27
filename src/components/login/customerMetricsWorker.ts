import { METRICS_URL, STORE_LOCATIONS } from "../../constants";
import { SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    setCachedItemAsyncSafe,
} from "../../utils";
import { AllStoreLocations, CustomerMetrics } from "../dashboard/types";
import {
    createAllLocationsAggregatedCustomerMetricsSafe,
    createRandomCustomerMetricsSafe,
} from "./customerMetricsGen";

type MessageEventCustomerWorkerToMain = MessageEvent<
    SafeResult<
        string
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventCustomerMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        const [
            calgaryCustomerMetricsSettledResult,
            edmontonCustomerMetricsSettledResult,
            vancouverCustomerMetricsSettledResult,
        ] = await Promise.allSettled(
            STORE_LOCATIONS.map(async ({ value: storeLocation }) => {
                try {
                    const defaultMetrics: CustomerMetrics = {
                        lifetimeValue: 0,
                        totalCustomers: 0,
                        yearlyMetrics: [],
                    };

                    const daysInMonthsInYearsResult =
                        createDaysInMonthsInYearsSafe({
                            storeLocation,
                        });
                    if (daysInMonthsInYearsResult.err) {
                        return daysInMonthsInYearsResult;
                    }
                    if (daysInMonthsInYearsResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const daysInMonthsInYears =
                        daysInMonthsInYearsResult.val.val;

                    const customerMetricsResult =
                        createRandomCustomerMetricsSafe({
                            storeLocation,
                            daysInMonthsInYears,
                        });
                    if (customerMetricsResult.err) {
                        return customerMetricsResult;
                    }
                    if (customerMetricsResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const setMetricsInCacheResult =
                        await setCustomerMetricsInCache(
                            storeLocation,
                            customerMetricsResult.val.val,
                        );
                    if (setMetricsInCacheResult.err) {
                        return setMetricsInCacheResult;
                    }
                    if (setMetricsInCacheResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    return customerMetricsResult;
                } catch (error: unknown) {
                    return createSafeErrorResult(error);
                }
            }),
        );

        if (
            calgaryCustomerMetricsSettledResult.status === "rejected" ||
            edmontonCustomerMetricsSettledResult.status === "rejected" ||
            vancouverCustomerMetricsSettledResult.status === "rejected"
        ) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate customer metrics",
                ),
            );
            return;
        }

        if (calgaryCustomerMetricsSettledResult.value.err) {
            self.postMessage(calgaryCustomerMetricsSettledResult.value);
            return;
        }
        if (calgaryCustomerMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Calgary customer metrics",
                ),
            );
            return;
        }

        if (edmontonCustomerMetricsSettledResult.value.err) {
            self.postMessage(edmontonCustomerMetricsSettledResult.value);
            return;
        }
        if (edmontonCustomerMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Edmonton customer metrics",
                ),
            );
            return;
        }

        if (vancouverCustomerMetricsSettledResult.value.err) {
            self.postMessage(vancouverCustomerMetricsSettledResult.value);
            return;
        }
        if (vancouverCustomerMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Vancouver customer metrics",
                ),
            );
            return;
        }

        const allLocationsAggregatedCustomerMetricsResult =
            createAllLocationsAggregatedCustomerMetricsSafe({
                calgaryCustomerMetrics:
                    calgaryCustomerMetricsSettledResult.value.val.val,
                edmontonCustomerMetrics:
                    edmontonCustomerMetricsSettledResult.value.val.val,
                vancouverCustomerMetrics:
                    vancouverCustomerMetricsSettledResult.value.val.val,
            });
        if (allLocationsAggregatedCustomerMetricsResult.err) {
            self.postMessage(allLocationsAggregatedCustomerMetricsResult);
            return;
        }
        if (
            allLocationsAggregatedCustomerMetricsResult.val.none
        ) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to aggregate customer metrics",
                ),
            );
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setCustomerMetricsInCache(
                "All Locations",
                allLocationsAggregatedCustomerMetricsResult.val.val,
            );
        if (setAllLocationsMetricsInCacheResult.err) {
            self.postMessage(setAllLocationsMetricsInCacheResult);
            return;
        }
        if (setAllLocationsMetricsInCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to set all locations customer metrics in cache",
                ),
            );
            return;
        }

        self.postMessage(
            createSafeSuccessResult(
                "Customer metrics successfully generated and cached",
            ),
        );
    } catch (error) {
        console.error("Customer Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Customer Charts Worker error:", event);
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
    MessageEventCustomerMainToWorker,
    MessageEventCustomerWorkerToMain,
};

async function setCustomerMetricsInCache(
    storeLocation: AllStoreLocations,
    metrics: CustomerMetrics,
): Promise<SafeResult<string>> {
    try {
        const metricCacheKey = createMetricsURLCacheKey(
            {
                metricsUrl: METRICS_URL,
                storeLocation,
                metricsView: "customers",
                productMetricCategory: "All Products",
                repairMetricCategory: "All Repairs",
            },
        );
        const setMetricsResult = await setCachedItemAsyncSafe(
            metricCacheKey,
            metrics,
        );
        if (setMetricsResult.err) {
            return setMetricsResult;
        }

        return createSafeSuccessResult(
            `Customer metrics for ${storeLocation} successfully cached`,
        );
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
