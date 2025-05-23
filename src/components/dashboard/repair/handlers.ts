import { ResultSafeBox } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    parseSyncSafe,
} from "../../../utils";
import { repairMetricsAction } from "./actions";
import { MessageEventRepairWorkerToMain } from "./chartsWorker";
import { handleMessageEventRepairWorkerToMainInputZod } from "./schemas";
import { RepairMetricsDispatch } from "./types";

async function handleMessageEventRepairWorkerToMain(input: {
    event: MessageEventRepairWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    repairMetricsDispatch: React.Dispatch<RepairMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventRepairWorkerToMainInputZod,
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
            repairMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.safeUnwrap();

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult(
                "Component unmounted",
            );
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            const safeErrorResult = createSafeErrorResult(
                "No data received",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
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
            repairMetricsCharts,
            repairMetricsCards,
        } = messageEventResult.val.safeUnwrap();

        repairMetricsDispatch({
            action: repairMetricsAction.setCalendarChartsData,
            payload: {
                currentYear,
                previousYear,
            },
        });

        repairMetricsDispatch({
            action: repairMetricsAction.setCharts,
            payload: repairMetricsCharts,
        });

        repairMetricsDispatch({
            action: repairMetricsAction.setCards,
            payload: repairMetricsCards,
        });

        return createSafeSuccessResult(
            "Repair metrics data updated successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleMessageEventRepairWorkerToMain };
