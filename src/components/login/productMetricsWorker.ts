import { Err, Ok, Option } from "ts-results";
import { METRICS_URL, STORE_LOCATIONS } from "../../constants";
import { SafeError, SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    setCachedItemAsyncSafe,
} from "../../utils";
import { AllStoreLocations, ProductMetric } from "../dashboard/types";
import {
    createAllLocationsAggregatedProductMetricsSafe,
    createAllProductsAggregatedProductMetricsSafe,
    createRandomProductMetricsSafe,
} from "./productMetricsGen";

type MessageEventProductWorkerToMain = MessageEvent<
    SafeResult<string>
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
            calgaryProductMetricsSettledResult,
            edmontonProductMetricsSettledResult,
            vancouverProductMetricsSettledResult,
        ] = await Promise.allSettled(
            STORE_LOCATIONS.map(async ({ value: storeLocation }) => {
                try {
                    const defaultMetrics: ProductMetric[] = [];

                    const daysInMonthsInYearsResult =
                        createDaysInMonthsInYearsSafe(
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
                    const daysInMonthsInYears =
                        daysInMonthsInYearsResult.val.val;

                    const productMetricsResult = createRandomProductMetricsSafe(
                        {
                            storeLocation,
                            daysInMonthsInYears,
                        },
                    );
                    if (
                        productMetricsResult.err ||
                        productMetricsResult.val.none
                    ) {
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

                    const concatenatedMetrics = [
                        ...productMetricsResult.val.val,
                        aggregatedProductMetricsResult.val.val,
                    ];

                    const setMetricsInCacheResult =
                        await setProductMetricsInCache(
                            storeLocation,
                            concatenatedMetrics,
                        );
                    if (setMetricsInCacheResult.err) {
                        return setMetricsInCacheResult;
                    }
                    if (setMetricsInCacheResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    return createSafeSuccessResult(concatenatedMetrics);
                } catch (error: unknown) {
                    return createSafeErrorResult(error);
                }
            }),
        );

        if (
            calgaryProductMetricsSettledResult.status === "rejected" ||
            edmontonProductMetricsSettledResult.status === "rejected" ||
            vancouverProductMetricsSettledResult.status === "rejected"
        ) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate product metrics",
                ),
            );
            return;
        }

        if (calgaryProductMetricsSettledResult.value.err) {
            self.postMessage(calgaryProductMetricsSettledResult.value);
            return;
        }
        if (calgaryProductMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Calgary product metrics",
                ),
            );
            return;
        }
        const calgaryProductMetrics =
            calgaryProductMetricsSettledResult.value.val.val;

        if (edmontonProductMetricsSettledResult.value.err) {
            self.postMessage(edmontonProductMetricsSettledResult.value);
            return;
        }
        if (edmontonProductMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Edmonton product metrics",
                ),
            );
            return;
        }
        const edmontonProductMetrics =
            edmontonProductMetricsSettledResult.value.val.val;

        if (vancouverProductMetricsSettledResult.value.err) {
            self.postMessage(vancouverProductMetricsSettledResult.value);
            return;
        }
        if (vancouverProductMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Vancouver product metrics",
                ),
            );
            return;
        }
        const vancouverProductMetrics =
            vancouverProductMetricsSettledResult.value.val.val;

        const allLocationsAggregatedProductMetricsResult =
            createAllLocationsAggregatedProductMetricsSafe({
                calgaryProductMetrics,
                edmontonProductMetrics,
                vancouverProductMetrics,
            });

        if (allLocationsAggregatedProductMetricsResult.err) {
            self.postMessage(allLocationsAggregatedProductMetricsResult);
            return;
        }
        if (allLocationsAggregatedProductMetricsResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Failed to aggregate product metrics"),
            );
            return;
        }
        const allLocationsAggregatedProductMetrics =
            allLocationsAggregatedProductMetricsResult.val.val;

        const setAllLocationsMetricsInCacheResult =
            await setProductMetricsInCache(
                "All Locations",
                allLocationsAggregatedProductMetricsResult.val.val,
            );
        if (setAllLocationsMetricsInCacheResult.err) {
            self.postMessage(
                setAllLocationsMetricsInCacheResult,
            );
            return;
        }
        if (setAllLocationsMetricsInCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No All Locations product metrics set in cache",
                ),
            );
            return;
        }

        // for financial metrics generation
        const setProductMetricsCacheResult = await setCachedItemAsyncSafe(
            "productMetrics",
            {
                Calgary: calgaryProductMetrics,
                Edmonton: edmontonProductMetrics,
                Vancouver: vancouverProductMetrics,
                "All Locations": allLocationsAggregatedProductMetrics,
            },
        );
        if (setProductMetricsCacheResult.err) {
            self.postMessage(setProductMetricsCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult(
                true,
            ),
        );
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

async function setProductMetricsInCache(
    storeLocation: AllStoreLocations,
    metrics: ProductMetric[],
): Promise<SafeResult<string>> {
    try {
        const setItemResults = await Promise.allSettled(
            metrics.map(
                async (metric) => {
                    try {
                        const { name, yearlyMetrics } = metric;
                        const metricCacheKey = createMetricsURLCacheKey(
                            {
                                metricsUrl: METRICS_URL,
                                storeLocation,
                                metricsView: "products",
                                productMetricCategory: name,
                                repairMetricCategory: "All Repairs",
                            },
                        );

                        const setItemResult = await setCachedItemAsyncSafe(
                            metricCacheKey,
                            yearlyMetrics,
                        );
                        if (setItemResult.err) {
                            return setItemResult;
                        }

                        return createSafeSuccessResult(true);
                    } catch (error) {
                        return createSafeErrorResult(error);
                    }
                },
            ),
        );

        const [sucesses, errors] = setItemResults.reduce<
            [Ok<Option<NonNullable<boolean>>>[], Err<SafeError>[]]
        >(
            (acc, result) => {
                if (result.status === "fulfilled") {
                    if (result.value.err) {
                        acc[1].push(result.value);
                    } else if (result.value.val.none) {
                        acc[1].push(createSafeErrorResult("No data"));
                    } else {
                        acc[0].push(result.value);
                    }
                } else {
                    acc[1].push(
                        createSafeErrorResult(
                            result.reason ?? "Unknown error",
                        ),
                    );
                }
                return acc;
            },
            [[], []],
        );

        if (errors.length > 0) {
            return createSafeErrorResult(
                `Failed to set some product metrics in cache: ${
                    errors.map(
                        (error) => error.val,
                    ).join(", ")
                }`,
            );
        }

        if (sucesses.length === 0) {
            return createSafeErrorResult(
                "No product metrics set in cache",
            );
        }

        return createSafeSuccessResult(
            `Successfully set ${sucesses.length} product metrics in cache`,
        );
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
