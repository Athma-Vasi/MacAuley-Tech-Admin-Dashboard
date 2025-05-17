import { Prettify } from "../../../types";
import { ResponsiveCalendarChartState } from "./types";

type ResponsiveCalendarChartAction = Prettify<
  {
    [K in keyof ResponsiveCalendarChartState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  } & {
    resetChartToDefault: "resetChartToDefault";
  }
>;

const responsiveCalendarChartAction: ResponsiveCalendarChartAction = {
  // base
  setCalendarAlign: "setCalendarAlign",
  setCalendarDirection: "setCalendarDirection",

  // margin
  setMarginTop: "setMarginTop",
  setMarginRight: "setMarginRight",
  setMarginBottom: "setMarginBottom",
  setMarginLeft: "setMarginLeft",

  // style
  setEmptyColor: "setEmptyColor",
  setEnableDefaultColors: "setEnableDefaultColors",

  // years
  setYearLegendOffset: "setYearLegendOffset",
  setYearLegendPosition: "setYearLegendPosition",
  setYearSpacing: "setYearSpacing",

  // months
  setMonthBorderColor: "setMonthBorderColor",
  setMonthBorderWidth: "setMonthBorderWidth",
  setMonthLegendOffset: "setMonthLegendOffset",
  setMonthLegendPosition: "setMonthLegendPosition",
  setMonthSpacing: "setMonthSpacing",

  // days
  setDayBorderColor: "setDayBorderColor",
  setDayBorderWidth: "setDayBorderWidth",
  setDaySpacing: "setDaySpacing",

  // options
  setChartTitle: "setChartTitle",
  setChartTitleColor: "setChartTitleColor",
  setChartTitlePosition: "setChartTitlePosition",
  setChartTitleSize: "setChartTitleSize",

  // screenshot
  setScreenshotFilename: "setScreenshotFilename",
  setScreenshotImageQuality: "setScreenshotImageQuality",
  setScreenshotImageType: "setScreenshotImageType",

  // reset all
  resetChartToDefault: "resetChartToDefault",

  // error
  setIsError: "setIsError",
};

export { responsiveCalendarChartAction };
export type { ResponsiveCalendarChartAction };
