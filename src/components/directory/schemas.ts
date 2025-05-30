import { z } from "zod";
import { ALL_STORE_LOCATIONS_REGEX, DEPARTMENT_REGEX } from "../../regexes";
import { allDepartmentsZod, allStoreLocationsZod } from "../../schemas";
import { decodedTokenZod } from "../usersQuery/schemas";
import { directoryAction } from "./actions";

const setDirectoryFetchWorkerDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDirectoryFetchWorker),
    payload: z.instanceof(Worker),
});

const setDepartmentDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDepartment),
    payload: allDepartmentsZod,
});

const setIsLoadingDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setIsLoading),
    payload: z.boolean(),
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
    decodedToken: decodedTokenZod,
    department: allDepartmentsZod,
    directoryDispatch: z.function().args(z.any()).returns(z.void()),
    directoryFetchWorker: z.instanceof(Worker),
    directoryUrl: z.string().url(),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

const messageEventDirectoryFetchMainToWorkerZod = z.object({
    accessToken: z.string().min(1),
    decodedToken: decodedTokenZod,
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
    setIsLoadingDirectoryDispatchZod,
    setOrientationDirectoryDispatchZod,
    setStoreLocationDirectoryDispatchZod,
};
