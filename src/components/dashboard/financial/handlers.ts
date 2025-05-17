import { Some } from "ts-results";
import { createResultSafeBox } from "../../../utils";
import { MessageEventFinancialWorkerToMain } from "../../../workers/financialChartsWorker";
import { financialMetricsAction } from "./actions";
import { FinancialMetricsDispatch } from "./types";

async function handleMessageEventFinancialWorkerToMain({
    event,
    isComponentMountedRef,
    financialMetricsDispatch,
    showBoundary,
}: {
    event: MessageEventFinancialWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    financialMetricsDispatch: React.Dispatch<FinancialMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}) {
    try {
        console.log("Financial Worker received message:", event.data);

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
            financialMetricsCharts,
            financialMetricsCards,
        } = val.data.val;

        if (!isComponentMountedRef.current) {
            return;
        }

        financialMetricsDispatch({
            action: financialMetricsAction.setCalendarChartsData,
            payload: {
                currentYear,
                previousYear,
            },
        });

        financialMetricsDispatch({
            action: financialMetricsAction.setCharts,
            payload: financialMetricsCharts,
        });

        financialMetricsDispatch({
            action: financialMetricsAction.setCards,
            payload: financialMetricsCards,
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

export { handleMessageEventFinancialWorkerToMain };
