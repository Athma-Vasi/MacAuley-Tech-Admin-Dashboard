import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    parseSyncSafe,
} from "../../../utils";
import { customerMetricsAction } from "./actions";
import { MessageEventCustomerChartsWorkerToMain } from "./chartsWorker";
import { handleMessageEventCustomerWorkerToMainInputZod } from "./schemas";
import { CustomerMetricsDispatch } from "./types";

async function handleMessageEventCustomerWorkerToMain(input: {
    event: MessageEventCustomerChartsWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    customerMetricsDispatch: React.Dispatch<CustomerMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventCustomerWorkerToMainInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            event,
            isComponentMountedRef,
            customerMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component unmounted",
            );
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult(
                "No data received",
            );
        }
        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing message event",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const {
            currentYear,
            previousYear,
            customerMetricsCharts,
            customerMetricsCards,
        } = messageEventResult.val.val;

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

        return createSafeSuccessResult(
            "Customer metrics charts and cards updated successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleMessageEventCustomerWorkerToMain };
