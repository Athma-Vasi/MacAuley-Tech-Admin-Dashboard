import { z } from "zod";

const setAxisTopLegendDispatchZod = z.object({
    action: z.literal("setAxisTopLegend"),
    payload: z.string(),
});
const setAxisTopLegendOffsetDispatchZod = z.object({
    action: z.literal("setAxisTopLegendOffset"),
    payload: z.number().min(-60).max(60),
});
const setAxisTopLegendPositionDispatchZod = z.object({
    action: z.literal("setAxisTopLegendPosition"),
    payload: z.enum(["start", "middle", "end"]),
});
const setAxisTopTickPaddingDispatchZod = z.object({
    action: z.literal("setAxisTopTickPadding"),
    payload: z.number().min(0).max(20),
});
const setAxisTopTickRotationDispatchZod = z.object({
    action: z.literal("setAxisTopTickRotation"),
    payload: z.number().min(-90).max(90),
});
const setAxisTopTickSizeDispatchZod = z.object({
    action: z.literal("setAxisTopTickSize"),
    payload: z.number().min(0).max(20),
});
const setEnableAxisTopDispatchZod = z.object({
    action: z.literal("setEnableAxisTop"),
    payload: z.boolean(),
});

type ChartAxisTopDispatchZod =
    | z.infer<typeof setAxisTopLegendDispatchZod>
    | z.infer<typeof setAxisTopLegendOffsetDispatchZod>
    | z.infer<typeof setAxisTopLegendPositionDispatchZod>
    | z.infer<typeof setAxisTopTickPaddingDispatchZod>
    | z.infer<typeof setAxisTopTickRotationDispatchZod>
    | z.infer<typeof setAxisTopTickSizeDispatchZod>
    | z.infer<typeof setEnableAxisTopDispatchZod>;

export {
    setAxisTopLegendDispatchZod,
    setAxisTopLegendOffsetDispatchZod,
    setAxisTopLegendPositionDispatchZod,
    setAxisTopTickPaddingDispatchZod,
    setAxisTopTickRotationDispatchZod,
    setAxisTopTickSizeDispatchZod,
    setEnableAxisTopDispatchZod,
};
export type { ChartAxisTopDispatchZod };
