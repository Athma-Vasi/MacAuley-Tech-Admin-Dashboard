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

        const setCalgaryMetricsInCacheResult = await setProductMetricsInCache(
            "Calgary",
            calgaryProductMetricsResult.val.val,
        );
        if (setCalgaryMetricsInCacheResult.err) {
            self.postMessage(
                setCalgaryMetricsInCacheResult,
            );
            return;
        }
        if (setCalgaryMetricsInCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No Calgary product metrics set in cache",
                ),
            );
            return;
        }

        const setEdmontonMetricsInCacheResult = await setProductMetricsInCache(
            "Edmonton",
            edmontonProductMetricsResult.val.val,
        );
        if (setEdmontonMetricsInCacheResult.err) {
            self.postMessage(
                setEdmontonMetricsInCacheResult,
            );
            return;
        }
        if (setEdmontonMetricsInCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No Edmonton product metrics set in cache",
                ),
            );
            return;
        }

        const setVancouverMetricsInCacheResult = await setProductMetricsInCache(
            "Vancouver",
            vancouverProductMetricsResult.val.val,
        );
        if (setVancouverMetricsInCacheResult.err) {
            self.postMessage(
                setVancouverMetricsInCacheResult,
            );
            return;
        }
        if (setVancouverMetricsInCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No Vancouver product metrics set in cache",
                ),
            );
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setProductMetricsInCache(
                "All Locations",
                allLocationsAggregatedProductMetrics.val.val,
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

        self.postMessage(
            createSafeSuccessResult(
                "Successfully set product metrics in cache for all locations",
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
