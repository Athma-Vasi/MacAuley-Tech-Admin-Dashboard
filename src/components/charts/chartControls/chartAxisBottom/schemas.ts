import { z } from "zod";

const setAxisBottomLegendChartDispatchZod = z.object({
    action: z.literal("setAxisBottomLegend"),
    payload: z.string(),
});
const setAxisBottomLegendOffsetChartDispatchZod = z.object({
    action: z.literal("setAxisBottomLegendOffset"),
    payload: z.number().min(-60).max(60).step(1),
});
const setAxisBottomLegendPositionChartDispatchZod = z.object({
    action: z.literal("setAxisBottomLegendPosition"),
    payload: z.enum(["start", "middle", "end"]),
});
const setAxisBottomTickPaddingChartDispatchZod = z.object({
    action: z.literal("setAxisBottomTickPadding"),
    payload: z.number().min(0).max(20).step(1),
});
const setAxisBottomTickRotationChartDispatchZod = z.object({
    action: z.literal("setAxisBottomTickRotation"),
    payload: z.number().min(-90).max(90).step(1),
});
const setAxisBottomTickSizeChartDispatchZod = z.object({
    action: z.literal("setAxisBottomTickSize"),
    payload: z.number().min(0).max(20).step(1),
});
const setEnableAxisBottomChartDispatchZod = z.object({
    action: z.literal("setEnableAxisBottom"),
    payload: z.boolean(),
});

type ChartAxisBottomDispatchZod =
    | z.infer<typeof setAxisBottomLegendChartDispatchZod>
    | z.infer<typeof setAxisBottomLegendOffsetChartDispatchZod>
    | z.infer<typeof setAxisBottomLegendPositionChartDispatchZod>
    | z.infer<typeof setAxisBottomTickPaddingChartDispatchZod>
    | z.infer<typeof setAxisBottomTickRotationChartDispatchZod>
    | z.infer<typeof setAxisBottomTickSizeChartDispatchZod>
    | z.infer<typeof setEnableAxisBottomChartDispatchZod>;

export {
    setAxisBottomLegendChartDispatchZod,
    setAxisBottomLegendOffsetChartDispatchZod,
    setAxisBottomLegendPositionChartDispatchZod,
    setAxisBottomTickPaddingChartDispatchZod,
    setAxisBottomTickRotationChartDispatchZod,
    setAxisBottomTickSizeChartDispatchZod,
    setEnableAxisBottomChartDispatchZod,
};
export type { ChartAxisBottomDispatchZod };
