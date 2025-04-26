/**
 * chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;
 */

import { z } from "zod";

const setChartTitleDispatchZod = z.object({
    action: z.literal("setChartTitle"),
    payload: z.string(),
});
const setChartTitleColorDispatchZod = z.object({
    action: z.literal("setChartTitleColor"),
    payload: z.string(),
});
const setChartTitlePositionDispatchZod = z.object({
    action: z.literal("setChartTitlePosition"),
    payload: z.enum(["left", "center", "right"]),
});
const setChartTitleSizeDispatchZod = z.object({
    action: z.literal("setChartTitleSize"),
    payload: z.number().min(1).max(6).step(1),
});
const setScreenshotFilenameDispatchZod = z.object({
    action: z.literal("setScreenshotFilename"),
    payload: z.string(),
});
const setScreenshotImageQualityDispatchZod = z.object({
    action: z.literal("setScreenshotImageQuality"),
    payload: z.number().min(0).max(1).step(0.05),
});
const setScreenshotImageTypeDispatchZod = z.object({
    action: z.literal("setScreenshotImageType"),
    payload: z.enum(["image/png", "image/jpeg", "image/webp"]),
});

type ChartOptionsDispatchZod =
    | z.infer<typeof setChartTitleDispatchZod>
    | z.infer<typeof setChartTitleColorDispatchZod>
    | z.infer<typeof setChartTitlePositionDispatchZod>
    | z.infer<typeof setChartTitleSizeDispatchZod>
    | z.infer<typeof setScreenshotFilenameDispatchZod>
    | z.infer<typeof setScreenshotImageQualityDispatchZod>
    | z.infer<typeof setScreenshotImageTypeDispatchZod>;

export {
    setChartTitleColorDispatchZod,
    setChartTitleDispatchZod,
    setChartTitlePositionDispatchZod,
    setChartTitleSizeDispatchZod,
    setScreenshotFilenameDispatchZod,
    setScreenshotImageQualityDispatchZod,
    setScreenshotImageTypeDispatchZod,
};
export type { ChartOptionsDispatchZod };
