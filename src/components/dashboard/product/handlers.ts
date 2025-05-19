import { Some } from "ts-results";
import { ResultSafeBox } from "../../../types";
import { createResultSafeBox, parseSafeSync } from "../../../utils";
import { MessageEventProductWorkerToMain } from "../../../workers/productChartsWorker";
import { productMetricsAction } from "./actions";
import { handleMessageEventProductWorkerToMainInputZod } from "./schemas";
import { ProductMetricsDispatch } from "./types";

async function handleMessageEventProductWorkerToMain(input: {
    event: MessageEventProductWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    productMetricsDispatch: React.Dispatch<ProductMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<ResultSafeBox<string>> {
    try {
        const parsedInputResult = parseSafeSync({
            object: input,
            zSchema: handleMessageEventProductWorkerToMainInputZod,
        });
        if (parsedInputResult.err || parsedInputResult.val.data.none) {
            return createResultSafeBox({
                data: parsedInputResult.val.data ?? Some("Error parsing input"),
            });
        }

        const {
            event,
            isComponentMountedRef,
            productMetricsDispatch,
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

        return createResultSafeBox({
            data: Some("Product metrics charts updated"),
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

export { handleMessageEventProductWorkerToMain };
