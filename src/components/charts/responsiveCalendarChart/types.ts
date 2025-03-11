import type { TitleOrder } from "@mantine/core";

import type {
  ScreenshotImageType,
  SetPageInErrorPayload,
} from "../../../types";
import type {
  NivoCalendarAlign,
  NivoCalendarDirection,
  NivoCalendarLegendPosition,
  NivoChartTitlePosition,
} from "../types";
import type { ResponsiveCalendarChartAction } from "./actions";

type CalendarChartData = {
  day: string; // YYYY-MM-DD
  value: number;
};

type ResponsiveCalendarChartProps = {
  calendarChartData: CalendarChartData[];
  chartHeight?: number;
  chartWidth?: number;
  dashboardChartTitle?: string;
  /** YYYY-MM-DD */
  from: string;
  /** YYYY-MM-DD */
  to: string;
  hideControls?: boolean;
};

type ResponsiveCalendarChartState = {
  // base
  calendarAlign: NivoCalendarAlign; // default: 'center'
  calendarDirection: NivoCalendarDirection; // default: 'horizontal'

  // margin
  marginTop: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1

  // style
  emptyColor: string; // default: '#fff'
  enableDefaultColors: boolean; // default: true

  // years
  yearLegendOffset: number; // 0px - 60px default: 10
  yearLegendPosition: NivoCalendarLegendPosition; // default: 'before'
  yearSpacing: number; // 0px - 160px default: 30 step: 1

  // months
  monthBorderColor: string; // default: '#000'
  monthBorderWidth: number; // 0px - 20px default: 2 step: 1
  monthLegendOffset: number; // 0px - 36px default: 10
  monthLegendPosition: NivoCalendarLegendPosition; // default: 'before'
  monthSpacing: number; // 0px - 160px default: 0 step: 1

  // days
  dayBorderColor: string; // default: '#000'
  dayBorderWidth: number; // 0px - 20px default: 1 step: 1
  daySpacing: number; // 0px - 20px default: 0 step: 1

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

type ResponsiveCalendarChartDispatch =
  | {
    action: ResponsiveCalendarChartAction["setCalendarDirection"];
    payload: NivoCalendarDirection;
  }
  | {
    action: ResponsiveCalendarChartAction["setCalendarAlign"];
    payload: NivoCalendarAlign;
  }
  | {
    action: ResponsiveCalendarChartAction["setEnableDefaultColors"];

    payload: boolean;
  }
  | {
    action:
      | ResponsiveCalendarChartAction["setDayBorderWidth"]
      | ResponsiveCalendarChartAction["setDaySpacing"]
      | ResponsiveCalendarChartAction["setMarginBottom"]
      | ResponsiveCalendarChartAction["setMarginLeft"]
      | ResponsiveCalendarChartAction["setMarginRight"]
      | ResponsiveCalendarChartAction["setMarginTop"]
      | ResponsiveCalendarChartAction["setMonthBorderWidth"]
      | ResponsiveCalendarChartAction["setMonthLegendOffset"]
      | ResponsiveCalendarChartAction["setMonthSpacing"]
      | ResponsiveCalendarChartAction["setScreenshotImageQuality"]
      | ResponsiveCalendarChartAction["setYearLegendOffset"]
      | ResponsiveCalendarChartAction["setYearSpacing"];

    payload: number;
  }
  | {
    action:
      | ResponsiveCalendarChartAction["setChartTitle"]
      | ResponsiveCalendarChartAction["setChartTitleColor"]
      | ResponsiveCalendarChartAction["setDayBorderColor"]
      | ResponsiveCalendarChartAction["setEmptyColor"]
      | ResponsiveCalendarChartAction["setMonthBorderColor"]
      | ResponsiveCalendarChartAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action:
      | ResponsiveCalendarChartAction["setYearLegendPosition"]
      | ResponsiveCalendarChartAction["setMonthLegendPosition"];
    payload: NivoCalendarLegendPosition;
  }
  | {
    action: ResponsiveCalendarChartAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ResponsiveCalendarChartAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ResponsiveCalendarChartAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ResponsiveCalendarChartAction["resetChartToDefault"];
    payload: ResponsiveCalendarChartState;
  }
  | {
    action: ResponsiveCalendarChartAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

export type {
  CalendarChartData,
  ResponsiveCalendarChartAction,
  ResponsiveCalendarChartDispatch,
  ResponsiveCalendarChartProps,
  ResponsiveCalendarChartState,
};
