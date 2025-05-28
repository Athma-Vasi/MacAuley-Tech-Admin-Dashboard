import { z } from "zod";
import {
    allStoreLocationsZod,
    metricsViewZod,
    productMetricCategoryZod,
    repairMetricCategoryZod,
} from "../../schemas";
import { sidebarAction } from "./actions";

const setMetricsCacheWorkerSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setMetricsCacheWorker),
    payload: z.instanceof(Worker),
});

const setDirectoryFetchWorkerSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setDirectoryFetchWorker),
    payload: z.instanceof(Worker),
});

const setClickedNavlinkSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setClickedNavlink),
    payload: z.enum([
        "directory",
        "users",
        "financials",
        "products",
        "customers",
        "repairs",
        "logout",
    ]),
});

const setLogoutFetchWorkerSidebarDispatchZod = z.object({
    action: z.literal(sidebarAction.setLogoutFetchWorker),
    payload: z.instanceof(Worker),
});

const handleLogoutClickInputZod = z.object({
    accessToken: z.string().min(1).max(1000),
    globalDispatch: z.function().args(z.any()).returns(z.any()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    logoutFetchWorker: z.instanceof(Worker),
    logoutUrl: z.string().url(),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMessageEventLogoutFetchWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    navigate: z.function().args(z.any()).returns(z.any()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleDirectoryNavClickInputZod = z.object({
    accessToken: z.string().min(1).max(1000),
    department: z.enum([
        "All Departments",
        "Executive Management",
        "Human Resources",
        "Store Administration",
        "Office Administration",
        "Accounting",
        "Sales",
        "Marketing",
        "Information Technology",
        "Repair Technicians",
        "Field Service Technicians",
        "Logistics and Inventory",
        "Customer Service",
        "Maintenance",
    ]),
    directoryFetchWorker: z.instanceof(Worker),
    directoryUrl: z.string().url(),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    navigate: z.optional(z.function().args(z.any()).returns(z.void())),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: z.enum([
        "All Locations",
        "Edmonton",
        "Calgary",
        "Vancouver",
    ]),
    toLocation: z.string().min(1).max(1000),
});

const handleMessageEventDirectoryFetchWorkerToMainInputZod = z.object({
    authDispatch: z.function().args(z.any()).returns(z.void()),
    directoryUrl: z.string().url(),
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    navigate: z.function().args(z.any()).returns(z.void()).optional(),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    toLocation: z.string().min(1).max(1000).optional(),
});

const handleMessageEventMetricsCacheWorkerToMainInputZod = z.object({
    event: z.instanceof(MessageEvent),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    navigate: z.function().args(z.any()).returns(z.void()),
    showBoundary: z.function().args(z.any()).returns(z.void()),
});

const handleMetricCategoryNavClickInputZod = z.object({
    metricsCacheWorker: z.instanceof(Worker).nullable(),
    globalDispatch: z.function().args(z.any()).returns(z.any()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    metricsUrl: z.string().url(),
    metricsView: metricsViewZod,
    productMetricCategory: productMetricCategoryZod,
    repairMetricCategory: repairMetricCategoryZod,
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

export {
    handleDirectoryNavClickInputZod,
    handleLogoutClickInputZod,
    handleMessageEventDirectoryFetchWorkerToMainInputZod,
    handleMessageEventLogoutFetchWorkerToMainInputZod,
    handleMessageEventMetricsCacheWorkerToMainInputZod,
    handleMetricCategoryNavClickInputZod,
    setClickedNavlinkSidebarDispatchZod,
    setDirectoryFetchWorkerSidebarDispatchZod,
    setLogoutFetchWorkerSidebarDispatchZod,
    setMetricsCacheWorkerSidebarDispatchZod,
};
