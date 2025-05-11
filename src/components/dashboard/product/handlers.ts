import { createSafeBoxResult } from "../../../utils";
import { MessageEventProductWorkerToMain } from "../../../workers/productChartsWorker";
import { productMetricsAction } from "./actions";
import { ProductMetricsDispatch } from "./types";

async function handleMessageEventProductWorkerToMain({
    event,
    isComponentMountedRef,
    productMetricsDispatch,
    showBoundary,
}: {
    event: MessageEventProductWorkerToMain;
    isComponentMountedRef: React.RefObject<boolean>;
    productMetricsDispatch: React.Dispatch<ProductMetricsDispatch>;
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

        const { currentYear, previousYear, productMetricsCharts } =
            dataUnwrapped;

        if (!isComponentMountedRef.current) {
            return;
        }

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

        return createSafeBoxResult({
            data: true,
            kind: "success",
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return createSafeBoxResult({
                data: error,
                message: "Component unmounted",
            });
        }

        showBoundary(error);
        return createSafeBoxResult({
            data: error,
            message: "Error handling message event",
        });
    }
}

export { handleMessageEventProductWorkerToMain };
