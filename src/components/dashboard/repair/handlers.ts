import { createSafeBoxResult } from "../../../utils";
import { repairMetricsAction } from "./actions";
import { MessageEventRepairWorkerToMain, RepairMetricsDispatch } from "./types";

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
        console.log("Worker received message:", event.data);

        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                message: "Component unmounted",
            });
        }

        if (event.data.err) {
            showBoundary(event.data.val.data);
            return createSafeBoxResult({
                message: event.data.val.message ?? "Error fetching response",
            });
        }

        console.log("event.data.val.data", event.data.val.data);

        const dataUnwrapped = event.data.val.data;
        if (dataUnwrapped === undefined) {
            showBoundary(new Error("No data returned from server"));
            return createSafeBoxResult({
                message: "Response is undefined",
            });
        }

        console.log({ dataUnwrapped });

        const { currentYear, previousYear, repairMetricsCharts } =
            dataUnwrapped;

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
            action: repairMetricsAction.setIsGenerating,
            payload: false,
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return;
        }

        showBoundary(error);
    }
}

export { handleMessageEventRepairWorkerToMain };
