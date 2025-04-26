/**
 * enableLegend: boolean; // default: false
  enableLegendJustify: boolean; // default: false
  legendAnchor: NivoLegendAnchor; // default: bottom-right
  legendDirection: NivoLegendDirection; // default: column
  legendItemBackground: string; // default: 'rgba(255, 255, 255, 0)'
  legendItemDirection: NivoLegendItemDirection; // default: left-to-right
  legendItemHeight: number; // 10px - 200px default: 20 step: 1
  legendItemOpacity: number; // 0 - 1 default: 1 step: 0.05
  legendItemTextColor: string; // default: '#FFF'
  legendItemWidth: number; // 10px - 200px default: 60 step: 1
  legendItemsSpacing: number; // 0px - 60px default: 2 step: 1
  legendSymbolBorderColor: string; // default: '#FFF'
  legendSymbolBorderWidth: number; // 0px - 10px default: 1 step: 1
  legendSymbolShape: NivoLegendSymbolShape; // default: circle
  legendSymbolSize: number; // 2px - 60px default: 12 step: 1
  legendSymbolSpacing: number; // 0px - 60px default: 8 step: 1
  legendTranslateX: number; // -200px - 200px default: 0 step: 1
  legendTranslateY: number; // -200px - 200px default: 0 step: 1
 */

import { z } from "zod";

const setEnableLegendDispatchZod = z.object({
    action: z.literal("setEnableLegend"),
    payload: z.boolean(),
});
const setEnableLegendJustifyDispatchZod = z.object({
    action: z.literal("setEnableLegendJustify"),
    payload: z.boolean(),
});
const setLegendAnchorDispatchZod = z.object({
    action: z.literal("setLegendAnchor"),
    payload: z.enum([
        "top",
        "top-right",
        "right",
        "bottom-right",
        "bottom",
        "bottom-left",
        "left",
        "top-left",
        "center",
    ]),
});
const setLegendDirectionDispatchZod = z.object({
    action: z.literal("setLegendDirection"),
    payload: z.enum(["row", "column"]),
});
const setLegendItemBackgroundDispatchZod = z.object({
    action: z.literal("setLegendItemBackground"),
    payload: z.string(),
});
const setLegendItemDirectionDispatchZod = z.object({
    action: z.literal("setLegendItemDirection"),
    payload: z.enum([
        "left-to-right",
        "right-to-left",
        "top-to-bottom",
        "bottom-to-top",
    ]),
});
const setLegendItemHeightDispatchZod = z.object({
    action: z.literal("setLegendItemHeight"),
    payload: z.number().min(10).max(200).step(1),
});
const setLegendItemOpacityDispatchZod = z.object({
    action: z.literal("setLegendItemOpacity"),
    payload: z.number().min(0).max(1).step(0.05),
});
const setLegendItemTextColorDispatchZod = z.object({
    action: z.literal("setLegendItemTextColor"),
    payload: z.string(),
});
const setLegendItemWidthDispatchZod = z.object({
    action: z.literal("setLegendItemWidth"),
    payload: z.number().min(10).max(200).step(1),
});
const setLegendItemsSpacingDispatchZod = z.object({
    action: z.literal("setLegendItemsSpacing"),
    payload: z.number().min(0).max(60).step(1),
});
const setLegendSymbolBorderColorDispatchZod = z.object({
    action: z.literal("setLegendSymbolBorderColor"),
    payload: z.string(),
});
const setLegendSymbolBorderWidthDispatchZod = z.object({
    action: z.literal("setLegendSymbolBorderWidth"),
    payload: z.number().min(0).max(10).step(1),
});
const setLegendSymbolShapeDispatchZod = z.object({
    action: z.literal("setLegendSymbolShape"),
    payload: z.enum([
        "circle",
        "diamond",
        "square",
        "triangle",
    ]),
});
const setLegendSymbolSizeDispatchZod = z.object({
    action: z.literal("setLegendSymbolSize"),
    payload: z.number().min(2).max(60).step(1),
});
const setLegendSymbolSpacingDispatchZod = z.object({
    action: z.literal("setLegendSymbolSpacing"),
    payload: z.number().min(0).max(60).step(1),
});
const setLegendTranslateXDispatchZod = z.object({
    action: z.literal("setLegendTranslateX"),
    payload: z.number().min(-200).max(200).step(1),
});
const setLegendTranslateYDispatchZod = z.object({
    action: z.literal("setLegendTranslateY"),
    payload: z.number().min(-200).max(200).step(1),
});

type ChartLegendDispatchZod =
    | z.infer<typeof setEnableLegendDispatchZod>
    | z.infer<typeof setEnableLegendJustifyDispatchZod>
    | z.infer<typeof setLegendAnchorDispatchZod>
    | z.infer<typeof setLegendDirectionDispatchZod>
    | z.infer<typeof setLegendItemBackgroundDispatchZod>
    | z.infer<typeof setLegendItemDirectionDispatchZod>
    | z.infer<typeof setLegendItemHeightDispatchZod>
    | z.infer<typeof setLegendItemOpacityDispatchZod>
    | z.infer<typeof setLegendItemTextColorDispatchZod>
    | z.infer<typeof setLegendItemWidthDispatchZod>
    | z.infer<typeof setLegendItemsSpacingDispatchZod>
    | z.infer<typeof setLegendSymbolBorderColorDispatchZod>
    | z.infer<typeof setLegendSymbolBorderWidthDispatchZod>
    | z.infer<typeof setLegendSymbolShapeDispatchZod>
    | z.infer<typeof setLegendSymbolSizeDispatchZod>
    | z.infer<typeof setLegendSymbolSpacingDispatchZod>
    | z.infer<typeof setLegendTranslateXDispatchZod>
    | z.infer<typeof setLegendTranslateYDispatchZod>;

export {
    setEnableLegendDispatchZod,
    setEnableLegendJustifyDispatchZod,
    setLegendAnchorDispatchZod,
    setLegendDirectionDispatchZod,
    setLegendItemBackgroundDispatchZod,
    setLegendItemDirectionDispatchZod,
    setLegendItemHeightDispatchZod,
    setLegendItemOpacityDispatchZod,
    setLegendItemsSpacingDispatchZod,
    setLegendItemTextColorDispatchZod,
    setLegendItemWidthDispatchZod,
    setLegendSymbolBorderColorDispatchZod,
    setLegendSymbolBorderWidthDispatchZod,
    setLegendSymbolShapeDispatchZod,
    setLegendSymbolSizeDispatchZod,
    setLegendSymbolSpacingDispatchZod,
    setLegendTranslateXDispatchZod,
    setLegendTranslateYDispatchZod,
};
export type { ChartLegendDispatchZod };
