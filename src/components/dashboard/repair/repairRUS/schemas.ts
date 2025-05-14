import { z } from "zod";
import { repairRUSAction } from "./actions";

const setYAxisKeyRepairRUSDispatchZod = z.object({
    action: z.literal(repairRUSAction.setYAxisKey),
    payload: z.enum([
        "revenue",
        "unitsRepaired",
    ]),
});

export { setYAxisKeyRepairRUSDispatchZod };
