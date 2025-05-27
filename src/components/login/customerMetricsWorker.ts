import { STORE_LOCATIONS } from "../../constants";
import { SafeResult } from "../../types";
import {
    createDaysInMonthsInYearsSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
} from "../../utils";
import { AllStoreLocations, CustomerMetrics } from "../dashboard/types";
import {
    createAllLocationsAggregatedCustomerMetricsSafe,
    createRandomCustomerMetricsSafe,
} from "./customerMetricsGen";

type MessageEventCustomerWorkerToMain = MessageEvent<
    SafeResult<
        Record<AllStoreLocations, CustomerMetrics>
    >
>;
type MessageEventCustomerMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventCustomerMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        const [
            calgaryCustomerMetricsResult,
            edmontonCustomerMetricsResult,
            vancouverCustomerMetricsResult,
        ] = STORE_LOCATIONS.map(
            ({ value: storeLocation }) => {
                const defaultMetrics: CustomerMetrics = {
                    lifetimeValue: 0,
                    totalCustomers: 0,
                    yearlyMetrics: [],
                };

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

                const customerMetrics = createRandomCustomerMetricsSafe({
                    storeLocation,
                    daysInMonthsInYears,
                });
                if (customerMetrics.err || customerMetrics.val.none) {
                    return createSafeErrorResult(defaultMetrics);
                }

                return customerMetrics;
            },
        );

        if (
            calgaryCustomerMetricsResult.err ||
            calgaryCustomerMetricsResult.val.none ||
            edmontonCustomerMetricsResult.err ||
            edmontonCustomerMetricsResult.val.none ||
            vancouverCustomerMetricsResult.err ||
            vancouverCustomerMetricsResult.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to generate customer metrics"),
            );
            return;
        }

        const allLocationsAggregatedCustomerMetrics =
            createAllLocationsAggregatedCustomerMetricsSafe({
                calgaryCustomerMetrics: calgaryCustomerMetricsResult.val.val,
                edmontonCustomerMetrics: edmontonCustomerMetricsResult.val.val,
                vancouverCustomerMetrics:
                    vancouverCustomerMetricsResult.val.val,
            });
        if (
            allLocationsAggregatedCustomerMetrics.err ||
            allLocationsAggregatedCustomerMetrics.val.none
        ) {
            self.postMessage(
                createSafeErrorResult("Failed to aggregate customer metrics"),
            );
            return;
        }

        self.postMessage(createSafeSuccessResult(
            {
                Calgary: calgaryCustomerMetricsResult.val.val,
                Edmonton: edmontonCustomerMetricsResult.val.val,
                Vancouver: vancouverCustomerMetricsResult.val.val,
                "All Locations": allLocationsAggregatedCustomerMetrics.val.val,
            },
        ));
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
    MessageEventCustomerMainToWorker,
    MessageEventCustomerWorkerToMain,
};
