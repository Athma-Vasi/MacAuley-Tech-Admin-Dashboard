import type { TitleOrder } from "@mantine/core";

import type {
    ScreenshotImageType,
    SetPageInErrorPayload,
} from "../../../types";
import type {
    NivoAxisLegendPosition,
    NivoBarGroupMode,
    NivoBarLayout,
    NivoBarValueScale,
    NivoChartTitlePosition,
    NivoChartUnitKind,
    NivoColorScheme,
    NivoLegendAnchor,
    NivoLegendDirection,
    NivoLegendItemDirection,
    NivoLegendSymbolShape,
    NivoMotionConfig,
} from "../types";
import type { ResponsiveBarChartAction } from "./actions";

type BarChartData<
    BarObj extends Record<string, string | number> = Record<
        string,
        string | number
    >,
> = BarObj & {
    [key: string]: string | number;
};

type ResponsiveBarChartProps = {
    barChartData: BarChartData[];
    chartHeight?: number;
    chartWidth?: number;
    dashboardChartTitle?: string;
    hideControls?: boolean;
    indexBy: string;
    keys: string[];
    unitKind?: NivoChartUnitKind;
};

type ResponsiveBarChartState = {
    /** base */
    groupMode: NivoBarGroupMode; // default: stacked
    layout: NivoBarLayout; // default: horizontal
    valueScale: NivoBarValueScale; // default: linear
    reverse: boolean; // default: false
    // base -> value scale
    innerPaddingBar: number; // 0 - 10 default: 0 step: 1
    paddingBar: number; // 0.1 - 0.9 default: 0.1 step: 0.1

    // base -> margin
    marginTop: number; // 0px - 200px default: 60 step: 1
    marginRight: number; // 0px - 200px default: 60 step: 1
    marginBottom: number; // 0px - 200px default: 60 step: 1
    marginLeft: number; // 0px - 200px default: 60 step: 1

    /** style */
    chartBorderColor: string; // default: #ffffff
    chartBorderRadius: number; // 0px - 36px default: 0 step: 1
    chartBorderWidth: number; // 0px - 20px default: 0 step: 1
    chartColors: NivoColorScheme; // default: nivo
    enableFillPatterns: boolean; // default: false

    /** labels */
    enableLabels: boolean; // default: true
    labelSkipWidth: number; // 0 - 36 default: 0 step: 1
    labelSkipHeight: number; // 0 - 36 default: 0 step: 1
    labelTextColor: string; // default: #ffffff

    /** grid and axes */
    enableGridX: boolean; // default: false
    enableGridY: boolean; // default: true
    // axis -> axisTop
    axisTopLegend: string; // default: ''
    axisTopLegendOffset: number; // -60px - 60px default: 0 step: 1
    axisTopLegendPosition: NivoAxisLegendPosition; // default: middle
    axisTopTickPadding: number; // 0px - 20px default: 5 step: 1
    axisTopTickRotation: number; // -90° - 90° default: 0 step: 1
    axisTopTickSize: number; // 0px - 20px default: 5 step: 1
    enableAxisTop: boolean; // default: false ? null
    // axis -> axisRight
    axisRightLegend: string; // default: ''
    axisRightLegendOffset: number; // -60px - 60px default: 0 step: 1
    axisRightLegendPosition: NivoAxisLegendPosition; // default: middle
    axisRightTickPadding: number; // 0px - 20px default: 5 step: 1
    axisRightTickRotation: number; // -90° - 90° default: 0 step: 1
    axisRightTickSize: number; // 0px - 20px default: 5 step: 1
    enableAxisRight: boolean; // default: false ? null
    // axis -> axisBottom
    axisBottomLegend: string; // default: ''
    axisBottomLegendOffset: number; // -60px - 60px default: 0 step: 1
    axisBottomLegendPosition: NivoAxisLegendPosition; // default: middle
    axisBottomTickPadding: number; // 0px - 20px default: 5 step: 1
    axisBottomTickRotation: number; // -90° - 90° default: 0 step: 1
    axisBottomTickSize: number; // 0px - 20px default: 5 step: 1
    enableAxisBottom: boolean; // default: true
    // axis -> axisLeft
    axisLeftLegend: string; // default: ''
    axisLeftLegendOffset: number; // -60px - 60px default: 0 step: 1
    axisLeftLegendPosition: NivoAxisLegendPosition; // default: middle
    axisLeftTickPadding: number; // 0px - 20px default: 5 step: 1
    axisLeftTickRotation: number; // -90° - 90° default: 0 step: 1
    axisLeftTickSize: number; // 0px - 20px default: 5 step: 1
    enableAxisLeft: boolean; // default: false ? null

    /** legend */
    enableLegend: boolean; // default: false
    enableLegendJustify: boolean; // default: false
    legendAnchor: NivoLegendAnchor; // default: bottom-right
    legendDirection: NivoLegendDirection; // default: column
    legendItemBackground: string; // default: 'rgba(255, 255, 255, 0)'
    legendItemDirection: NivoLegendItemDirection; // default: left-to-right
    legendItemHeight: number; // 10px - 200px default: 20 step: 1
    legendItemOpacity: number; // 0 - 1 default: 1 step: 0.05
    legendItemTextColor: string; // default: '#ffffff'
    legendItemWidth: number; // 10px - 200px default: 60 step: 1
    legendItemsSpacing: number; // 0px - 60px default: 2 step: 1
    legendSymbolBorderColor: string; // default: 'rgba(0, 0, 0, .5)'
    legendSymbolBorderWidth: number; // 0px - 20px default: 0 step: 1
    legendSymbolShape: NivoLegendSymbolShape; // default: circle
    legendSymbolSize: number; // 2px - 60px default: 12 step: 1
    legendSymbolSpacing: number; // 0px - 20px default: 8 step: 1
    legendTranslateX: number; // -200px - 200px default: 0 step: 1
    legendTranslateY: number; // -200px - 200px default: 0 step: 1

    /** motion */
    enableAnimate: boolean; // default: true
    motionConfig: NivoMotionConfig; // default: default

    /** options */
    chartTitle: string;
    chartTitleColor: string; // default: #ffffff
    chartTitlePosition: NivoChartTitlePosition; // default: center
    chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1

    /** screenshot */
    screenshotFilename: string;
    screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
    screenshotImageType: ScreenshotImageType;

    /** error */
    pagesInError: Set<number>;
};

type ResponsiveBarChartDispatch =
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
        action: ResponsiveBarChartAction["setPageInError"];
        payload: SetPageInErrorPayload;
    };

export type {
    BarChartData,
    ResponsiveBarChartAction,
    ResponsiveBarChartDispatch,
    ResponsiveBarChartProps,
    ResponsiveBarChartState,
};
