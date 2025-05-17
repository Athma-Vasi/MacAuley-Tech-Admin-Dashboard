import { Some } from "ts-results";
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
}) {
    try {
        console.log("Repair Worker received message:", event.data);

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some(new Error("Component unmounted")),
            });
        }

        const { err, val } = event.data;

        if (err) {
            showBoundary(val);

            return createResultSafeBox({
                data: Some(val),
                message: val.message,
            });
        }

        if (val.data.none) {
            const error = new Error("No data from worker");
            showBoundary(error);

            return createResultSafeBox({
                data: Some(error),
            });
        }

        const {
            currentYear,
            previousYear,
            repairMetricsCharts,
            repairMetricsCards,
        } = val.data.val;

        if (!isComponentMountedRef.current) {
            return;
        }

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
            data: event.data.val.data,
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some(new Error("Component unmounted")),
            });
        }

        showBoundary(error);
        return createResultSafeBox({
            data: Some(error),
            message: Some("Error in worker"),
        });
    }
}

export { handleMessageEventRepairWorkerToMain };
