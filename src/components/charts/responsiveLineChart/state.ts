import type { ResponsiveLineChartState } from "./types";

const initialResponsiveLineChartState: ResponsiveLineChartState = {
  // base
  enableYScaleStacked: true,
  reverseScale: false,
  xScale: "point",
  yScale: "linear",

  // margin
  marginTop: 60,
  marginRight: 60,
  marginBottom: 90,
  marginLeft: 90,

  // style
  areaBlendMode: "normal",
  areaOpacity: 0.2,
  chartColors: "nivo",
  enableArea: false,
  lineCurve: "catmullRom",
  lineWidth: 2,

  // points
  enablePoints: true,
  pointSize: 6,
  pointColor: "rgba(0, 0, 0, .25)",
  pointBorderWidth: 1,
  enablePointLabel: false,
  pointLabel: "y",
  pointLabelYOffset: -12,

  // grids
  enableGridX: true,
  enableGridY: true,

  // axes
  // axisTop
  axisTopLegend: "",
  axisTopLegendOffset: 0,
  axisTopLegendPosition: "middle",
  axisTopTickPadding: 5,
  axisTopTickRotation: 0,
  axisTopTickSize: 5,
  enableAxisTop: false,
  // axisRight
  axisRightLegend: "",
  axisRightLegendOffset: 0,
  axisRightLegendPosition: "middle",
  axisRightTickPadding: 5,
  axisRightTickRotation: 0,
  axisRightTickSize: 5,
  enableAxisRight: false,
  // axisBottom
  axisBottomLegend: "",
  axisBottomLegendOffset: 0,
  axisBottomLegendPosition: "middle",
  axisBottomTickPadding: 5,
  axisBottomTickRotation: 45,
  axisBottomTickSize: 5,
  enableAxisBottom: true,
  // axisLeft
  axisLeftLegend: "",
  axisLeftLegendOffset: 0,
  axisLeftLegendPosition: "middle",
  axisLeftTickPadding: 5,
  axisLeftTickRotation: 0,
  axisLeftTickSize: 5,
  enableAxisLeft: true,

  // interactivity
  enableCrosshair: true,
  crosshairType: "bottom-left",

  // legends
  enableLegend: false,
  enableLegendJustify: false,
  legendAnchor: "bottom",
  legendDirection: "column",
  legendItemBackground: "rgba(255, 255, 255, 0)",
  legendItemDirection: "left-to-right",
  legendItemHeight: 20,
  legendItemOpacity: 1,
  legendItemTextColor: "gray",
  legendItemWidth: 60,
  legendItemsSpacing: 2,
  legendSymbolBorderColor: "rgba(0, 0, 0, .5)",
  legendSymbolBorderWidth: 0,
  legendSymbolShape: "circle",
  legendSymbolSize: 12,
  legendSymbolSpacing: 8,
  legendTranslateX: 0,
  legendTranslateY: 60,

  // motion
  enableAnimate: true,
  motionConfig: "gentle",

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
  pagesInError: new Set<number>(),
};

export { initialResponsiveLineChartState };
