import type { ResponsiveRadialBarChartState } from "./types";

const initialResponsiveRadialBarChartState: ResponsiveRadialBarChartState = {
  // base
  // base -> margin
  marginTop: 60,
  marginRight: 60,
  marginBottom: 60,
  marginLeft: 60,
  // base -> angles
  startAngle: 0,
  endAngle: 270,
  innerRadius: 0.3,
  paddingRing: 0.2,
  padAngle: 0,
  cornerRadius: 0,

  // style
  chartColors: "nivo",
  ringBorderWidth: 0,
  ringBorderColor: "gray",

  // tracks
  enableTracks: true,
  tracksColor: "gray",

  // grids
  enableRadialGrid: true,
  enableCircularGrid: true,

  // axes
  // radial axis start
  enableRadialAxisStart: true,
  radialAxisStartTickSize: 5,
  radialAxisStartTickPadding: 5,
  radialAxisStartTickRotation: 0,

  // radial axis end
  enableRadialAxisEnd: false,
  radialAxisEndTickSize: 5,
  radialAxisEndTickPadding: 5,
  radialAxisEndTickRotation: 0,

  // circular axis inner
  enableCircularAxisInner: false,
  circularAxisInnerTickSize: 5,
  circularAxisInnerTickPadding: 5,
  circularAxisInnerTickRotation: 0,

  // circular axis outer
  enableCircularAxisOuter: true,
  circularAxisOuterTickSize: 5,
  circularAxisOuterTickPadding: 7,
  circularAxisOuterTickRotation: 0,

  // labels
  enableLabels: false,
  labelsSkipAngle: 10,
  labelsRadiusOffset: 0.5,
  labelsTextColor: "gray",

  // legend
  enableLegend: false,
  enableLegendJustify: false,
  legendAnchor: "bottom-right",
  legendDirection: "column",
  legendItemBackground: "rgba(255, 255, 255, 0)",
  legendItemDirection: "left-to-right",
  legendItemHeight: 20,
  legendItemOpacity: 1,
  legendItemTextColor: "gray",
  legendItemWidth: 60,
  legendItemsSpacing: 2,
  legendSymbolBorderColor: "rgba(0, 0, 0, 0)",
  legendSymbolBorderWidth: 0,
  legendSymbolShape: "circle",
  legendSymbolSize: 12,
  legendSymbolSpacing: 8,
  legendTranslateX: 0,
  legendTranslateY: 0,

  // motion
  enableAnimate: true,
  motionConfig: "gentle",
  transitionMode: "centerRadius",

  // options
  chartTitle: "",
  chartTitleColor: "dark",
  chartTitlePosition: "center",
  chartTitleSize: 3,

  // screenshot
  screenshotFilename: "",
  screenshotImageQuality: 1.0,
  screenshotImageType: "image/png",

  pagesInError: new Set(),
};

export { initialResponsiveRadialBarChartState };
