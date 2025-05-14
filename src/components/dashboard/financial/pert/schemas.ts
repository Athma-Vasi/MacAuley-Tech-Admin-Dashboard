import { z } from "zod";
import { pertAction } from "./actions";

const setYAxisKeyPERTDispatchZod = z.object({
    action: z.literal(pertAction.setYAxisKey),
    payload: z.enum([
        "total",
        "overview",
        "inStore",
        "online",
        "all",
        "repair",
        "sales",
    ]),
});

export { setYAxisKeyPERTDispatchZod };
