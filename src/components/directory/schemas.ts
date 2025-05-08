import { z } from "zod";
import { userDocumentOptionalsZod } from "../usersQuery/schemas";
import { directoryAction } from "./actions";

const setDirectoryFetchWorkerDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDirectoryFetchWorker),
    payload: z.instanceof(Worker),
});

const setDepartmentDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDepartment),
    payload: z.enum([
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
});

const setDirectoryDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setDirectory),
    payload: z.array(userDocumentOptionalsZod),
});

const setOrientationDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setOrientation),
    payload: z.enum(["horizontal", "vertical"]),
});

const setStoreLocationDirectoryDispatchZod = z.object({
    action: z.literal(directoryAction.setStoreLocation),
    payload: z.enum([
        "All Locations",
        "Edmonton",
        "Calgary",
        "Vancouver",
    ]),
});

export {
    setDepartmentDirectoryDispatchZod,
    setDirectoryDirectoryDispatchZod,
    setDirectoryFetchWorkerDirectoryDispatchZod,
    setOrientationDirectoryDispatchZod,
    setStoreLocationDirectoryDispatchZod,
};
