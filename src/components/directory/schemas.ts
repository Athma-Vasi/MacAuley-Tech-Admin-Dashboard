import { z } from "zod";
import { ALL_STORE_LOCATIONS_REGEX, DEPARTMENT_REGEX } from "../../regexes";
import { allDepartmentsZod, allStoreLocationsZod } from "../../schemas";
import { directoryAction } from "./actions";

const setDirectoryFetchWorkerDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDirectoryFetchWorker),
    payload: z.instanceof(Worker),
});

const setDepartmentDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDepartment),
    payload: allDepartmentsZod,
});

const setOrientationDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setOrientation),
    payload: z.enum(["horizontal", "vertical"]),
});

const setStoreLocationDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setStoreLocation),
    payload: allStoreLocationsZod,
});

const handleDirectoryDepartmentAndLocationClicksInputZod = z.object({
    accessToken: z.string().min(1),
    department: allDepartmentsZod,
    directoryFetchWorker: z.instanceof(Worker),
    directoryUrl: z.string().url(),
    globalDispatch: z.function().args(z.any()).returns(z.void()),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

const messageEventDirectoryFetchMainToWorkerZod = z.object({
    department: z.string().regex(DEPARTMENT_REGEX),
    requestInit: z.any(),
    routesZodSchemaMapKey: z.string(),
    storeLocation: z.string().regex(ALL_STORE_LOCATIONS_REGEX),
    url: z.string().url(),
});

export {
    handleDirectoryDepartmentAndLocationClicksInputZod,
    messageEventDirectoryFetchMainToWorkerZod,
    setDepartmentDirectoryDispatchZod,
    setDirectoryFetchWorkerDirectoryDispatchZod,
    setOrientationDirectoryDispatchZod,
    setStoreLocationDirectoryDispatchZod,
};
