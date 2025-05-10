import { createSafeBoxResult } from "../../../utils";
import { productMetricsAction } from "./actions";
import {
    MessageEventProductWorkerToMain,
    ProductMetricsDispatch,
} from "./types";

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

        productMetricsDispatch({
            action: productMetricsAction.setIsGenerating,
            payload: false,
        });
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return;
        }

        showBoundary(error);
    }
}

export { handleMessageEventProductWorkerToMain };
