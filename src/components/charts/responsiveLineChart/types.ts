import type { TitleOrder } from "@mantine/core";
import type { ValueFormat } from "@nivo/core";

import type {
  ScreenshotImageType,
  SetPageInErrorPayload,
} from "../../../types";
import type {
  NivoAxisLegendPosition,
  NivoChartTitlePosition,
  NivoChartUnitKind,
  NivoColorScheme,
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
  NivoLineAreaBlendMode,
  NivoLineAxesScale,
  NivoLineCrosshairType,
  NivoLineCurve,
  NivoLinePointLabel,
  NivoMotionConfig,
} from "../types";
import type { ResponsiveLineChartAction } from "./actions";

type LineChartData = {
  id: string;
  data: {
    x: string;
    y: number;
  }[];
};

type ResponsiveLineChartProps = {
  chartHeight?: number;
  chartWidth?: number;
  dashboardChartTitle?: string;
  hideControls?: boolean;
  lineChartData: LineChartData[];
  xFormat?: ValueFormat<any>;
  yFormat?: ValueFormat<any>;
  yScaleMin?: number | "auto";
  yScaleMax?: number | "auto";
  unitKind?: NivoChartUnitKind;
};

type ResponsiveLineChartState = {
  // base
  enableYScaleStacked: boolean; // default: false
  reverseScale: boolean; // default: false
  xScale: NivoLineAxesScale; // default: point
  yScale: NivoLineAxesScale; // default: linear

  // margin
  marginTop: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1

  // style
  areaBlendMode: NivoLineAreaBlendMode; // default: 'normal'
  areaOpacity: number; // 0 - 1 default: 0.2 step: 0.1
  chartColors: NivoColorScheme; // default: 'nivo'
  enableArea: boolean; // default: false
  lineCurve: NivoLineCurve; // default: 'linear'
  lineWidth: number; // 0px - 20px default: 2 step: 1

  // points
  enablePointLabel: boolean; // default: false
  enablePoints: boolean; // default: false

  pointBorderWidth: number; // 0px - 20px default: 0 step: 1
  pointColor: string; // default: rgba(0, 0, 0, 0)
  pointLabel: NivoLinePointLabel; // default: 'y'
  pointLabelYOffset: number; // -22px - 24px default: -12 step: 1
  pointSize: number; // 0px - 20px default: 6 step: 1

  // grids
  enableGridX: boolean; // default: true
  enableGridY: boolean; // default: true

  // axes
  // axisTop
  axisTopLegend: string; // default: ''
  axisTopLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisTopLegendPosition: NivoAxisLegendPosition; // default: middle
  axisTopTickPadding: number; // 0px - 20px default: 5 step: 1
  axisTopTickRotation: number; // -90° - 90° default: 0 step: 1
  axisTopTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisTop: boolean; // default: false ? null
  // axisRight
  axisRightLegend: string; // default: ''
  axisRightLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisRightLegendPosition: NivoAxisLegendPosition; // default: middle
  axisRightTickPadding: number; // 0px - 20px default: 5 step: 1
  axisRightTickRotation: number; // -90° - 90° default: 0 step: 1
  axisRightTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisRight: boolean; // default: false ? null
  // axisBottom
  axisBottomLegend: string; // default: ''
  axisBottomLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisBottomLegendPosition: NivoAxisLegendPosition; // default: middle
  axisBottomTickPadding: number; // 0px - 20px default: 5 step: 1
  axisBottomTickRotation: number; // -90° - 90° default: 0 step: 1
  axisBottomTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisBottom: boolean; // default: true ? {...} : null
  // axisLeft
  axisLeftLegend: string; // default: ''
  axisLeftLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisLeftLegendPosition: NivoAxisLegendPosition; // default: middle
  axisLeftTickPadding: number; // 0px - 20px default: 5 step: 1
  axisLeftTickRotation: number; // -90° - 90° default: 0 step: 1
  axisLeftTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisLeft: boolean; // default: true ? {...} : null

  // interactivity
  enableCrosshair: boolean; // default: true
  crosshairType: NivoLineCrosshairType; // default: 'bottom-left'

  // legends
  enableLegend: boolean; // default: false
  enableLegendJustify: boolean; // default: false
  legendAnchor: NivoLegendAnchor; // default: bottom-right
  legendDirection: NivoLegendDirection; // default: column
  legendItemBackground: string; // default: 'rgba(255, 255, 255, 0)'
  legendItemDirection: NivoLegendItemDirection; // default: left-to-right
  legendItemHeight: number; // 10px - 200px default: 20 step: 1
  legendItemOpacity: number; // 0 - 1 default: 1 step: 0.05
  legendItemTextColor: string; // default: 'gray'
  legendItemWidth: number; // 10px - 200px default: 60 step: 1
  legendItemsSpacing: number; // 0px - 60px default: 2 step: 1
  legendSymbolBorderColor: string; // default: gray
  legendSymbolBorderWidth: number; // 0px - 20px default: 0 step: 1
  legendSymbolShape: NivoLegendSymbolShape; // default: circle
  legendSymbolSize: number; // 2px - 60px default: 12 step: 1
  legendSymbolSpacing: number; // 0px - 20px default: 8 step: 1
  legendTranslateX: number; // -200px - 200px default: 0 step: 1
  legendTranslateY: number; // -200px - 200px default: 0 step: 1

  // motion
  enableAnimate: boolean; // default: true
  motionConfig: NivoMotionConfig; // default: 'gentle'

  // options
  chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1

  // screenshot
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;

  // error
  pagesInError: Set<number>;
};

type ResponsiveLineChartDispatch =
  | {
    action:
      | ResponsiveLineChartAction["setAxisBottomLegend"]
      | ResponsiveLineChartAction["setAxisLeftLegend"]
      | ResponsiveLineChartAction["setAxisRightLegend"]
      | ResponsiveLineChartAction["setAxisTopLegend"]
      | ResponsiveLineChartAction["setChartTitle"]
      | ResponsiveLineChartAction["setChartTitleColor"]
      | ResponsiveLineChartAction["setLegendItemBackground"]
      | ResponsiveLineChartAction["setLegendItemTextColor"]
      | ResponsiveLineChartAction["setLegendSymbolBorderColor"]
      | ResponsiveLineChartAction["setPointColor"]
      | ResponsiveLineChartAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action:
      | ResponsiveLineChartAction["setAreaOpacity"]
      | ResponsiveLineChartAction["setAxisBottomLegendOffset"]
      | ResponsiveLineChartAction["setAxisBottomTickPadding"]
      | ResponsiveLineChartAction["setAxisBottomTickRotation"]
      | ResponsiveLineChartAction["setAxisBottomTickSize"]
      | ResponsiveLineChartAction["setAxisLeftLegendOffset"]
      | ResponsiveLineChartAction["setAxisLeftTickPadding"]
      | ResponsiveLineChartAction["setAxisLeftTickRotation"]
      | ResponsiveLineChartAction["setAxisLeftTickSize"]
      | ResponsiveLineChartAction["setAxisRightLegendOffset"]
      | ResponsiveLineChartAction["setAxisRightTickPadding"]
      | ResponsiveLineChartAction["setAxisRightTickRotation"]
      | ResponsiveLineChartAction["setAxisRightTickSize"]
      | ResponsiveLineChartAction["setAxisTopLegendOffset"]
      | ResponsiveLineChartAction["setAxisTopTickPadding"]
      | ResponsiveLineChartAction["setAxisTopTickRotation"]
      | ResponsiveLineChartAction["setAxisTopTickSize"]
      | ResponsiveLineChartAction["setLegendItemHeight"]
      | ResponsiveLineChartAction["setLegendItemOpacity"]
      | ResponsiveLineChartAction["setLegendItemWidth"]
      | ResponsiveLineChartAction["setLegendItemsSpacing"]
      | ResponsiveLineChartAction["setLegendSymbolBorderWidth"]
      | ResponsiveLineChartAction["setLegendSymbolSize"]
      | ResponsiveLineChartAction["setLegendSymbolSpacing"]
      | ResponsiveLineChartAction["setLegendTranslateX"]
      | ResponsiveLineChartAction["setLegendTranslateY"]
      | ResponsiveLineChartAction["setLineWidth"]
      | ResponsiveLineChartAction["setMarginBottom"]
      | ResponsiveLineChartAction["setMarginLeft"]
      | ResponsiveLineChartAction["setMarginRight"]
      | ResponsiveLineChartAction["setMarginTop"]
      | ResponsiveLineChartAction["setPointBorderWidth"]
      | ResponsiveLineChartAction["setPointLabelYOffset"]
      | ResponsiveLineChartAction["setPointSize"]
      | ResponsiveLineChartAction["setScreenshotImageQuality"];

    payload: number;
  }
  | {
    action:
      | ResponsiveLineChartAction["setEnableAnimate"]
      | ResponsiveLineChartAction["setEnableArea"]
      | ResponsiveLineChartAction["setEnableAxisBottom"]
      | ResponsiveLineChartAction["setEnableAxisLeft"]
      | ResponsiveLineChartAction["setEnableAxisRight"]
      | ResponsiveLineChartAction["setEnableAxisTop"]
      | ResponsiveLineChartAction["setEnableCrosshair"]
      | ResponsiveLineChartAction["setEnableGridX"]
      | ResponsiveLineChartAction["setEnableGridY"]
      | ResponsiveLineChartAction["setEnableLegend"]
      | ResponsiveLineChartAction["setEnableLegendJustify"]
      | ResponsiveLineChartAction["setEnablePointLabel"]
      | ResponsiveLineChartAction["setEnablePoints"]
      | ResponsiveLineChartAction["setEnableYScaleStacked"]
      | ResponsiveLineChartAction["setReverseScale"];

    payload: boolean;
  }
  | {
    action: ResponsiveLineChartAction["setChartColors"];
    payload: NivoColorScheme;
  }
  | {
    action: ResponsiveLineChartAction["setLineCurve"];
    payload: NivoLineCurve;
  }
  | {
    action: ResponsiveLineChartAction["setAreaBlendMode"];
    payload: NivoLineAreaBlendMode;
  }
  | {
    action:
      | ResponsiveLineChartAction["setAxisTopLegendPosition"]
      | ResponsiveLineChartAction["setAxisRightLegendPosition"]
      | ResponsiveLineChartAction["setAxisBottomLegendPosition"]
      | ResponsiveLineChartAction["setAxisLeftLegendPosition"];

    payload: NivoAxisLegendPosition;
  }
  | {
    action: ResponsiveLineChartAction["setLegendAnchor"];
    payload: NivoLegendAnchor;
  }
  | {
    action: ResponsiveLineChartAction["setLegendDirection"];
    payload: NivoLegendDirection;
  }
  | {
    action: ResponsiveLineChartAction["setLegendItemDirection"];
    payload: NivoLegendItemDirection;
  }
  | {
    action: ResponsiveLineChartAction["setLegendSymbolShape"];
    payload: NivoLegendSymbolShape;
  }
  | {
    action: ResponsiveLineChartAction["setMotionConfig"];
    payload: NivoMotionConfig;
  }
  | {
    action: ResponsiveLineChartAction["setCrosshairType"];
    payload: NivoLineCrosshairType;
  }
  | {
    action:
      | ResponsiveLineChartAction["setXScale"]
      | ResponsiveLineChartAction["setYScale"];

    payload: NivoLineAxesScale;
  }
  | {
    action: ResponsiveLineChartAction["setPointLabel"];
    payload: NivoLinePointLabel;
  }
  | {
    action: ResponsiveLineChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsiveLineChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsiveLineChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsiveLineChartAction["resetChartToDefault"];
    payload: ResponsiveLineChartState;
  }
  | {
    action: ResponsiveLineChartAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

export type {
  LineChartData,
  ResponsiveLineChartAction,
  ResponsiveLineChartDispatch,
  ResponsiveLineChartProps,
  ResponsiveLineChartState,
};
