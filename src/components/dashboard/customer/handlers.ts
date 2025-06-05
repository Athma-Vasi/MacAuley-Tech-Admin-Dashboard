import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    makeTransition,
    parseSyncSafe,
} from "../../../utils";
import { InvariantError } from "../../error";
import { customerMetricsAction } from "./actions";
import { MessageEventCustomerChartsWorkerToMain } from "./chartsWorker";
import { handleMessageEventCustomerWorkerToMainInputZod } from "./schemas";
import { CustomerMetricsDispatch } from "./types";

async function handleMessageEventCustomerChartsWorkerToMain(input: {
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
                new InvariantError(
                    "Unexpected None option in input parsing",
                ),
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
                new InvariantError("Component is not mounted"),
            );
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult(
                new InvariantError("No data received from the worker"),
            );
        }
        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                new InvariantError(
                    "Unexpected None option in message event result",
                ),
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const {
            calendarChartsData,
            customerMetricsCharts,
            customerMetricsCards,
        } = messageEventResult.val.val;

        makeTransition(() => {
            customerMetricsDispatch({
                action: customerMetricsAction.setCalendarChartsData,
                payload: calendarChartsData,
            });
        });

        makeTransition(() => {
            customerMetricsDispatch({
                action: customerMetricsAction.setCharts,
                payload: customerMetricsCharts,
            });
        });

        makeTransition(() => {
            customerMetricsDispatch({
                action: customerMetricsAction.setCards,
                payload: customerMetricsCards,
            });
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

export { handleMessageEventCustomerChartsWorkerToMain };
