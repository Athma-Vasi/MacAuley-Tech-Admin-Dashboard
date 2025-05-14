import { z } from "zod";
import { returningAction } from "./actions";

const setYAxisKeyReturningDispatchZod = z.object({
    action: z.literal(returningAction.setYAxisKey),
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

export { setYAxisKeyReturningDispatchZod };
