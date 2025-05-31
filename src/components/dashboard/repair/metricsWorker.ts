import { METRICS_URL, STORE_LOCATIONS } from "../../../constants";
import { RepairMetricsDocument, SafeResult } from "../../../types";
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
    RepairCategory,
    RepairMetric,
    RepairYearlyMetric,
} from "../types";
import {
    createAllLocationsAggregatedRepairMetricsSafe,
    createAllRepairsAggregatedRepairMetricsSafe,
    createRandomRepairMetricsSafe,
} from "./generators";

type MessageEventRepairMetricsWorkerToMain = MessageEvent<
    SafeResult<boolean>
>;
type MessageEventRepairMetricsMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventRepairMetricsMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        const [
            calgaryRepairMetricsSettledResult,
            edmontonRepairMetricsSettledResult,
            vancouverRepairMetricsSettledResult,
        ] = await Promise.allSettled(
            STORE_LOCATIONS.map(async ({ value: storeLocation }) => {
                try {
                    const defaultMetrics: RepairMetric[] = [];

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

                    const repairMetricsResult = createRandomRepairMetricsSafe(
                        {
                            storeLocation,
                            daysInMonthsInYears,
                        },
                    );
                    if (repairMetricsResult.err) {
                        return repairMetricsResult;
                    }
                    if (repairMetricsResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const aggregatedRepairMetricsResult =
                        createAllRepairsAggregatedRepairMetricsSafe(
                            repairMetricsResult.val.val,
                        );
                    if (aggregatedRepairMetricsResult.err) {
                        return aggregatedRepairMetricsResult;
                    }
                    if (aggregatedRepairMetricsResult.val.none) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const concatenatedMetrics = [
                        ...repairMetricsResult.val.val,
                        aggregatedRepairMetricsResult.val.val,
                    ];

                    const setMetricsInCacheResult =
                        await setRepairMetricsInCache(
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

        if (calgaryRepairMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    calgaryRepairMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const calgaryRepairMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                calgaryRepairMetricsSettledResult.value,
                "Failed to generate Calgary repair metrics",
            );
        if (calgaryRepairMetricsOption.none) {
            return;
        }

        if (edmontonRepairMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    edmontonRepairMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const edmontonRepairMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                edmontonRepairMetricsSettledResult.value,
                "Failed to generate Edmonton repair metrics",
            );
        if (edmontonRepairMetricsOption.none) {
            return;
        }

        if (vancouverRepairMetricsSettledResult.status === "rejected") {
            self.postMessage(
                createSafeErrorResult(
                    vancouverRepairMetricsSettledResult.reason,
                ),
            );
            return;
        }
        const vancouverRepairMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                vancouverRepairMetricsSettledResult.value,
                "Failed to generate Vancouver repair metrics",
            );
        if (vancouverRepairMetricsOption.none) {
            return;
        }

        const allLocationsAggregatedRepairMetricsResult =
            createAllLocationsAggregatedRepairMetricsSafe({
                calgaryRepairMetrics: calgaryRepairMetricsOption.val,
                edmontonRepairMetrics: edmontonRepairMetricsOption.val,
                vancouverRepairMetrics: vancouverRepairMetricsOption.val,
            });
        const allLocationsAggregatedRepairMetricsOption =
            handleErrorResultAndNoneOptionInWorker(
                allLocationsAggregatedRepairMetricsResult,
                "Failed to aggregate all locations repair metrics",
            );
        if (allLocationsAggregatedRepairMetricsOption.none) {
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setRepairMetricsInCache(
                "All Locations",
                allLocationsAggregatedRepairMetricsOption.val,
            );
        const setAllLocationsMetricsInCacheOption =
            handleErrorResultAndNoneOptionInWorker(
                setAllLocationsMetricsInCacheResult,
                "Failed to set All Locations repair metrics in cache",
            );
        if (setAllLocationsMetricsInCacheOption.none) {
            return;
        }

        // for financial metrics generation
        const setRepairMetricsCacheResult = await setCachedItemAsyncSafe(
            "repairMetrics",
            {
                Calgary: calgaryRepairMetricsOption.val,
                Edmonton: edmontonRepairMetricsOption.val,
                Vancouver: vancouverRepairMetricsOption.val,
                "All Locations": allLocationsAggregatedRepairMetricsOption.val,
            },
        );
        if (setRepairMetricsCacheResult.err) {
            self.postMessage(setRepairMetricsCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult(true),
        );
    } catch (error) {
        console.error("Repair Charts Worker error:", error);
        self.postMessage(
            createSafeErrorResult(error),
        );
    }
};

self.onerror = (event: string | Event) => {
    console.error("Repair Charts Worker error:", event);
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
    MessageEventRepairMetricsMainToWorker,
    MessageEventRepairMetricsWorkerToMain,
};

function createRepairMetricsDocument(
    metricCategory: "All Repairs" | RepairCategory,
    repairMetrics: RepairYearlyMetric[],
    storeLocation: AllStoreLocations,
): RepairMetricsDocument {
    return {
        _id: createMetricsURLCacheKey({
            metricsUrl: METRICS_URL,
            metricsView: "repairs",
            productMetricCategory: "All Products",
            repairMetricCategory: metricCategory,
            storeLocation,
        }) ?? crypto.randomUUID(),
        __v: 0,
        createdAt: new Date().toISOString(),
        metricCategory,
        yearlyMetrics: repairMetrics,
        storeLocation,
        updatedAt: new Date().toISOString(),
    };
}

async function setRepairMetricsInCache(
    storeLocation: AllStoreLocations,
    metrics: RepairMetric[],
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
                                metricsView: "repairs",
                                productMetricCategory: "All Products",
                                repairMetricCategory: name,
                            },
                        );

                        const setItemResult = await setCachedItemAsyncSafe(
                            metricCacheKey,
                            createRepairMetricsDocument(
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
            return createSafeErrorResult("No repair metrics set in cache");
        }

        return handledSettledResult;
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
