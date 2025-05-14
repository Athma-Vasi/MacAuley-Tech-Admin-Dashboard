import { z } from "zod";
import { churnRetentionAction } from "./actions";

const setYAxisKeyChurnRetentionDispatchZod = z.object({
    action: z.literal(churnRetentionAction.setYAxisKey),
    payload: z.enum([
        "overview",
        "churnRate",
        "retentionRate",
    ]),
});

export { setYAxisKeyChurnRetentionDispatchZod };
