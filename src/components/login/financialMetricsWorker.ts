import { SafeResult } from "../../types";
import { createSafeErrorResult } from "../../utils";
import { AllStoreLocations, YearlyFinancialMetric } from "../dashboard/types";

type MessageEventFinancialWorkerToMain = MessageEvent<
    SafeResult<
        {
            financialMetrics: Array<
                {
                    storeLocation: AllStoreLocations;
                    financialMetrics: YearlyFinancialMetric[];
                }
            >;
        }
    >
>;
type MessageEventFinancialMainToWorker = MessageEvent<
    boolean
>;

self.onmessage = async (
    event: MessageEventFinancialMainToWorker,
) => {
    if (!event.data) {
        self.postMessage(
            createSafeErrorResult("No data received"),
        );
        return;
    }

    try {
        //
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
    MessageEventFinancialMainToWorker,
    MessageEventFinancialWorkerToMain,
};
