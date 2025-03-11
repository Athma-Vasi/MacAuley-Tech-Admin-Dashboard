import type { TitleOrder } from "@mantine/core";

import type {
  ScreenshotImageType,
  SetPageInErrorPayload,
} from "../../../types";
import type {
  NivoChartTitlePosition,
  NivoColorScheme,
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
  NivoMotionConfig,
  NivoTransitionMode,
} from "../types";
import type { ResponsiveRadialBarChartAction } from "./actions";

type RadialBarChartData = {
  id: string;
  data: {
    x: string;
    y: number;
  }[];
};

type ResponsiveRadialBarChartProps = {
  chartHeight?: number;
  chartWidth?: number;
  hideControls?: boolean;
  radialBarChartData: RadialBarChartData[];
};

type ResponsiveRadialBarChartState = {
  // base
  // base -> margin
  marginTop: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1
  // base -> angles
  startAngle: number; // -360 - 360 default: 0 step: 1
  endAngle: number; // -360 - 360 default: 270 step: 1
  innerRadius: number; // 0 - 0.95 default: 0.3 step: 0.05
  paddingRing: number; // 0 - 0.9 default: 0.2 step: 0.1
  padAngle: number; // 0 - 45 default: 0 step: 1
  cornerRadius: number; // 0px - 45px default: 0 step: 1

  // style
  chartColors: NivoColorScheme; // default: 'nivo'
  ringBorderWidth: number; // 0px - 20px default: 0 step: 1
  ringBorderColor: string; // default: 'inherit'

  // tracks
  enableTracks: boolean; // default: true
  tracksColor: string; // default: '#ccc'

  // grids
  enableRadialGrid: boolean; // default: true
  enableCircularGrid: boolean; // default: true

  // axes
  // radial axis start
  enableRadialAxisStart: boolean; // default: true
  radialAxisStartTickSize: number; // 0 - 20 default: 5 step: 1
  radialAxisStartTickPadding: number; // 0 - 20 default: 5 step: 1
  radialAxisStartTickRotation: number; // -90 - 90 default: 0 step: 1

  // radial axis end
  enableRadialAxisEnd: boolean; // default: false
  radialAxisEndTickSize: number; // 0 - 20 default: 5 step: 1
  radialAxisEndTickPadding: number; // 0 - 20 default: 5 step: 1
  radialAxisEndTickRotation: number; // -90 - 90 default: 0 step: 1

  // circular axis inner
  enableCircularAxisInner: boolean; // default: false
  circularAxisInnerTickSize: number; // 0 - 20 default: 5 step: 1
  circularAxisInnerTickPadding: number; // 0 - 20 default: 5 step: 1
  circularAxisInnerTickRotation: number; // -90 - 90 default: 0 step: 1

  // circular axis outer
  enableCircularAxisOuter: boolean; // default: true
  circularAxisOuterTickSize: number; // 0 - 20 default: 5 step: 1
  circularAxisOuterTickPadding: number; // 0 - 20 default: 5 step: 1
  circularAxisOuterTickRotation: number; // -90 - 90 default: 0 step: 1

  // labels
  enableLabels: boolean; // default: false
  labelsSkipAngle: number; // 0 - 45 default: 10 step: 1
  labelsRadiusOffset: number; // 0 - 2 default: 0.5 step: 0.05
  labelsTextColor: string; // default: 'inherit'

  // legend
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

  // motion
  enableAnimate: boolean; // default: true
  motionConfig: NivoMotionConfig; // default: 'gentle'
  transitionMode: NivoTransitionMode; // default: 'centerRadius'

  /** options */
  chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1

  /** screenshot */
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;

  pagesInError: Set<number>;
};

type ResponsiveRadialBarChartDispatch =
  | {
    action:
      | ResponsiveRadialBarChartAction["setChartTitle"]
      | ResponsiveRadialBarChartAction["setChartTitleColor"]
      | ResponsiveRadialBarChartAction["setLabelsTextColor"]
      | ResponsiveRadialBarChartAction["setLegendItemBackground"]
      | ResponsiveRadialBarChartAction["setLegendItemTextColor"]
      | ResponsiveRadialBarChartAction["setLegendSymbolBorderColor"]
      | ResponsiveRadialBarChartAction["setRingBorderColor"]
      | ResponsiveRadialBarChartAction["setScreenshotFilename"]
      | ResponsiveRadialBarChartAction["setTracksColor"];

    payload: string;
  }
  | {
    action:
      | ResponsiveRadialBarChartAction["setScreenshotImageQuality"]
      | ResponsiveRadialBarChartAction["setCircularAxisInnerTickPadding"]
      | ResponsiveRadialBarChartAction["setCircularAxisInnerTickRotation"]
      | ResponsiveRadialBarChartAction["setCircularAxisInnerTickSize"]
      | ResponsiveRadialBarChartAction["setCircularAxisOuterTickPadding"]
      | ResponsiveRadialBarChartAction["setCircularAxisOuterTickRotation"]
      | ResponsiveRadialBarChartAction["setCircularAxisOuterTickSize"]
      | ResponsiveRadialBarChartAction["setCornerRadius"]
      | ResponsiveRadialBarChartAction["setEndAngle"]
      | ResponsiveRadialBarChartAction["setInnerRadius"]
      | ResponsiveRadialBarChartAction["setLabelsRadiusOffset"]
      | ResponsiveRadialBarChartAction["setLabelsSkipAngle"]
      | ResponsiveRadialBarChartAction["setLegendItemHeight"]
      | ResponsiveRadialBarChartAction["setLegendItemOpacity"]
      | ResponsiveRadialBarChartAction["setLegendItemWidth"]
      | ResponsiveRadialBarChartAction["setLegendItemsSpacing"]
      | ResponsiveRadialBarChartAction["setLegendSymbolBorderWidth"]
      | ResponsiveRadialBarChartAction["setLegendSymbolSize"]
      | ResponsiveRadialBarChartAction["setLegendSymbolSpacing"]
      | ResponsiveRadialBarChartAction["setLegendTranslateX"]
      | ResponsiveRadialBarChartAction["setLegendTranslateY"]
      | ResponsiveRadialBarChartAction["setMarginBottom"]
      | ResponsiveRadialBarChartAction["setMarginLeft"]
      | ResponsiveRadialBarChartAction["setMarginRight"]
      | ResponsiveRadialBarChartAction["setMarginTop"]
      | ResponsiveRadialBarChartAction["setPadAngle"]
      | ResponsiveRadialBarChartAction["setPaddingRing"]
      | ResponsiveRadialBarChartAction["setRadialAxisEndTickPadding"]
      | ResponsiveRadialBarChartAction["setRadialAxisEndTickRotation"]
      | ResponsiveRadialBarChartAction["setRadialAxisEndTickSize"]
      | ResponsiveRadialBarChartAction["setRadialAxisStartTickPadding"]
      | ResponsiveRadialBarChartAction["setRadialAxisStartTickRotation"]
      | ResponsiveRadialBarChartAction["setRadialAxisStartTickSize"]
      | ResponsiveRadialBarChartAction["setRingBorderWidth"]
      | ResponsiveRadialBarChartAction["setStartAngle"];

    payload: number;
  }
  | {
    action:
      | ResponsiveRadialBarChartAction["setEnableAnimate"]
      | ResponsiveRadialBarChartAction["setEnableCircularAxisInner"]
      | ResponsiveRadialBarChartAction["setEnableCircularAxisOuter"]
      | ResponsiveRadialBarChartAction["setEnableCircularGrid"]
      | ResponsiveRadialBarChartAction["setEnableLabels"]
      | ResponsiveRadialBarChartAction["setEnableLegend"]
      | ResponsiveRadialBarChartAction["setEnableLegendJustify"]
      | ResponsiveRadialBarChartAction["setEnableRadialAxisEnd"]
      | ResponsiveRadialBarChartAction["setEnableRadialAxisStart"]
      | ResponsiveRadialBarChartAction["setEnableRadialGrid"]
      | ResponsiveRadialBarChartAction["setEnableTracks"];

    payload: boolean;
  }
  | {
    action: ResponsiveRadialBarChartAction["setChartColors"];
    payload: NivoColorScheme;
  }
  | {
    action: ResponsiveRadialBarChartAction["setLegendAnchor"];
    payload: NivoLegendAnchor;
  }
  | {
    action: ResponsiveRadialBarChartAction["setLegendDirection"];
    payload: NivoLegendDirection;
  }
  | {
    action: ResponsiveRadialBarChartAction["setLegendItemDirection"];
    payload: NivoLegendItemDirection;
  }
  | {
    action: ResponsiveRadialBarChartAction["setLegendSymbolShape"];
    payload: NivoLegendSymbolShape;
  }
  | {
    action: ResponsiveRadialBarChartAction["setMotionConfig"];
    payload: NivoMotionConfig;
  }
  | {
    action: ResponsiveRadialBarChartAction["setTransitionMode"];
    payload: NivoTransitionMode;
  }
  | {
    action: ResponsiveRadialBarChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsiveRadialBarChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsiveRadialBarChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsiveRadialBarChartAction["resetChartToDefault"];
    payload: ResponsiveRadialBarChartState;
  }
  | {
    action: ResponsiveRadialBarChartAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

export type {
  RadialBarChartData,
  ResponsiveRadialBarChartDispatch,
  ResponsiveRadialBarChartProps,
  ResponsiveRadialBarChartState,
};
