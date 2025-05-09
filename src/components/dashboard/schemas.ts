import { z } from "zod";
import { dashboardAction } from "./actions";

const setSelectedYYYYMMDDDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setSelectedYYYYMMDD),
    payload: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const setIsLoadingDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setIsLoading),
    payload: z.boolean(),
});

const setLoadingMessageDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setLoadingMessage),
    payload: z.string(),
});

const setCalendarViewDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setCalendarView),
    payload: z.enum(["Daily", "Monthly", "Yearly"]),
});

const setDashboardFetchWorkerDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setDashboardFetchWorker),
    payload: z.instanceof(Worker),
});

export {
    setCalendarViewDashboardDispatchZod,
    setDashboardFetchWorkerDashboardDispatchZod,
    setIsLoadingDashboardDispatchZod,
    setLoadingMessageDashboardDispatchZod,
    setSelectedYYYYMMDDDashboardDispatchZod,
};
