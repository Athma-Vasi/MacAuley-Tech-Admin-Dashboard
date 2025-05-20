import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
import { customerMetricsAction } from "./actions";
import { MessageEventCustomerWorkerToMain } from "./chartsWorker";
import { handleMessageEventCustomerWorkerToMainInputZod } from "./schemas";
import { CustomerMetricsDispatch } from "./types";

async function handleMessageEventCustomerWorkerToMain(input: {
    event: MessageEventCustomerWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    customerMetricsDispatch: React.Dispatch<CustomerMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventCustomerWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createSafeBoxResult({
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
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeBoxResult({
                data: Some("No data in message event"),
            });
        }

        if (messageEventResult.err || messageEventResult.val.data.none) {
            showBoundary(messageEventResult.val.data);
            return createSafeBoxResult({
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

        return createSafeBoxResult({
            data: Some("Customer charts and cards updated successfully"),
            kind: "success",
        });
    } catch (error: unknown) {
        if (
            !input.isComponentMountedRef.current
        ) {
            return createSafeBoxResult({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
        return createSafeBoxResult({
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
