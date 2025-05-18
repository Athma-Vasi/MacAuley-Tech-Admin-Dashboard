import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
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
            financialMetricsCharts,
            financialMetricsCards,
        } = messageEventResult.val.data.val;

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
            data: Some("Data processed successfully"),
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

export { handleMessageEventFinancialWorkerToMain };
