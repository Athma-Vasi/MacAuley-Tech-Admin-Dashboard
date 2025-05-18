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

export {
    handleDirectoryDepartmentAndLocationClicksInputZod,
    setDepartmentDirectoryDispatchZod,
    setDirectoryFetchWorkerDirectoryDispatchZod,
    setOrientationDirectoryDispatchZod,
    setStoreLocationDirectoryDispatchZod,
};
