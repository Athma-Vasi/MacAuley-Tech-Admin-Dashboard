import type { ResponsivePieChartState } from "./types";

const initialResponsivePieChartState: ResponsivePieChartState = {
  /** base */
  startAngle: 0,
  endAngle: 360,
  innerRadius: 0.5,
  padAngle: 4,
  cornerRadius: 4,
  sortByValue: false,

  /** style */
  colorScheme: "nivo",
  enableFillPatterns: false,
  arcBorderColor: "#ffffff",
  arcBorderWidth: 0,

  /** arc labels */
  arcLabel: "formattedValue",
  enableArcLabels: true,
  arcLabelsRadiusOffset: 0.5,
  arcLabelsSkipAngle: 0,
  arcLabelsTextColor: "gray",

  /** arc link labels */
  enableArcLinkLabels: true,
  arcLinkLabelsSkipAngle: 0,
  arcLinkLabelsOffset: 0,
  arcLinkLabelsDiagonalLength: 16,
  arcLinkLabelsStraightLength: 24,
  arcLinkLabelsTextOffset: 6,
  arcLinkLabelsThickness: 1,
  arcLinkLabelsTextColor: "gray",

  /** interactivity */
  activeInnerRadiusOffset: 6,
  activeOuterRadiusOffset: 6,

  /** motion */
  enableAnimate: true,
  motionConfig: "gentle",
  transitionMode: "innerRadius",

  /** margin */
  marginTop: 60,
  marginRight: 240,
  marginBottom: 90,
  marginLeft: 60,

  /** legend */
  enableLegend: true,
  enableLegendJustify: false,
  legendAnchor: "right",
  legendDirection: "column",
  legendItemBackground: "rgba(255, 255, 255, 0)",
  legendItemDirection: "left-to-right",
  legendItemHeight: 20,
  legendItemOpacity: 1,
  legendItemTextColor: "gray",
  legendItemWidth: 60,
  legendItemsSpacing: 10,
  legendSymbolBorderColor: "rgba(0, 0, 0, .5)",
  legendSymbolBorderWidth: 0,
  legendSymbolShape: "circle",
  legendSymbolSize: 12,
  legendSymbolSpacing: 8,
  legendTranslateX: 180,
  legendTranslateY: 0,

  /** options */
  chartTitle: "",
  chartTitleColor: "dark",
  chartTitlePosition: "center",
  chartTitleSize: 3,

  /** screenshot */
  screenshotFilename: "",
  screenshotImageQuality: 1,
  screenshotImageType: "image/png",

  // error
  pagesInError: new Set(),
};

export { initialResponsivePieChartState };
