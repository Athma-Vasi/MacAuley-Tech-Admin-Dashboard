import { createSafeBoxResult } from "../../../utils";
import { financialMetricsAction } from "./actions";
import {
    FinancialMetricsDispatch,
    MessageEventFinancialWorkerToMain,
} from "./types";

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

        const { currentYear, previousYear, financialMetricsCharts } =
            dataUnwrapped;

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
    } catch (error: unknown) {
        if (!isComponentMountedRef.current) {
            return;
        }

        showBoundary(error);
    }
}

export { handleMessageEventFinancialWorkerToMain };
