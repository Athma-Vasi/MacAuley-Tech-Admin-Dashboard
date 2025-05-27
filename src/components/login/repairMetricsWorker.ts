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
import { AllStoreLocations, RepairMetric } from "../dashboard/types";
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
            calgaryRepairMetricsResult,
            edmontonRepairMetricsResult,
            vancouverRepairMetricsResult,
        ] = STORE_LOCATIONS.map(
            ({ value: storeLocation }) => {
                const defaultMetrics: RepairMetric[] = [];

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

                const repairMetricsResult = createRandomRepairMetricsSafe({
                    storeLocation,
                    daysInMonthsInYears,
                });
                if (repairMetricsResult.err || repairMetricsResult.val.none) {
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

                return createSafeSuccessResult([
                    ...repairMetricsResult.val.val,
                    aggregatedRepairMetricsResult.val.val,
                ]);
            },
        );

        if (
            calgaryRepairMetricsResult.err ||
            calgaryRepairMetricsResult.val.none ||
            edmontonRepairMetricsResult.err ||
            edmontonRepairMetricsResult.val.none ||
            vancouverRepairMetricsResult.err ||
            vancouverRepairMetricsResult.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to generate repair metrics"),
            );
            return;
        }

        const allLocationsAggregatedRepairMetrics =
            createAllLocationsAggregatedRepairMetricsSafe({
                calgaryRepairMetrics: calgaryRepairMetricsResult.val.val,
                edmontonRepairMetrics: edmontonRepairMetricsResult.val.val,
                vancouverRepairMetrics: vancouverRepairMetricsResult.val.val,
            });
        if (
            allLocationsAggregatedRepairMetrics.err ||
            allLocationsAggregatedRepairMetrics.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to aggregate repair metrics"),
            );
            return;
        }

        const setCalgaryMetricsInCacheResult = await setRepairMetricsInCache(
            "Calgary",
            calgaryRepairMetricsResult.val.val,
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
                    "No Calgary repair metrics set in cache",
                ),
            );
            return;
        }

        const setEdmontonMetricsInCacheResult = await setRepairMetricsInCache(
            "Edmonton",
            edmontonRepairMetricsResult.val.val,
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
                    "No Edmonton repair metrics set in cache",
                ),
            );
            return;
        }

        const setVancouverMetricsInCacheResult = await setRepairMetricsInCache(
            "Vancouver",
            vancouverRepairMetricsResult.val.val,
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
                    "No Vancouver repair metrics set in cache",
                ),
            );
            return;
        }

        const setAllLocationsMetricsInCacheResult =
            await setRepairMetricsInCache(
                "All Locations",
                allLocationsAggregatedRepairMetrics.val.val,
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

        self.postMessage(
            createSafeSuccessResult(
                "Successfully set repair metrics in cache for all locations",
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
