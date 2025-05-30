import { METRICS_URL, STORE_LOCATIONS } from "../../../constants";
import { ProductMetricsDocument, SafeResult } from "../../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
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
