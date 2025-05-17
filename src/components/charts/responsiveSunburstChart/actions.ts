import { Prettify } from "../../../types";
import { ResponsiveSunburstChartState } from "./types";

type ResponsiveSunburstChartAction = Prettify<
  {
    [K in keyof ResponsiveSunburstChartState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  } & {
    resetChartToDefault: "resetChartToDefault";
  }
>;

const responsiveSunburstChartAction: ResponsiveSunburstChartAction = {
  // base
  setCornerRadius: "setCornerRadius",

  // margin
  setMarginTop: "setMarginTop",
  setMarginRight: "setMarginRight",
  setMarginBottom: "setMarginBottom",
  setMarginLeft: "setMarginLeft",

  // style
  setChartColors: "setChartColors",
  setInheritColorFromParent: "setInheritColorFromParent",
  setChartBorderWidth: "setChartBorderWidth",
  setChartBorderColor: "setChartBorderColor",
  setEnableFillPatterns: "setEnableFillPatterns",
  setFillPatterns: "setFillPatterns",

  // arc labels
  setEnableArcLabels: "setEnableArcLabels",
  setArcLabel: "setArcLabel",
  setArcLabelsRadiusOffset: "setArcLabelsRadiusOffset",
  setArcLabelsSkipAngle: "setArcLabelsSkipAngle",
  setArcLabelsTextColor: "setArcLabelsTextColor",

  // motion
  setEnableAnimate: "setEnableAnimate",
  setMotionConfig: "setMotionConfig",
  setTransitionMode: "setTransitionMode",

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
  setIsError: "setIsError",
};

export { responsiveSunburstChartAction };
export type { ResponsiveSunburstChartAction };
