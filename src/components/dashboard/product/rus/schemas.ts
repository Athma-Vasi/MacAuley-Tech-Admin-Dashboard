import { z } from "zod";
import { rusAction } from "./actions";

const setYAxisKeyRUSDispatchZod = z.object({
    action: z.literal(rusAction.setYAxisKey),
    payload: z.enum([
        "total",
        "overview",
        "inStore",
        "online",
    ]),
});

export { setYAxisKeyRUSDispatchZod };
