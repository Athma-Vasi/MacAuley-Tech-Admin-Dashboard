import { SafeResult } from "../../../types";
import {
    catchHandlerErrorSafe,
    createSafeErrorResult,
    createSafeSuccessResult,
    parseSyncSafe,
} from "../../../utils";
import { productMetricsAction } from "./actions";
import { MessageEventProductChartsWorkerToMain } from "./chartsWorker";
import { handleMessageEventProductChartsWorkerToMainInputZod } from "./schemas";
import { ProductMetricsDispatch } from "./types";

async function handleMessageEventProductChartsWorkerToMain(input: {
    event: MessageEventProductChartsWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    productMetricsDispatch: React.Dispatch<ProductMetricsDispatch>;
    showBoundary: (error: unknown) => void;
}): Promise<SafeResult<string>> {
    try {
        const parsedInputResult = parseSyncSafe({
            object: input,
            zSchema: handleMessageEventProductChartsWorkerToMainInputZod,
        });
        if (parsedInputResult.err) {
            input?.showBoundary?.(parsedInputResult);
            return parsedInputResult;
        }
        if (parsedInputResult.val.none) {
            const safeErrorResult = createSafeErrorResult(
                "Error parsing input",
            );
            input?.showBoundary?.(safeErrorResult);
            return safeErrorResult;
        }

        const {
            event,
            isComponentMountedRef,
            productMetricsDispatch,
            showBoundary,
        } = parsedInputResult.val.val;

        if (!isComponentMountedRef.current) {
            return createSafeErrorResult("Component unmounted");
        }

        const messageEventResult = event.data;
        if (!messageEventResult) {
            return createSafeErrorResult("No data received");
        }
        if (messageEventResult.err) {
            showBoundary(messageEventResult);
            return messageEventResult;
        }
        if (messageEventResult.val.none) {
            return createSafeErrorResult("Error parsing message event");
        }

        const {
            currentYear,
            previousYear,
            productMetricsCharts,
            productMetricsCards,
        } = messageEventResult.val.val;

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

        return createSafeSuccessResult(
            "Product metrics charts and cards updated successfully",
        );
    } catch (error: unknown) {
        return catchHandlerErrorSafe(
            error,
            input?.isComponentMountedRef,
            input?.showBoundary,
        );
    }
}

export { handleMessageEventProductChartsWorkerToMain };
