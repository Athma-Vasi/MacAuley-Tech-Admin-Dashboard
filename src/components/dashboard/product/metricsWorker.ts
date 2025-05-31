import { METRICS_URL, STORE_LOCATIONS } from "../../../constants";
import { ProductMetricsDocument, SafeResult } from "../../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    handleErrorResultAndNoneOptionInWorker,
    handlePromiseSettledResults,
    setCachedItemAsyncSafe,
} from "../../../utils";
import {
    AllStoreLocations,
    ProductCategory,
    ProductMetric,
    ProductYearlyMetric,
} from "../types";
import {
    createAllLocationsAggregatedProductMetricsSafe,
    createAllProductsAggregatedProductMetricsSafe,
    createRandomProductMetricsSafe,
} from "./generators";

type MessageEventProductMetricsWorkerToMain = MessageEvent<
    SafeResult<boolean>
>;
type MessageEventProductMetricsMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventProductMetricsMainToWorker,
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
                    if (daysInMonthsInYearsResult.err) {
                        return daysInMonthsInYearsResult;
                    }
                    if (daysInMonthsInYearsResult.val.none) {
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
                    if (productMetricsResult.err) {
                        return productMetricsResult;
                    }
                    if (productMetricsResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const aggregatedProductMetricsResult =
                        createAllProductsAggregatedProductMetricsSafe(
                            productMetricsResult.val.val,
                        );
                    if (aggregatedProductMetricsResult.err) {
                        return aggregatedProductMetricsResult;
                    }
                    if (aggregatedProductMetricsResult.val.none) {
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

        if (calgaryProductMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    calgaryProductMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const calgaryProductMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                calgaryProductMetricsSettledResult.value,
                "Failed to generate Calgary product metrics",
            );
        if (calgaryProductMetricsOption.none) {
            return;
        }

        if (edmontonProductMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    edmontonProductMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const edmontonProductMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                edmontonProductMetricsSettledResult.value,
                "Failed to generate Edmonton product metrics",
            );
        if (edmontonProductMetricsOption.none) {
            return;
        }

        if (vancouverProductMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    vancouverProductMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const vancouverProductMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                vancouverProductMetricsSettledResult.value,
                "Failed to generate Vancouver product metrics",
            );
        if (vancouverProductMetricsOption.none) {
            return;
        }

        const allLocationsAggregatedProductMetricsResult =
            createAllLocationsAggregatedProductMetricsSafe({
                calgaryProductMetrics: calgaryProductMetricsOption.val,
                edmontonProductMetrics: edmontonProductMetricsOption.val,
                vancouverProductMetrics: vancouverProductMetricsOption.val,
            });
        const allLocationsAggregatedProductMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                allLocationsAggregatedProductMetricsResult,
                "Failed to aggregate all locations product metrics",
            );
        if (allLocationsAggregatedProductMetricsOption.none) {
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setProductMetricsInCache(
                "All Locations",
                allLocationsAggregatedProductMetricsOption.val,
            );
        const setAllLocationsMetricsInCacheOption =
            handleErrorResultAndNoneOptionInWorker(
                setAllLocationsMetricsInCacheResult,
                "Failed to set All Locations product metrics in cache",
            );
        if (setAllLocationsMetricsInCacheOption.none) {
            return;
        }

        // for financial metrics generation
        const setProductMetricsCacheResult = await setCachedItemAsyncSafe(
            "productMetrics",
            {
                Calgary: calgaryProductMetricsOption.val,
                Edmonton: edmontonProductMetricsOption.val,
                Vancouver: vancouverProductMetricsOption.val,
                "All Locations": allLocationsAggregatedProductMetricsOption.val,
            },
        );
        if (setProductMetricsCacheResult.err) {
            self.postMessage(setProductMetricsCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult(true),
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
    MessageEventProductMetricsMainToWorker,
    MessageEventProductMetricsWorkerToMain,
};

function createProductMetricsDocument(
    metricCategory: "All Products" | ProductCategory,
    productMetrics: ProductYearlyMetric[],
    storeLocation: AllStoreLocations,
): ProductMetricsDocument {
    return {
        _id: createMetricsURLCacheKey({
            metricsUrl: METRICS_URL,
            metricsView: "products",
            productMetricCategory: metricCategory,
            repairMetricCategory: "All Repairs",
            storeLocation,
        }) ?? crypto.randomUUID(),
        __v: 0,
        createdAt: new Date().toISOString(),
        metricCategory,
        yearlyMetrics: productMetrics,
        storeLocation,
        updatedAt: new Date().toISOString(),
    };
}

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
                            createProductMetricsDocument(
                                name,
                                yearlyMetrics,
                                storeLocation,
                            ),
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

        const handledSettledResult = handlePromiseSettledResults(
            setItemResults,
        );
        if (handledSettledResult.err) {
            return handledSettledResult;
        }
        if (handledSettledResult.val.none) {
            return createSafeErrorResult("No product metrics set in cache");
        }

        return handledSettledResult;
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
