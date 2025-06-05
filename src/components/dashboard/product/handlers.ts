import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    makeTransition,
    parseSyncSafe,
} from "../../../utils";
import { InvariantError } from "../../error";
import { productMetricsAction } from "./actions";
import { MessageEventProductChartsWorkerToMain } from "./chartsWorker";
import { handleMessageEventProductChartsWorkerToMainInputZod } from "./schemas";
import { ProductMetricsDispatch } from "./types";

async function handleMessageEventProductChartsWorkerToMain(input: {
    event: MessageEventProductChartsWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    productMetricsDispatch: React.Dispatch<ProductMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventProductChartsWorkerToMainInputZod,
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
            productMetricsDispatch,
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
            return createSafeErrorResult(
                new InvariantError("Error parsing message event"),
            );
        }

        const {
            calendarChartsData,
            productMetricsCharts,
            productMetricsCards,
        } = messageEventResult.val.val;

        makeTransition(() => {
            productMetricsDispatch({
                action: productMetricsAction.setCalendarChartsData,
                payload: calendarChartsData,
            });
        });

        makeTransition(() => {
            productMetricsDispatch({
                action: productMetricsAction.setCharts,
                payload: productMetricsCharts,
            });
        });

        makeTransition(() => {
            productMetricsDispatch({
                action: productMetricsAction.setCards,
                payload: productMetricsCards,
            });
        });

        return createSafeSuccessResult(
            "Product metrics charts and cards updated successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleMessageEventProductChartsWorkerToMain };
