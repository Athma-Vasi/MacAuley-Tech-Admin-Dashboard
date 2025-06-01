import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    parseSyncSafe,
} from "../../../utils";
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
                "Error parsing input",
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
                "Error parsing input",
            );
            showBoundary(safeErrorResult);
            return safeErrorResult;
        }

        const {
            calendarChartsData,
            financialMetricsCharts,
            financialMetricsCards,
        } = messageEventResult.val.val;

        financialMetricsDispatch({
            action: financialMetricsAction.setCalendarChartsData,
            payload: calendarChartsData,
        });

        financialMetricsDispatch({
            action: financialMetricsAction.setCharts,
            payload: financialMetricsCharts,
        });

        financialMetricsDispatch({
            action: financialMetricsAction.setCards,
            payload: financialMetricsCards,
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
