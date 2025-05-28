import { Err, Ok, Option } from "ts-results";
import { METRICS_URL, STORE_LOCATIONS } from "../../constants";
import { RepairMetricsDocument, SafeError, SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createMetricsURLCacheKey,
    createSafeErrorResult,
    createSafeSuccessResult,
    setCachedItemAsyncSafe,
} from "../../utils";
import {
    AllStoreLocations,
    RepairCategory,
    RepairMetric,
    RepairYearlyMetric,
} from "../dashboard/types";
import {
    createAllLocationsAggregatedRepairMetricsSafe,
    createAllRepairsAggregatedRepairMetricsSafe,
    createRandomRepairMetricsSafe,
} from "./repairMetricsGen";

type MessageEventRepairWorkerToMain = MessageEvent<
    SafeResult<string>
>;
type MessageEventRepairMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventRepairMainToWorker,
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
                    if (
                        daysInMonthsInYearsResult.err ||
                        daysInMonthsInYearsResult.val.none
                    ) {
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
                    if (
                        repairMetricsResult.err ||
                        repairMetricsResult.val.none
                    ) {
                        return createSafeErrorResult(defaultMetrics);
                    }

                    const aggregatedRepairMetricsResult =
                        createAllRepairsAggregatedRepairMetricsSafe(
                            repairMetricsResult.val.val,
                        );
                    if (
                        aggregatedRepairMetricsResult.err ||
                        aggregatedRepairMetricsResult.val.none
                    ) {
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

        if (
            calgaryRepairMetricsSettledResult.status === "rejected" ||
            edmontonRepairMetricsSettledResult.status === "rejected" ||
            vancouverRepairMetricsSettledResult.status === "rejected"
        ) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate repair metrics",
                ),
            );
            return;
        }

        if (calgaryRepairMetricsSettledResult.value.err) {
            self.postMessage(calgaryRepairMetricsSettledResult.value);
            return;
        }
        if (calgaryRepairMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Calgary repair metrics",
                ),
            );
            return;
        }
        const calgaryRepairMetrics =
            calgaryRepairMetricsSettledResult.value.val.val;

        if (edmontonRepairMetricsSettledResult.value.err) {
            self.postMessage(edmontonRepairMetricsSettledResult.value);
            return;
        }
        if (edmontonRepairMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    "Failed to generate Edmonton repair metrics",
                ),
            );
            return;
        }
        const edmontonRepairMetrics =
            edmontonRepairMetricsSettledResult.value.val.val;

        if (vancouverRepairMetricsSettledResult.value.err) {
            self.postMessage(vancouverRepairMetricsSettledResult.value);
            return;
        }
        if (vancouverRepairMetricsSettledResult.value.val.none) {
            self.postMessage(
                createSafeErrorResult(
                    true,
                ),
            );
            return;
        }
        const vancouverRepairMetrics =
            vancouverRepairMetricsSettledResult.value.val.val;

        const allLocationsAggregatedRepairMetricsResult =
            createAllLocationsAggregatedRepairMetricsSafe({
                calgaryRepairMetrics,
                edmontonRepairMetrics,
                vancouverRepairMetrics,
            });

        if (allLocationsAggregatedRepairMetricsResult.err) {
            self.postMessage(allLocationsAggregatedRepairMetricsResult);
            return;
        }
        if (allLocationsAggregatedRepairMetricsResult.val.none) {
            self.postMessage(
                createSafeErrorResult("Failed to aggregate repair metrics"),
            );
            return;
        }
        const allLocationsAggregatedRepairMetrics =
            allLocationsAggregatedRepairMetricsResult.val.val;

        const setAllLocationsMetricsInCacheResult =
            await setRepairMetricsInCache(
                "All Locations",
                allLocationsAggregatedRepairMetricsResult.val.val,
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
                    "No All Locations repair metrics set in cache",
                ),
            );
            return;
        }

        // for financial metrics generation
        const setRepairMetricsCacheResult = await setCachedItemAsyncSafe(
            "repairMetrics",
            {
                Calgary: calgaryRepairMetrics,
                Edmonton: edmontonRepairMetrics,
                Vancouver: vancouverRepairMetrics,
                "All Locations": allLocationsAggregatedRepairMetrics,
            },
        );
        if (setRepairMetricsCacheResult.err) {
            self.postMessage(setRepairMetricsCacheResult);
            return;
        }

        self.postMessage(
            createSafeSuccessResult(
                true,
            ),
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

export type { MessageEventRepairMainToWorker, MessageEventRepairWorkerToMain };

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
                `Failed to set some repair metrics in cache: ${
                    errors.map(
                        (error) => error.val,
                    ).join(", ")
                }`,
            );
        }

        if (sucesses.length === 0) {
            return createSafeErrorResult(
                "No repair metrics set in cache",
            );
        }

        return createSafeSuccessResult(
            `Successfully set ${sucesses.length} repair metrics in cache`,
        );
    } catch (error: unknown) {
        return createSafeErrorResult(error);
    }
}
