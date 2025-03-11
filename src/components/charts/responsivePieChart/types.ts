import type { TitleOrder } from "@mantine/core";

import type {
  ScreenshotImageType,
  SetPageInErrorPayload,
} from "../../../types";
import type {
  NivoArcLabel,
  NivoChartTitlePosition,
  NivoChartUnitKind,
  NivoColorScheme,
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
  NivoMotionConfig,
  NivoTransitionMode,
} from "../types";
import type { ResponsivePieChartAction } from "./actions";

type PieChartData = {
  id: string;
  label: string;
  value: number;
};

type ResponsivePieChartProps = {
  chartHeight?: number;
  chartWidth?: number;
  dashboardChartTitle?: string;
  hideControls?: boolean;
  pieChartData: PieChartData[];
  unitKind?: NivoChartUnitKind;
};

type ResponsivePieChartState = {
  /** base */
  cornerRadius: number; // 0px - 45px default: 0 step: 1
  endAngle: number; // -360 - 360 default: 360 step: 1
  innerRadius: number; // 0 - 1 default: 0 step: 0.05
  padAngle: number; // 0 - 45 default: 0 step: 1
  sortByValue: boolean; // default: false
  startAngle: number; // -180 - 360 default: 0 step: 1

  /** style */
  arcBorderColor: string; // default: #ffffff
  arcBorderWidth: number; // 0px - 20px default: 0 step: 1
  colorScheme: NivoColorScheme;
  enableFillPatterns: boolean; // default: false

  /** arc labels */
  arcLabel: NivoArcLabel; // default: 'value'
  arcLabelsRadiusOffset: number; // 0 - 2 default:0.5 step: 0.05
  arcLabelsSkipAngle: number; // 0 - 45 default: 0 step: 1
  arcLabelsTextColor: string; // default: #333333
  enableArcLabels: boolean; // default: true

  /** arc link labels */
  arcLinkLabelsDiagonalLength: number; // 0px - 36px default: 16 step: 1
  arcLinkLabelsOffset: number; // -24px - 24px default: 0 step: 1
  arcLinkLabelsSkipAngle: number; // 0 - 45 default: 0 step: 1
  arcLinkLabelsStraightLength: number; // 0px - 36px default: 24 step: 1
  arcLinkLabelsTextColor: string; // default: #333333
  arcLinkLabelsTextOffset: number; // 0px - 36px default: 6 step: 1
  arcLinkLabelsThickness: number; // 0px - 20px default: 1 step: 1
  enableArcLinkLabels: boolean; // default: true

  /** interactivity */
  activeInnerRadiusOffset: number; // 0px - 50px default: 0 step: 1
  activeOuterRadiusOffset: number; // 0px - 50px default: 0 step: 1

  /** motion */
  enableAnimate: boolean; // default: true
  motionConfig: NivoMotionConfig;
  transitionMode: NivoTransitionMode;

  /** margin */
  marginTop: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1

  /** legend */
  enableLegend: boolean; // default: true
  enableLegendJustify: boolean; // default: false
  legendAnchor: NivoLegendAnchor; // default: bottom
  legendDirection: NivoLegendDirection; // default: row
  legendItemBackground: string; // default: 'rgba(255, 255, 255, 0)'
  legendItemDirection: NivoLegendItemDirection; // default: left-to-right
  legendItemHeight: number; // 10px - 200px default: 20 step: 1
  legendItemOpacity: number; // 0 - 1 default: 1 step: 0.05
  legendItemTextColor: string; // default: #000000
  legendItemWidth: number; // 10px - 200px default: 60 step: 1
  legendItemsSpacing: number; // 0px - 60px default: 0 step: 1
  legendSymbolBorderColor: string; // default: 'rgba(0, 0, 0, .5)'
  legendSymbolBorderWidth: number; // 0px - 20px default: 0 step: 1
  legendSymbolShape: NivoLegendSymbolShape; // default: circle
  legendSymbolSize: number; // 2px - 60px default: 12 step: 1
  legendSymbolSpacing: number; // 0px - 30px default: 8 step: 1
  legendTranslateX: number; // -200px - 200px default: 0 step: 1
  legendTranslateY: number; // -200px - 200px default: 0 step: 1

  /** options */
  chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1

  /** screenshot */
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;

  // error
  pagesInError: Set<number>;
};

type ResponsivePieChartDispatch =
  | {
    action:
      | ResponsivePieChartAction["setActiveInnerRadiusOffset"]
      | ResponsivePieChartAction["setActiveOuterRadiusOffset"]
      | ResponsivePieChartAction["setArcBorderWidth"]
      | ResponsivePieChartAction["setArcLabelsRadiusOffset"]
      | ResponsivePieChartAction["setArcLabelsSkipAngle"]
      | ResponsivePieChartAction["setArcLinkLabelsDiagonalLength"]
      | ResponsivePieChartAction["setArcLinkLabelsOffset"]
      | ResponsivePieChartAction["setArcLinkLabelsSkipAngle"]
      | ResponsivePieChartAction["setArcLinkLabelsStraightLength"]
      | ResponsivePieChartAction["setArcLinkLabelsTextOffset"]
      | ResponsivePieChartAction["setArcLinkLabelsThickness"]
      | ResponsivePieChartAction["setCornerRadius"]
      | ResponsivePieChartAction["setEndAngle"]
      | ResponsivePieChartAction["setInnerRadius"]
      | ResponsivePieChartAction["setLegendItemHeight"]
      | ResponsivePieChartAction["setLegendItemOpacity"]
      | ResponsivePieChartAction["setLegendItemWidth"]
      | ResponsivePieChartAction["setLegendItemsSpacing"]
      | ResponsivePieChartAction["setLegendSymbolBorderWidth"]
      | ResponsivePieChartAction["setLegendSymbolSize"]
      | ResponsivePieChartAction["setLegendSymbolSpacing"]
      | ResponsivePieChartAction["setLegendTranslateX"]
      | ResponsivePieChartAction["setLegendTranslateY"]
      | ResponsivePieChartAction["setMarginBottom"]
      | ResponsivePieChartAction["setMarginLeft"]
      | ResponsivePieChartAction["setMarginRight"]
      | ResponsivePieChartAction["setMarginTop"]
      | ResponsivePieChartAction["setPadAngle"]
      | ResponsivePieChartAction["setScreenshotImageQuality"]
      | ResponsivePieChartAction["setStartAngle"];

    payload: number;
  }
  | {
    // all boolean payloads
    action:
      | ResponsivePieChartAction["setEnableAnimate"]
      | ResponsivePieChartAction["setEnableArcLabels"]
      | ResponsivePieChartAction["setEnableArcLinkLabels"]
      | ResponsivePieChartAction["setEnableFillPatterns"]
      | ResponsivePieChartAction["setEnableLegend"]
      | ResponsivePieChartAction["setEnableLegendJustify"]
      | ResponsivePieChartAction["setSortByValue"];

    payload: boolean;
  }
  | {
    action: ResponsivePieChartAction["setColorScheme"];
    payload: NivoColorScheme;
  }
  | {
    action:
      | ResponsivePieChartAction["setArcBorderColor"]
      | ResponsivePieChartAction["setArcLabelsTextColor"]
      | ResponsivePieChartAction["setArcLinkLabelsTextColor"]
      | ResponsivePieChartAction["setChartTitle"]
      | ResponsivePieChartAction["setChartTitleColor"]
      | ResponsivePieChartAction["setLegendItemBackground"]
      | ResponsivePieChartAction["setLegendItemTextColor"]
      | ResponsivePieChartAction["setLegendSymbolBorderColor"]
      | ResponsivePieChartAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action: ResponsivePieChartAction["setArcLabel"];
    payload: NivoArcLabel;
  }
  | {
    action: ResponsivePieChartAction["setMotionConfig"];
    payload: NivoMotionConfig;
  }
  | {
    action: ResponsivePieChartAction["setTransitionMode"];
    payload: NivoTransitionMode;
  }
  | {
    action: ResponsivePieChartAction["setLegendAnchor"];
    payload: NivoLegendAnchor;
  }
  | {
    action: ResponsivePieChartAction["setLegendDirection"];
    payload: NivoLegendDirection;
  }
  | {
    action: ResponsivePieChartAction["setLegendItemDirection"];
    payload: NivoLegendItemDirection;
  }
  | {
    action: ResponsivePieChartAction["setLegendSymbolShape"];
    payload: NivoLegendSymbolShape;
  }
  | {
    action: ResponsivePieChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsivePieChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsivePieChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsivePieChartAction["resetChartToDefault"];
    payload: ResponsivePieChartState;
  }
  | {
    action: ResponsivePieChartAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

export type {
  PieChartData,
  ResponsivePieChartDispatch,
  ResponsivePieChartProps,
  ResponsivePieChartState,
};
