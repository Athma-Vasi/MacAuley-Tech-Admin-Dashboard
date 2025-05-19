import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import { createResultSafeBox, parseSafeSync } from "../../../utils";
import { MessageEventCustomerWorkerToMain } from "../../../workers/customerChartsWorker";
import { customerMetricsAction } from "./actions";
import { handleMessageEventCustomerWorkerToMainInputZod } from "./schemas";
import { CustomerMetricsDispatch } from "./types";

async function handleMessageEventCustomerWorkerToMain(input: {
    event: MessageEventCustomerWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    customerMetricsDispatch: React.Dispatch<CustomerMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleMessageEventCustomerWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            event,
            isComponentMountedRef,
            customerMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createResultSafeBox({
                data: Some("No data in message event"),
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
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
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
