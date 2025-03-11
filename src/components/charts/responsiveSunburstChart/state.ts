import type { ResponsiveSunburstChartState } from "./types";

const initialResponsiveSunburstChartState: ResponsiveSunburstChartState = {
  // base
  cornerRadius: 0,

  // margin
  marginTop: 60,
  marginRight: 60,
  marginBottom: 60,
  marginLeft: 60,

  // style
  chartColors: "nivo",
  inheritColorFromParent: true,
  chartBorderWidth: 1,
  chartBorderColor: "#adb5bd",
  enableFillPatterns: false,
  fillPatterns: [],

  // arc labels
  enableArcLabels: true,
  arcLabel: "value",
  arcLabelsRadiusOffset: 0.5,
  arcLabelsSkipAngle: 0,
  arcLabelsTextColor: "#343a40",

  // motion
  enableAnimate: true,
  motionConfig: "gentle",
  transitionMode: "innerRadius",

  // options
  chartTitle: "",
  chartTitleColor: "#343a40",
  chartTitlePosition: "center",
  chartTitleSize: 3,

  // screenshot
  screenshotFilename: "",
  screenshotImageQuality: 1,
  screenshotImageType: "image/png",

  pagesInError: new Set(),
};

export { initialResponsiveSunburstChartState };
