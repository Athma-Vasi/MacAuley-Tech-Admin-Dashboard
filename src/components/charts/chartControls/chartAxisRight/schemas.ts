import { z } from "zod";

const setAxisRightLegendDispatchZod = z.object({
    action: z.literal("setAxisRightLegend"),
    payload: z.string(),
});
const setAxisRightLegendOffsetDispatchZod = z.object({
    action: z.literal("setAxisRightLegendOffset"),
    payload: z.number().min(-60).max(60),
});
const setAxisRightLegendPositionDispatchZod = z.object({
    action: z.literal("setAxisRightLegendPosition"),
    payload: z.enum(["top", "middle", "bottom"]),
});
const setAxisRightTickPaddingDispatchZod = z.object({
    action: z.literal("setAxisRightTickPadding"),
    payload: z.number().min(0).max(20),
});
const setAxisRightTickRotationDispatchZod = z.object({
    action: z.literal("setAxisRightTickRotation"),
    payload: z.number().min(-90).max(90),
});
const setAxisRightTickSizeDispatchZod = z.object({
    action: z.literal("setAxisRightTickSize"),
    payload: z.number().min(0).max(20),
});
const setEnableAxisRightDispatchZod = z.object({
    action: z.literal("setEnableAxisRight"),
    payload: z.boolean(),
});

type ChartAxisRightDispatchZod =
    | z.infer<typeof setAxisRightLegendDispatchZod>
    | z.infer<typeof setAxisRightLegendOffsetDispatchZod>
    | z.infer<typeof setAxisRightLegendPositionDispatchZod>
    | z.infer<typeof setAxisRightTickPaddingDispatchZod>
    | z.infer<typeof setAxisRightTickRotationDispatchZod>
    | z.infer<typeof setAxisRightTickSizeDispatchZod>
    | z.infer<typeof setEnableAxisRightDispatchZod>;

export {
    setAxisRightLegendDispatchZod,
    setAxisRightLegendOffsetDispatchZod,
    setAxisRightLegendPositionDispatchZod,
    setAxisRightTickPaddingDispatchZod,
    setAxisRightTickRotationDispatchZod,
    setAxisRightTickSizeDispatchZod,
    setEnableAxisRightDispatchZod,
};
export type { ChartAxisRightDispatchZod };
