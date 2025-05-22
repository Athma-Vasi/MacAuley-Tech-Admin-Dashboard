import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
import { repairMetricsAction } from "./actions";
import { MessageEventRepairWorkerToMain } from "./chartsWorker";
import { handleMessageEventRepairWorkerToMainInputZod } from "./schemas";
import { RepairMetricsDispatch } from "./types";

async function handleMessageEventRepairWorkerToMain(input: {
    event: MessageEventRepairWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    repairMetricsDispatch: React.Dispatch<RepairMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventRepairWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.none) {
            return createSafeBoxResult({
                data: Some("Error parsing input"),
            });
        }

        const {
            event,
            isComponentMountedRef,
            repairMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.safeUnwrap();

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
            repairMetricsCharts,
            repairMetricsCards,
        } = messageEventResult.val.data.val;

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

        return createSafeBoxResult({
            data: Some("Repair metrics charts updated"),
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

export { handleMessageEventRepairWorkerToMain };
