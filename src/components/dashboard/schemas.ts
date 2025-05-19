import { z } from "zod";
import {
    allStoreLocationsZod,
    metricsViewZod,
    productMetricCategoryZod,
    repairMetricCategoryZod,
} from "../../schemas";
import { dashboardAction } from "./actions";

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

const handleStoreAndCategoryClicksInputZod = z.object({
    accessToken: z.string(),
    dashboardDispatch: z.function().args(z.any()).returns(z.void()),
    dashboardFetchWorker: z.instanceof(Worker),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    metricsUrl: z.string().url(),
    metricsView: metricsViewZod,
    productMetricCategory: productMetricCategoryZod,
    repairMetricCategory: repairMetricCategoryZod,
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

const handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod = z.object({
    authDispatch: z.function().args(z.any()).returns(z.void()),
    dashboardDispatch: z.function().args(z.any()).returns(z.void()),
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    metricsUrl: z.string().url(),
    navigateFn: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

export {
    handleMessageEventStoreAndCategoryFetchWorkerToMainInputZod,
    handleStoreAndCategoryClicksInputZod,
    setCalendarViewDashboardDispatchZod,
    setDashboardFetchWorkerDashboardDispatchZod,
    setIsLoadingDashboardDispatchZod,
    setLoadingMessageDashboardDispatchZod,
};
