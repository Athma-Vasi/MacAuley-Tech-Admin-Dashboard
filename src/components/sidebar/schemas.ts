import { z } from "zod";
import { sidebarAction } from "./actions";

const setMetricsFetchWorkerSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setMetricsFetchWorker),
    payload: z.instanceof(Worker),
});

const setMetricsViewSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setMetricsView),
    payload: z.enum([
        "financials",
        "products",
        "customers",
        "repairs",
    ]),
});

const setDirectoryFetchWorkerSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setDirectoryFetchWorker),
    payload: z.instanceof(Worker),
});

export {
    setDirectoryFetchWorkerSidebarDispatchZod,
    setMetricsFetchWorkerSidebarDispatchZod,
    setMetricsViewSidebarDispatchZod,
};
