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

const setDashboardCacheWorkerDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setDashboardCacheWorker),
    payload: z.instanceof(Worker),
});

const setCurrentSelectedInputDashboardDispatchZod = z.object({
    action: z.literal(dashboardAction.setCurrentSelectedInput),
    payload: z.string(),
});

const handleStoreAndCategoryClicksInputZod = z.object({
    dashboardDispatch: z.function().args(z.any()).returns(z.void()),
    dashboardCacheWorker: z.instanceof(Worker),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    metricsUrl: z.string().url(),
    metricsView: metricsViewZod,
    productMetricCategory: productMetricCategoryZod,
    repairMetricCategory: repairMetricCategoryZod,
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

const handleMessageEventDashboardCacheWorkerToMainInputZod = z.object({
    dashboardDispatch: z.function().args(z.any()).returns(z.void()),
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const messageEventDashboardFetchMainToWorkerZod = z.object({
    metricsView: metricsViewZod,
    routesZodSchemaMapKey: z.string(),
    cacheKey: z.string().url(),
});

export {
    handleMessageEventDashboardCacheWorkerToMainInputZod,
    handleStoreAndCategoryClicksInputZod,
    messageEventDashboardFetchMainToWorkerZod,
    setCalendarViewDashboardDispatchZod,
    setCurrentSelectedInputDashboardDispatchZod,
    setDashboardCacheWorkerDashboardDispatchZod,
    setIsLoadingDashboardDispatchZod,
    setLoadingMessageDashboardDispatchZod,
};
