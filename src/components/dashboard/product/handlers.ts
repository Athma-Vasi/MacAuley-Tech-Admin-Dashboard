import { Some } from "ts-results";
import { createResultSafeBox } from "../../../utils";
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
        console.log("Product Worker received message:", event.data);

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
            productMetricsCharts,
            productMetricsCards,
        } = val.data.val;

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
            action: productMetricsAction.setCards,
            payload: productMetricsCards,
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

export { handleMessageEventProductWorkerToMain };
