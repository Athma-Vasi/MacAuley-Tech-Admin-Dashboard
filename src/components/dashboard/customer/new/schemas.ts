import { z } from "zod";
import { newAction } from "./actions";

const setYAxisKeyNewDispatchZod = z.object({
    action: z.literal(newAction.setYAxisKey),
    payload: z.enum([
        "total",
        "all",
        "overview",
        "repair",
        "sales",
        "inStore",
        "online",
    ]),
});

export { setYAxisKeyNewDispatchZod };
