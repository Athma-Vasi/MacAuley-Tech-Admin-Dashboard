import { createSafeBoxResult } from "../../../utils";
import { MessageEventCustomerWorkerToMain } from "../../../workers/customerChartsWorker";
import { customerMetricsAction } from "./actions";
import { CustomerMetricsDispatch } from "./types";

async function handleMessageEventCustomerWorkerToMain({
    event,
    isComponentMountedRef,
    customerMetricsDispatch,
    showBoundary,
}: {
    event: MessageEventCustomerWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    customerMetricsDispatch: React.Dispatch<CustomerMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}) {
    try {
        console.log("Worker received message:", event.data);

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (event.data.err) {
            showBoundary(event.data.val.data);
            return createSafeBoxResult({
                message: event.data.val.message ?? "Error fetching response",
            });
        }

        console.log("event.data.val.data", event.data.val.data);

        const dataUnwrapped = event.data.val.data;
        if (dataUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        console.log({ dataUnwrapped });

        const { currentYear, previousYear, customerMetricsCharts } =
            dataUnwrapped;

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        customerMetricsDispatch({
            action: customerMetricsAction.setCalendarChartsData,
            payload: {
                currentYear,
                previousYear,
            },
        });

        customerMetricsDispatch({
            action: customerMetricsAction.setCharts,
            payload: customerMetricsCharts,
        });

        return createSafeBoxResult({
            data: true,
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                data: error,
                kind: "error",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            data: error,
            kind: "error",
        });
    }
}

export { handleMessageEventCustomerWorkerToMain };
