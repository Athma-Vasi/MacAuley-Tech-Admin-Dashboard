import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
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
}): Promise<ResultSafeBox<string>> {
    try {
        const messageEventResult = event.data;
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createResultSafeBox({
                data: messageEventResult.val.data,
                message: messageEventResult.val.message,
            });
        }

        const {
            currentYear,
            previousYear,
            customerMetricsCharts,
            customerMetricsCards,
        } = messageEventResult.val.data.val;

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
            data: Some("Customer charts and cards updated successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        showBoundary(error);
        return createResultSafeBox({
            data: Some(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Unknown error",
            ),
        });
    }
}

export { handleMessageEventCustomerWorkerToMain };
