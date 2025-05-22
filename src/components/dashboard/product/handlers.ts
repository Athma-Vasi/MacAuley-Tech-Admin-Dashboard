import { Some } from "ts-results";
import { SafeBoxResult } from "../../../types";
import { createSafeBoxResult, parseSyncSafe } from "../../../utils";
import { productMetricsAction } from "./actions";
import { MessageEventProductWorkerToMain } from "./chartsWorker";
import { handleMessageEventProductWorkerToMainInputZod } from "./schemas";
import { ProductMetricsDispatch } from "./types";

async function handleMessageEventProductWorkerToMain(input: {
    event: MessageEventProductWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    productMetricsDispatch: React.Dispatch<ProductMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeBoxResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventProductWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.none) {
            return createSafeBoxResult({
                data: Some("Error parsing input"),
            });
        }

        const {
            event,
            isComponentMountedRef,
            productMetricsDispatch,
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
            productMetricsCharts,
            productMetricsCards,
        } = messageEventResult.val.data.val;

        productMetricsDispatch({
            action: productMetricsAction.setCalendarChartsData,
            payload: {
                currentYear,
                previousYear,
            },
        });

        productMetricsDispatch({
            action: productMetricsAction.setCharts,
            payload: productMetricsCharts,
        });

        productMetricsDispatch({
            action: productMetricsAction.setCards,
            payload: productMetricsCards,
        });

        return createSafeBoxResult({
            data: Some("Product metrics charts updated"),
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

export { handleMessageEventProductWorkerToMain };
