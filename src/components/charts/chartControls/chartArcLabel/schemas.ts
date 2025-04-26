import { z } from "zod";

const setArcLabelChartDispatchZod = z.object({
    action: z.literal("setArcLabel"),
    payload: z.enum(["id", "value", "formattedValue"]),
});

const setArcLabelsRadiusOffsetChartDispatchZod = z.object({
    action: z.literal("setArcLabelsRadiusOffset"),
    payload: z.number().min(0).max(2).step(0.05),
});

const setArcLabelsSkipAngleChartDispatchZod = z.object({
    action: z.literal("setArcLabelsSkipAngle"),
    payload: z.number().min(0).max(45).step(1),
});

const setArcLabelsTextColorChartDispatchZod = z.object({
    action: z.literal("setArcLabelsTextColor"),
    payload: z.string(),
});

const setEnableArcLabelsChartDispatchZod = z.object({
    action: z.literal("setEnableArcLabels"),
    payload: z.boolean(),
});

type ChartArcLabelDispatchZod =
    | z.infer<typeof setArcLabelChartDispatchZod>
    | z.infer<typeof setArcLabelsRadiusOffsetChartDispatchZod>
    | z.infer<typeof setArcLabelsSkipAngleChartDispatchZod>
    | z.infer<typeof setArcLabelsTextColorChartDispatchZod>
    | z.infer<typeof setEnableArcLabelsChartDispatchZod>;

export {
    setArcLabelChartDispatchZod,
    setArcLabelsRadiusOffsetChartDispatchZod,
    setArcLabelsSkipAngleChartDispatchZod,
    setArcLabelsTextColorChartDispatchZod,
    setEnableArcLabelsChartDispatchZod,
};
export type { ChartArcLabelDispatchZod };
