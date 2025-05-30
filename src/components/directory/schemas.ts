import { z } from "zod";
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

const setClickedInputDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setClickedInput),
    payload: z.enum(["department", "storeLocation", ""]),
});

const handleDirectoryDepartmentAndLocationClicksInputZod = z.object({
    accessToken: z.string().min(1),
    department: allDepartmentsZod,
    directoryDispatch: z.function().args(z.any()).returns(z.void()),
    directoryFetchWorker: z.instanceof(Worker),
    directoryUrl: z.string().url(),
    isComponentMountedRef: z.object({ current: z.boolean() }),
    showBoundary: z.function().args(z.any()).returns(z.void()),
    storeLocation: allStoreLocationsZod,
});

const messageEventDirectoryFetchMainToWorkerZod = z.object({
    requestInit: z.any(),
    routesZodSchemaMapKey: z.string(),
    url: z.string().url(),
});

export {
    handleDirectoryDepartmentAndLocationClicksInputZod,
    messageEventDirectoryFetchMainToWorkerZod,
    setClickedInputDirectoryDispatchZod,
    setDepartmentDirectoryDispatchZod,
    setDirectoryFetchWorkerDirectoryDispatchZod,
    setIsLoadingDirectoryDispatchZod,
    setOrientationDirectoryDispatchZod,
    setStoreLocationDirectoryDispatchZod,
};
