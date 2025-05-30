import { ALL_STORE_LOCATIONS_DATA, METRICS_URL } from "../../../constants";
import {
    FinancialMetricsDocument,
    SafeResult,
    StoreLocation,
} from "../../../types";
import {
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    getCachedItemAsyncSafe,
    handlePromiseSettledResults,
    removeCachedItemAsyncSafe,
    setCachedItemAsyncSafe,
} from "../../../utils";
import {
    AllStoreLocations,
    BusinessMetric,
    CustomerMetrics,
    ProductMetric,
    RepairMetric,
    YearlyFinancialMetric,
} from "../types";
import {
    createAllLocationsAggregatedFinancialMetricsSafe,
    createRandomFinancialMetricsSafe,
} from "./generators";

type MessageEventFinancialMetricsWorkerToMain = MessageEvent<
    SafeResult<
        boolean
    >
>;
type MessageEventFinancialMetricsMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventFinancialMetricsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        const getProductMetricsCacheResult = await getCachedItemAsyncSafe<
            Record<AllStoreLocations, ProductMetric[]>
        >(
            "productMetrics",
        );
        if (getProductMetricsCacheResult.err) {
            self.postMessage(
                createSafeErrorResult(getProductMetricsCacheResult),
            );
            return;
        }
        if (getProductMetricsCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No product metrics found in cache",
                ),
            );
            return;
        }
        const productMetrics = getProductMetricsCacheResult.val.val;

        const getRepairMetricsCacheResult = await getCachedItemAsyncSafe<
            Record<AllStoreLocations, RepairMetric[]>
        >(
            "repairMetrics",
        );
        if (getRepairMetricsCacheResult.err) {
            self.postMessage(
                createSafeErrorResult(getRepairMetricsCacheResult),
            );
            return;
        }
        if (getRepairMetricsCacheResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "No repair metrics found in cache",
                ),
            );
            return;
        }
        const repairMetrics = getRepairMetricsCacheResult.val.val;

        const businessMetrics: BusinessMetric[] = ALL_STORE_LOCATIONS_DATA.map(
            ({ value: storeLocation }) => {
                const productMetricsForLocation =
                    productMetrics[storeLocation] ?? [];
                const repairMetricsForLocation = repairMetrics[storeLocation] ??
                    [];

                return {
                    storeLocation,
                    financialMetrics: [] as YearlyFinancialMetric[],
                    customerMetrics: {} as CustomerMetrics,
                    productMetrics: productMetricsForLocation,
                    repairMetrics: repairMetricsForLocation,
                };
            },
        );

        const financialMetricsResult = createRandomFinancialMetricsSafe(
            businessMetrics,
        );
        if (financialMetricsResult.err) {
            self.postMessage(
                createSafeErrorResult(financialMetricsResult),
            );
            return;
        }
        if (financialMetricsResult.val.none) {
            self.postMessage(
                createSafeErrorResult("No financial metrics generated"),
            );
            return;
        }

        // empty 'All Locations' financial metrics atm
        const businessMetricsWithIncompleteFinancials = financialMetricsResult
            .val.val.reduce<
            BusinessMetric[]
        >((businessMetricsAcc, tuple) => {
            const [storeLocation, financialMetrics] = tuple as [
                StoreLocation,
                YearlyFinancialMetric[],
            ];

            const businessMetric = businessMetrics.find(
                (businessMetric) =>
                    businessMetric.storeLocation === storeLocation,
            );

            if (businessMetric) {
                businessMetric.financialMetrics = financialMetrics;
            }

            return businessMetricsAcc;
        }, businessMetrics);

        // aggregate financial metrics for each store location into 'All Locations' metrics
        const allLocationsAggregatedFinancialMetrics =
            createAllLocationsAggregatedFinancialMetricsSafe(
                businessMetricsWithIncompleteFinancials,
            );
        if (allLocationsAggregatedFinancialMetrics.err) {
            self.postMessage(
                createSafeErrorResult(
                    allLocationsAggregatedFinancialMetrics,
                ),
            );
            return;
        }
        if (
            allLocationsAggregatedFinancialMetrics.val.none
        ) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to aggregate financial metrics for All Locations",
                ),
            );
            return;
        }

        const completeFinancials = businessMetricsWithIncompleteFinancials
            .map(
                (businessMetric) => {
                    if (businessMetric.storeLocation === "All Locations") {
                        businessMetric.financialMetrics =
                            allLocationsAggregatedFinancialMetrics.val.none
                                ? []
                                : allLocationsAggregatedFinancialMetrics.val
                                    .val;
                    }
                    return businessMetric;
                },
            );

        const setItemsInCacheResults = await Promise.allSettled(
            completeFinancials.map(
                async ({ storeLocation, financialMetrics }) => {
                    try {
                        const setMetricsResult =
                            await setFinancialMetricsInCache(
                                storeLocation,
                                financialMetrics,
                            );
                        if (setMetricsResult.err) {
                            return setMetricsResult;
                        }
                        if (setMetricsResult.val.none) {
                            return createSafeErrorResult(
                                `Failed to cache financial metrics for ${storeLocation}`,
                            );
                        }
                        return createSafeSuccessResult(
                            `Financial metrics for ${storeLocation} successfully cached`,
                        );
                    } catch (error: unknown) {
                        return createSafeErrorResult(error);
                    }
                },
            ),
        );

        const handledSettledResult = handlePromiseSettledResults(
            setItemsInCacheResults,
        );
        if (handledSettledResult.err) {
            self.postMessage(
                createSafeErrorResult(handledSettledResult),
            );
            return;
        }
        if (handledSettledResult.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Unable to set financial metrics in cache",
                ),
            );
            return;
        }

        const removeProductMetricsCacheResult = await removeCachedItemAsyncSafe(
            "productMetrics",
        );
        if (removeProductMetricsCacheResult.err) {
            self.postMessage(removeProductMetricsCacheResult);
            return;
        }

        const removeRepairMetricsCacheResult = await removeCachedItemAsyncSafe(
            "repairMetrics",
        );
        if (removeRepairMetricsCacheResult.err) {
            self.postMessage(removeRepairMetricsCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult(true),
        );
        return;
    } catch (error) {
        console.error("Financial Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Financial Charts Worker error:", event);
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
    MessageEventFinancialMetricsMainToWorker,
    MessageEventFinancialMetricsWorkerToMain,
};

function createFinancialMetricsDocument(
    storeLocation: AllStoreLocations,
    financialMetrics: YearlyFinancialMetric[],
): FinancialMetricsDocument {
    return {
        _id: createMetricsURLCacheKey({
            metricsUrl: METRICS_URL,
            metricsView: "financials",
            productMetricCategory: "All Products",
            repairMetricCategory: "All Repairs",
            storeLocation,
        }) ?? crypto.randomUUID(),
        __v: 0,
        createdAt: new Date().toISOString(),
        financialMetrics,
        storeLocation,
        updatedAt: new Date().toISOString(),
    };
}

async function setFinancialMetricsInCache(
    storeLocation: AllStoreLocations,
    metrics: YearlyFinancialMetric[],
): Promise<SafeResult<string>> {
    try {
        const metricCacheKey = createMetricsURLCacheKey(
            {
                metricsUrl: METRICS_URL,
                storeLocation,
                metricsView: "financials",
                productMetricCategory: "All Products",
                repairMetricCategory: "All Repairs",
            },
        );
        const setMetricsResult = await setCachedItemAsyncSafe(
            metricCacheKey,
            createFinancialMetricsDocument(
                storeLocation,
                metrics,
            ),
        );
        if (setMetricsResult.err) {
            return setMetricsResult;
        }

        return createSafeSuccessResult(
            `Financial metrics for ${storeLocation} successfully cached`,
        );
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
