import { z } from "zod";

const setAxisLeftLegendChartDispatchZod = z.object({
    action: z.literal("setAxisLeftLegend"),
    payload: z.string(),
});
const setAxisLeftLegendOffsetChartDispatchZod = z.object({
    action: z.literal("setAxisLeftLegendOffset"),
    payload: z.number().min(-60).max(60).step(1),
});
const setAxisLeftLegendPositionChartDispatchZod = z.object({
    action: z.literal("setAxisLeftLegendPosition"),
    payload: z.enum(["start", "middle", "end"]),
});
const setAxisLeftTickPaddingChartDispatchZod = z.object({
    action: z.literal("setAxisLeftTickPadding"),
    payload: z.number().min(0).max(20).step(1),
});
const setAxisLeftTickRotationChartDispatchZod = z.object({
    action: z.literal("setAxisLeftTickRotation"),
    payload: z.number().min(-90).max(90).step(1),
});
const setAxisLeftTickSizeChartDispatchZod = z.object({
    action: z.literal("setAxisLeftTickSize"),
    payload: z.number().min(0).max(20).step(1),
});
const setEnableAxisLeftChartDispatchZod = z.object({
    action: z.literal("setEnableAxisLeft"),
    payload: z.boolean(),
});

type ChartAxisLeftDispatchZod =
    | z.infer<typeof setAxisLeftLegendChartDispatchZod>
    | z.infer<typeof setAxisLeftLegendOffsetChartDispatchZod>
    | z.infer<typeof setAxisLeftLegendPositionChartDispatchZod>
    | z.infer<typeof setAxisLeftTickPaddingChartDispatchZod>
    | z.infer<typeof setAxisLeftTickRotationChartDispatchZod>
    | z.infer<typeof setAxisLeftTickSizeChartDispatchZod>
    | z.infer<typeof setEnableAxisLeftChartDispatchZod>;

export {
    setAxisLeftLegendChartDispatchZod,
    setAxisLeftLegendOffsetChartDispatchZod,
    setAxisLeftLegendPositionChartDispatchZod,
    setAxisLeftTickPaddingChartDispatchZod,
    setAxisLeftTickRotationChartDispatchZod,
    setAxisLeftTickSizeChartDispatchZod,
    setEnableAxisLeftChartDispatchZod,
};
export type { ChartAxisLeftDispatchZod };
