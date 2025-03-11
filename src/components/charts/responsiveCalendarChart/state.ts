import type { ResponsiveCalendarChartState } from "./types";

const initialResponsiveCalendarChartState: ResponsiveCalendarChartState = {
  // base
  calendarDirection: "horizontal",
  calendarAlign: "center",

  // margin
  marginTop: 60,
  marginRight: 60,
  marginBottom: 60,
  marginLeft: 60,

  // style
  emptyColor: "#fff",
  enableDefaultColors: true,

  // years
  yearSpacing: 30,
  yearLegendPosition: "before",
  yearLegendOffset: 10,

  // months
  monthSpacing: 0,
  monthBorderWidth: 2,
  monthBorderColor: "#000",
  monthLegendPosition: "before",
  monthLegendOffset: 10,

  // days
  daySpacing: 0,
  dayBorderWidth: 1,
  dayBorderColor: "#000",

  // options
  chartTitle: "",
  chartTitleColor: "dark",
  chartTitlePosition: "center",
  chartTitleSize: 3,

  // screenshot
  screenshotFilename: "",
  screenshotImageQuality: 1,
  screenshotImageType: "image/png",

  // error
  pagesInError: new Set(),
};

export { initialResponsiveCalendarChartState };
