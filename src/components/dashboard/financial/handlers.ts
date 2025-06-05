import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    makeTransition,
    parseSyncSafe,
} from "../../../utils";
import { InvariantError } from "../../error";
import { financialMetricsAction } from "./actions";
import { MessageEventFinancialChartsWorkerToMain } from "./chartsWorker";
import { handleMessageEventFinancialWorkerToMainInputZod } from "./schemas";
import { FinancialMetricsDispatch } from "./types";

async function handleMessageEventFinancialChartsWorkerToMain(input: {
    event: MessageEventFinancialChartsWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    financialMetricsDispatch: React.Dispatch<FinancialMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventFinancialWorkerToMainInputZod,
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
            financialMetricsDispatch,
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
                    "Unexpected None option in  message event result",
                ),
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const {
            calendarChartsData,
            financialMetricsCharts,
            financialMetricsCards,
        } = messageEventResult.val.val;

        makeTransition(() => {
            financialMetricsDispatch({
                action: financialMetricsAction.setCalendarChartsData,
                payload: calendarChartsData,
            });
        });

        makeTransition(() => {
            financialMetricsDispatch({
                action: financialMetricsAction.setCharts,
                payload: financialMetricsCharts,
            });
        });

        makeTransition(() => {
            financialMetricsDispatch({
                action: financialMetricsAction.setCards,
                payload: financialMetricsCards,
            });
        });

        return createSafeSuccessResult(
            "Message event handled successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleMessageEventFinancialChartsWorkerToMain };
