import { z } from "zod";
import { otherMetricsAction } from "./actions";

const setYAxisKeyOtherMetricsDispatchZod = z.object({
    action: z.literal(otherMetricsAction.setYAxisKey),
    payload: z.enum([
        "averageOrderValue",
        "conversionRate",
        "netProfitMargin",
    ]),
});

export { setYAxisKeyOtherMetricsDispatchZod };
