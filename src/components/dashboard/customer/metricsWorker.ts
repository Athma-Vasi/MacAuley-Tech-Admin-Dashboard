import { METRICS_URL, STORE_LOCATIONS } from "../../../constants";
import { CustomerMetricsDocument, SafeResult } from "../../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    setCachedItemAsyncSafe,
} from "../../../utils";
import { AllStoreLocations, CustomerMetrics } from "../types";
import {
    createAllLocationsAggregatedCustomerMetricsSafe,
    createRandomCustomerMetricsSafe,
} from "./generators";

type MessageEventCustomerMetricsWorkerToMain = MessageEvent<
    SafeResult<
        string
    >
>;
type MessageEventCustomerMetricsMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventCustomerMetricsMainToWorker,
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

        if (calgaryCustomerMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    calgaryCustomerMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const calgaryCustomerMetricsSettledOption =
            handleErrorResultAndNoneOptionInWorker(
                calgaryCustomerMetricsSettledResult.value,
                "Failed to generate Calgary customer metrics",
            );
        if (calgaryCustomerMetricsSettledOption.none) {
            return;
        }

        if (edmontonCustomerMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    edmontonCustomerMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const edmontonCustomerMetricsSettledOption =
            handleErrorResultAndNoneOptionInWorker(
                edmontonCustomerMetricsSettledResult.value,
                "Failed to generate Edmonton customer metrics",
            );
        if (edmontonCustomerMetricsSettledOption.none) {
            return;
        }

        if (vancouverCustomerMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    vancouverCustomerMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const vancouverCustomerMetricsSettledOption =
            handleErrorResultAndNoneOptionInWorker(
                vancouverCustomerMetricsSettledResult.value,
                "Failed to generate Vancouver customer metrics",
            );
        if (vancouverCustomerMetricsSettledOption.none) {
            return;
        }

        const allLocationsAggregatedCustomerMetricsResult =
            createAllLocationsAggregatedCustomerMetricsSafe({
                calgaryCustomerMetrics: calgaryCustomerMetricsSettledOption.val,
                edmontonCustomerMetrics:
                    edmontonCustomerMetricsSettledOption.val,
                vancouverCustomerMetrics:
                    vancouverCustomerMetricsSettledOption.val,
            });
        const allLocationsAggregatedCustomerMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                allLocationsAggregatedCustomerMetricsResult,
                "Failed to aggregate customer metrics",
            );
        if (allLocationsAggregatedCustomerMetricsOption.none) {
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setCustomerMetricsInCache(
                "All Locations",
                allLocationsAggregatedCustomerMetricsOption.val,
            );
        const setAllLocationsMetricsInCacheOption =
            handleErrorResultAndNoneOptionInWorker(
                setAllLocationsMetricsInCacheResult,
                "Failed to set all locations customer metrics in cache",
            );
        if (setAllLocationsMetricsInCacheOption.none) {
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
    MessageEventCustomerMetricsMainToWorker,
    MessageEventCustomerMetricsWorkerToMain,
};

function createCustomerMetricsDocument(
    storeLocation: AllStoreLocations,
    customerMetrics: CustomerMetrics,
): CustomerMetricsDocument {
    return {
        _id: createMetricsURLCacheKey({
            metricsUrl: METRICS_URL,
            metricsView: "customers",
            productMetricCategory: "All Products",
            repairMetricCategory: "All Repairs",
            storeLocation,
        }) ?? crypto.randomUUID(),
        __v: 0,
        createdAt: new Date().toISOString(),
        customerMetrics,
        storeLocation,
        updatedAt: new Date().toISOString(),
    };
}

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
            createCustomerMetricsDocument(
                storeLocation,
                metrics,
            ),
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
