import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
import { financialMetricsAction } from "./actions";
import { MessageEventFinancialWorkerToMain } from "./chartsWorker";
import { handleMessageEventFinancialWorkerToMainInputZod } from "./schemas";
import { FinancialMetricsDispatch } from "./types";

async function handleMessageEventFinancialWorkerToMain(input: {
    event: MessageEventFinancialWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    financialMetricsDispatch: React.Dispatch<FinancialMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventFinancialWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createSafeBoxResult({
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

        return createSafeBoxResult({
            data: Some("Data processed successfully"),
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

export { handleMessageEventFinancialWorkerToMain };
