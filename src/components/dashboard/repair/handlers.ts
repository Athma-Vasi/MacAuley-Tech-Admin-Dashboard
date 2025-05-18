import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import { createResultSafeBox } from "../../../utils";
import { MessageEventRepairWorkerToMain } from "../../../workers/repairChartsWorker";
import { repairMetricsAction } from "./actions";
import { RepairMetricsDispatch } from "./types";

async function handleMessageEventRepairWorkerToMain({
    event,
    isComponentMountedRef,
    repairMetricsDispatch,
    showBoundary,
}: {
    event: MessageEventRepairWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    repairMetricsDispatch: React.Dispatch<RepairMetricsDispatch>;
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

        return createResultSafeBox({
            data: Some("Repair metrics charts updated"),
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

export { handleMessageEventRepairWorkerToMain };
