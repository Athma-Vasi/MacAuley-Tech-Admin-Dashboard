import { STORE_LOCATIONS } from "../../constants";
import { SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
} from "../../utils";
import { AllStoreLocations, RepairMetric } from "../dashboard/types";
import {
    createAllLocationsAggregatedRepairMetricsSafe,
    createAllRepairsAggregatedRepairMetricsSafe,
    createRandomRepairMetricsSafe,
} from "./repairMetricsGen";

type MessageEventRepairWorkerToMain = MessageEvent<
    SafeResult<
        Record<AllStoreLocations, RepairMetric[]>
    >
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

        self.postMessage(createSafeSuccessResult(
            {
                Calgary: calgaryRepairMetricsResult.val.val,
                Edmonton: edmontonRepairMetricsResult.val.val,
                Vancouver: vancouverRepairMetricsResult.val.val,
                "All Locations": allLocationsAggregatedRepairMetrics.val.val,
            },
        ));
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
