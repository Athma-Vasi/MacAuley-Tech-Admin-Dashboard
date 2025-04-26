import { z } from "zod";
import { responsiveBarChartAction } from "./actions";

const responsiveBarChartReducer_setGroupModeZ = z.object({
    action: z.literal(responsiveBarChartAction.setGroupMode),
    payload: z.enum(["grouped", "stacked"]),
});

type SetGroupModeBarDispatch = z.infer<
    typeof responsiveBarChartReducer_setGroupModeZ
>;

/**
 * type ResponsiveBarChartDispatch =
  | {
    action: ResponsiveBarChartAction["setGroupMode"];
    payload: NivoBarGroupMode;
  }
  | {
    action: ResponsiveBarChartAction["setLayout"];
    payload: NivoBarLayout;
  }
  | {
    action: ResponsiveBarChartAction["setValueScale"];
    payload: NivoBarValueScale;
  }
  | {
    action:
      | ResponsiveBarChartAction["setEnableAnimate"]
      | ResponsiveBarChartAction["setEnableAxisBottom"]
      | ResponsiveBarChartAction["setEnableAxisLeft"]
      | ResponsiveBarChartAction["setEnableAxisRight"]
      | ResponsiveBarChartAction["setEnableAxisTop"]
      | ResponsiveBarChartAction["setEnableFillPatterns"]
      | ResponsiveBarChartAction["setEnableGridX"]
      | ResponsiveBarChartAction["setEnableGridY"]
      | ResponsiveBarChartAction["setEnableLabels"]
      | ResponsiveBarChartAction["setEnableLegend"]
      | ResponsiveBarChartAction["setEnableLegendJustify"]
      | ResponsiveBarChartAction["setReverse"];

    payload: boolean;
  }
  | {
    action:
      | ResponsiveBarChartAction["setAxisBottomLegendOffset"]
      | ResponsiveBarChartAction["setAxisBottomTickPadding"]
      | ResponsiveBarChartAction["setAxisBottomTickRotation"]
      | ResponsiveBarChartAction["setAxisBottomTickSize"]
      | ResponsiveBarChartAction["setAxisLeftLegendOffset"]
      | ResponsiveBarChartAction["setAxisLeftTickPadding"]
      | ResponsiveBarChartAction["setAxisLeftTickRotation"]
      | ResponsiveBarChartAction["setAxisLeftTickSize"]
      | ResponsiveBarChartAction["setAxisRightLegendOffset"]
      | ResponsiveBarChartAction["setAxisRightTickPadding"]
      | ResponsiveBarChartAction["setAxisRightTickRotation"]
      | ResponsiveBarChartAction["setAxisRightTickSize"]
      | ResponsiveBarChartAction["setAxisTopLegendOffset"]
      | ResponsiveBarChartAction["setAxisTopTickPadding"]
      | ResponsiveBarChartAction["setAxisTopTickRotation"]
      | ResponsiveBarChartAction["setAxisTopTickSize"]
      | ResponsiveBarChartAction["setChartBorderRadius"]
      | ResponsiveBarChartAction["setChartBorderWidth"]
      | ResponsiveBarChartAction["setInnerPaddingBar"]
      | ResponsiveBarChartAction["setLabelSkipHeight"]
      | ResponsiveBarChartAction["setLabelSkipWidth"]
      | ResponsiveBarChartAction["setLegendItemHeight"]
      | ResponsiveBarChartAction["setLegendItemOpacity"]
      | ResponsiveBarChartAction["setLegendItemWidth"]
      | ResponsiveBarChartAction["setLegendItemsSpacing"]
      | ResponsiveBarChartAction["setLegendSymbolBorderWidth"]
      | ResponsiveBarChartAction["setLegendSymbolSize"]
      | ResponsiveBarChartAction["setLegendSymbolSpacing"]
      | ResponsiveBarChartAction["setLegendTranslateX"]
      | ResponsiveBarChartAction["setLegendTranslateY"]
      | ResponsiveBarChartAction["setMarginBottom"]
      | ResponsiveBarChartAction["setMarginLeft"]
      | ResponsiveBarChartAction["setMarginRight"]
      | ResponsiveBarChartAction["setMarginTop"]
      | ResponsiveBarChartAction["setPaddingBar"]
      | ResponsiveBarChartAction["setScreenshotImageQuality"];

    payload: number;
  }
  | {
    action:
      | ResponsiveBarChartAction["setAxisBottomLegend"]
      | ResponsiveBarChartAction["setAxisLeftLegend"]
      | ResponsiveBarChartAction["setAxisRightLegend"]
      | ResponsiveBarChartAction["setAxisTopLegend"]
      | ResponsiveBarChartAction["setChartBorderColor"]
      | ResponsiveBarChartAction["setChartTitle"]
      | ResponsiveBarChartAction["setChartTitleColor"]
      | ResponsiveBarChartAction["setLabelTextColor"]
      | ResponsiveBarChartAction["setLegendItemBackground"]
      | ResponsiveBarChartAction["setLegendItemTextColor"]
      | ResponsiveBarChartAction["setLegendSymbolBorderColor"]
      | ResponsiveBarChartAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action:
      | ResponsiveBarChartAction["setAxisTopLegendPosition"]
      | ResponsiveBarChartAction["setAxisRightLegendPosition"]
      | ResponsiveBarChartAction["setAxisBottomLegendPosition"]
      | ResponsiveBarChartAction["setAxisLeftLegendPosition"];
    payload: NivoAxisLegendPosition;
  }
  | {
    action: ResponsiveBarChartAction["setLegendAnchor"];
    payload: NivoLegendAnchor;
  }
  | {
    action: ResponsiveBarChartAction["setLegendDirection"];
    payload: NivoLegendDirection;
  }
  | {
    action: ResponsiveBarChartAction["setLegendItemDirection"];
    payload: NivoLegendItemDirection;
  }
  | {
    action: ResponsiveBarChartAction["setLegendSymbolShape"];
    payload: NivoLegendSymbolShape;
  }
  | {
    action: ResponsiveBarChartAction["setMotionConfig"];
    payload: NivoMotionConfig;
  }
  | {
    action: ResponsiveBarChartAction["setChartColors"];
    payload: NivoColorScheme;
  }
  | {
    action: ResponsiveBarChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsiveBarChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsiveBarChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsiveBarChartAction["resetChartToDefault"];
    payload: ResponsiveBarChartState;
  }
  | {
    action: ResponsiveBarChartAction["setIsError"];
    payload: boolean;
  };
 */

const responsiveBarChartReducer_setLayoutZ = z.object({
    action: z.literal(responsiveBarChartAction.setLayout),
    payload: z.enum(["horizontal", "vertical"]),
});

const responsiveBarChartReducer_setValueScaleZ = z.object({
    action: z.literal(responsiveBarChartAction.setValueScale),
    payload: z.enum(["linear", "symlog"]),
});

const responsiveBarChartReducer_setBooleanZ = z.object({
    action: z.union([
        z.literal(responsiveBarChartAction.setEnableAnimate),
        z.literal(responsiveBarChartAction.setEnableAxisBottom),
        z.literal(responsiveBarChartAction.setEnableAxisLeft),
        z.literal(responsiveBarChartAction.setEnableAxisRight),
        z.literal(responsiveBarChartAction.setEnableAxisTop),
        z.literal(responsiveBarChartAction.setEnableFillPatterns),
        z.literal(responsiveBarChartAction.setEnableGridX),
        z.literal(responsiveBarChartAction.setEnableGridY),
        z.literal(responsiveBarChartAction.setEnableLabels),
        z.literal(responsiveBarChartAction.setEnableLegend),
        z.literal(responsiveBarChartAction.setEnableLegendJustify),
        z.literal(responsiveBarChartAction.setReverse),
    ]),
    payload: z.boolean(),
});

const responsiveBarChartReducer_setNumberZ = z.object({
    action: z.union([
        z.literal(responsiveBarChartAction.setAxisBottomLegendOffset),
        z.literal(responsiveBarChartAction.setAxisBottomTickPadding),
        z.literal(responsiveBarChartAction.setAxisBottomTickRotation),
        z.literal(responsiveBarChartAction.setAxisBottomTickSize),
        z.literal(responsiveBarChartAction.setAxisLeftLegendOffset),
        z.literal(responsiveBarChartAction.setAxisLeftTickPadding),
        z.literal(responsiveBarChartAction.setAxisLeftTickRotation),
        z.literal(responsiveBarChartAction.setAxisLeftTickSize),
        z.literal(responsiveBarChartAction.setAxisRightLegendOffset),
        z.literal(responsiveBarChartAction.setAxisRightTickPadding),
        z.literal(responsiveBarChartAction.setAxisRightTickRotation),
        z.literal(responsiveBarChartAction.setAxisRightTickSize),
        z.literal(responsiveBarChartAction.setAxisTopLegendOffset),
        z.literal(responsiveBarChartAction.setAxisTopTickPadding),
        z.literal(responsiveBarChartAction.setAxisTopTickRotation),
        z.literal(responsiveBarChartAction.setAxisTopTickSize),
        z.literal(responsiveBarChartAction.setChartBorderRadius),
        z.literal(responsiveBarChartAction.setChartBorderWidth),
        z.literal(responsiveBarChartAction.setInnerPaddingBar),
        z.literal(responsiveBarChartAction.setLabelSkipHeight),
        z.literal(responsiveBarChartAction.setLabelSkipWidth),
        z.literal(responsiveBarChartAction.setLegendItemHeight),
        z.literal(responsiveBarChartAction.setLegendItemOpacity),
        z.literal(responsiveBarChartAction.setLegendItemWidth),
        z.literal(responsiveBarChartAction.setLegendItemsSpacing),
        z.literal(responsiveBarChartAction.setLegendSymbolBorderWidth),
        z.literal(responsiveBarChartAction.setLegendSymbolSize),
        z.literal(responsiveBarChartAction.setLegendSymbolSpacing),
        z.literal(responsiveBarChartAction.setLegendTranslateX),
        z.literal(responsiveBarChartAction.setLegendTranslateY),
        z.literal(responsiveBarChartAction.setMarginBottom),
        z.literal(responsiveBarChartAction.setMarginLeft),
        z.literal(responsiveBarChartAction.setMarginRight),
        z.literal(responsiveBarChartAction.setMarginTop),
        z.literal(responsiveBarChartAction.setPaddingBar),
        z.literal(responsiveBarChartAction.setScreenshotImageQuality),
    ]),
    payload: z.number(),
});

const responsiveBarChartReducer_setStringZ = z.object({
    action: z.union([
        z.literal(responsiveBarChartAction.setAxisBottomLegend),
        z.literal(responsiveBarChartAction.setAxisLeftLegend),
        z.literal(responsiveBarChartAction.setAxisRightLegend),
        z.literal(responsiveBarChartAction.setAxisTopLegend),
        z.literal(responsiveBarChartAction.setChartBorderColor),
        z.literal(responsiveBarChartAction.setChartTitle),
        z.literal(responsiveBarChartAction.setChartTitleColor),
        z.literal(responsiveBarChartAction.setLabelTextColor),
        z.literal(responsiveBarChartAction.setLegendItemBackground),
        z.literal(responsiveBarChartAction.setLegendItemTextColor),
        z.literal(responsiveBarChartAction.setLegendSymbolBorderColor),
        z.literal(responsiveBarChartAction.setScreenshotFilename),
    ]),
    payload: z.string(),
});

const responsiveBarChartReducer_setLegendPositionZ = z.object({
    action: z.union([
        z.literal(responsiveBarChartAction.setAxisTopLegendPosition),
        z.literal(responsiveBarChartAction.setAxisRightLegendPosition),
        z.literal(responsiveBarChartAction.setAxisBottomLegendPosition),
        z.literal(responsiveBarChartAction.setAxisLeftLegendPosition),
    ]),
    payload: z.enum([
        "start",
        "middle",
        "end",
    ]),
});

const responsiveBarChartReducer_setLegendAnchorZ = z.object({
    action: z.literal(responsiveBarChartAction.setLegendAnchor),
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

const responsiveBarChartReducer_setLegendDirectionZ = z.object({
    action: z.literal(responsiveBarChartAction.setLegendDirection),
    payload: z.enum(["column", "row"]),
});

const responsiveBarChartReducer_setLegendItemDirectionZ = z.object({
    action: z.literal(responsiveBarChartAction.setLegendItemDirection),
    payload: z.enum([
        "left-to-right",
        "right-to-left",
        "top-to-bottom",
        "bottom-to-top",
    ]),
});

const responsiveBarChartReducer_setLegendSymbolShapeZ = z.object({
    action: z.literal(responsiveBarChartAction.setLegendSymbolShape),
    payload: z.enum([
        "circle",
        "diamond",
        "square",
        "triangle",
    ]),
});

const responsiveBarChartReducer_setMotionConfigZ = z.object({
    action: z.literal(responsiveBarChartAction.setMotionConfig),
    payload: z.enum([
        "default",
        "noWobble",
        "gentle",
        "wobbly",
        "stiff",
        "slow",
        "slowInSlowOut",
    ]),
});

const responsiveBarChartReducer_setChartColorsZ = z.object({
    action: z.literal(responsiveBarChartAction.setChartColors),
    payload: z.enum([
        "nivo",
        "category10",
        "accent",
        "dark2",
        "paired",
        "pastel1",
        "pastel2",
        "set1",
        "set2",
        "set3",
    ]),
});

export { responsiveBarChartReducer_setGroupModeZ };
export type { SetGroupModeBarDispatch };
