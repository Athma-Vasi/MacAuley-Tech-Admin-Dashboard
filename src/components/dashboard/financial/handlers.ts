import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import { createResultSafeBox, parseSafeSync } from "../../../utils";
import { financialMetricsAction } from "./actions";
import { MessageEventFinancialWorkerToMain } from "./chartsWorker";
import { handleMessageEventFinancialWorkerToMainInputZod } from "./schemas";
import { FinancialMetricsDispatch } from "./types";

async function handleMessageEventFinancialWorkerToMain(input: {
    event: MessageEventFinancialWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    financialMetricsDispatch: React.Dispatch<FinancialMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleMessageEventFinancialWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            event,
            isComponentMountedRef,
            financialMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.data.val;

        if (!isComponentMountedRef.current) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createResultSafeBox({
                data: Some("No data in message event"),
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
            !input.isComponentMountedRef.current
        ) {
            return createResultSafeBox({
                data: Some("Component unmounted"),
            });
        }

        input.showBoundary(error);
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
