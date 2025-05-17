import { Some } from "ts-results";
import { createResultSafeBox } from "../../../utils";
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
        console.log("Customer Worker received message:", event.data);

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some(new Error("Component unmounted")),
            });
        }

        const { err, val } = event.data;

        if (err) {
            showBoundary(val);

            return createResultSafeBox({
                data: Some(val),
                message: val.message,
            });
        }

        if (val.data.none) {
            const error = new Error("No data from worker");
            showBoundary(error);

            return createResultSafeBox({
                data: Some(error),
            });
        }

        const {
            currentYear,
            previousYear,
            customerMetricsCharts,
            customerMetricsCards,
        } = val.data.val;

        if (!isComponentMountedRef.current) {
            return;
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

        customerMetricsDispatch({
            action: customerMetricsAction.setCards,
            payload: customerMetricsCards,
        });

        return createResultSafeBox({
            data: event.data.val.data,
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some(new Error("Component unmounted")),
            });
        }

        showBoundary(error);
        return createResultSafeBox({
            data: Some(error),
            message: Some("Error in worker"),
        });
    }
}

export { handleMessageEventCustomerWorkerToMain };
