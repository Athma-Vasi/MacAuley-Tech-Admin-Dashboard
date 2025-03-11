import type { TitleOrder } from "@mantine/core";

import type { ValueFormat } from "@nivo/core";
import type {
  ScreenshotImageType,
  SetPageInErrorPayload,
} from "../../../types";
import type {
  NivoArcLabel,
  NivoChartTitlePosition,
  NivoColorScheme,
  NivoFillPatternObject,
  NivoMotionConfig,
  NivoTransitionMode,
} from "../types";
import type { ResponsiveSunburstChartAction } from "./actions";

type SunburstChartData = {
  name: string;
  value?: number;
  children?: SunburstChartData[];
};

type ResponsiveSunburstChartProps = {
  chartHeight?: number;
  chartWidth?: number;
  hideControls?: boolean;
  sunburstChartData: SunburstChartData;
  valueFormat?: ValueFormat<number> | undefined;
};

type ResponsiveSunburstChartState = {
  // base
  cornerRadius: number; // 0px - 45px default: 0 step: 1

  // margin
  marginTop: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1

  // style
  chartBorderColor: string; // default: 'white'
  chartBorderWidth: number; // 0px - 20px default: 1 step: 1
  chartColors: NivoColorScheme; // default: 'nivo'
  enableFillPatterns: boolean; // default: false
  fillPatterns: NivoFillPatternObject[]; // default: []
  inheritColorFromParent: boolean; // default: true

  // arc labels
  enableArcLabels: boolean; // default: false
  arcLabel: NivoArcLabel; // default: 'formattedValue'
  arcLabelsRadiusOffset: number; // 0 - 2 default: 0.5 step: 0.05
  arcLabelsSkipAngle: number; // 0 - 45 default: 0 step: 1
  arcLabelsTextColor: string; // default: 'gray'

  // motion
  enableAnimate: boolean; // default: true
  motionConfig: NivoMotionConfig; // default: 'gentle'
  transitionMode: NivoTransitionMode; // default: 'innerRadius'

  // options
  chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1

  // screenshot
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;

  pagesInError: Set<number>;
};

type ResponsiveSunburstChartDispatch =
  | {
    action:
      | ResponsiveSunburstChartAction["setArcLabelsRadiusOffset"]
      | ResponsiveSunburstChartAction["setArcLabelsSkipAngle"]
      | ResponsiveSunburstChartAction["setChartBorderWidth"]
      | ResponsiveSunburstChartAction["setCornerRadius"]
      | ResponsiveSunburstChartAction["setMarginBottom"]
      | ResponsiveSunburstChartAction["setMarginLeft"]
      | ResponsiveSunburstChartAction["setMarginRight"]
      | ResponsiveSunburstChartAction["setMarginTop"]
      | ResponsiveSunburstChartAction["setScreenshotImageQuality"];

    payload: number;
  }
  | {
    action:
      | ResponsiveSunburstChartAction["setArcLabelsTextColor"]
      | ResponsiveSunburstChartAction["setChartBorderColor"]
      | ResponsiveSunburstChartAction["setChartTitle"]
      | ResponsiveSunburstChartAction["setChartTitleColor"]
      | ResponsiveSunburstChartAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action:
      | ResponsiveSunburstChartAction["setEnableAnimate"]
      | ResponsiveSunburstChartAction["setEnableArcLabels"]
      | ResponsiveSunburstChartAction["setEnableFillPatterns"]
      | ResponsiveSunburstChartAction["setInheritColorFromParent"];

    payload: boolean;
  }
  | {
    action: ResponsiveSunburstChartAction["setChartColors"];
    payload: NivoColorScheme;
  }
  | {
    action: ResponsiveSunburstChartAction["setArcLabel"];
    payload: NivoArcLabel;
  }
  | {
    action: ResponsiveSunburstChartAction["setMotionConfig"];
    payload: NivoMotionConfig;
  }
  | {
    action: ResponsiveSunburstChartAction["setTransitionMode"];
    payload: NivoTransitionMode;
  }
  | {
    action: ResponsiveSunburstChartAction["setFillPatterns"];
    payload: NivoFillPatternObject[];
  }
  | {
    action: ResponsiveSunburstChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsiveSunburstChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsiveSunburstChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsiveSunburstChartAction["resetChartToDefault"];
    payload: ResponsiveSunburstChartState;
  }
  | {
    action: ResponsiveSunburstChartAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

export type {
  ResponsiveSunburstChartDispatch,
  ResponsiveSunburstChartProps,
  ResponsiveSunburstChartState,
  SunburstChartData,
};
