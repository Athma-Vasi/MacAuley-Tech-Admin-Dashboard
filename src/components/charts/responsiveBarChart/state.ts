import type { ResponsiveBarChartState } from "./types";

const initialResponsiveBarChartState: ResponsiveBarChartState = {
    /** base */
    groupMode: "stacked",
    innerPaddingBar: 0,
    layout: "vertical",
    paddingBar: 0.1,
    reverse: false,
    valueScale: "linear",

    /** margin */
    marginTop: 60,
    marginRight: 60,
    marginBottom: 90,
    marginLeft: 90,

    /** style */
    chartBorderColor: "#ffffff",
    chartBorderRadius: 0,
    chartBorderWidth: 0,
    chartColors: "nivo",
    enableFillPatterns: false,

    /** labels */
    enableLabels: true,
    labelSkipWidth: 0,
    labelSkipHeight: 0,
    labelTextColor: "gray",

    /** grid and axes */
    enableGridX: false,
    enableGridY: true,
    // axis top
    axisTopLegend: "",
    axisTopLegendOffset: 0,
    axisTopLegendPosition: "middle",
    axisTopTickPadding: 5,
    axisTopTickRotation: 45,
    axisTopTickSize: 5,
    enableAxisTop: false,
    // axis right
    axisRightLegend: "",
    axisRightLegendOffset: 0,
    axisRightLegendPosition: "middle",
    axisRightTickPadding: 5,
    axisRightTickRotation: 0,
    axisRightTickSize: 5,
    enableAxisRight: false,
    // axis bottom
    axisBottomLegend: "",
    axisBottomLegendOffset: 0,
    axisBottomLegendPosition: "middle",
    axisBottomTickPadding: 5,
    axisBottomTickRotation: 45,
    axisBottomTickSize: 5,
    enableAxisBottom: true,
    // axis left
    axisLeftLegend: "",
    axisLeftLegendOffset: 0,
    axisLeftLegendPosition: "middle",
    axisLeftTickPadding: 5,
    axisLeftTickRotation: 0,
    axisLeftTickSize: 5,
    enableAxisLeft: true,

    /** legend */
    enableLegend: true,
    enableLegendJustify: false,
    legendAnchor: "bottom",
    legendDirection: "row",
    legendItemBackground: "rgba(255, 255, 255, 0)",
    legendItemDirection: "left-to-right",
    legendItemHeight: 20,
    legendItemOpacity: 1,
    legendItemTextColor: "gray",
    legendItemWidth: 60,
    legendItemsSpacing: 2,
    legendSymbolBorderColor: "rgba(0, 0, 0, 0)",
    legendSymbolBorderWidth: 0,
    legendSymbolShape: "square",
    legendSymbolSize: 12,
    legendSymbolSpacing: 8,
    legendTranslateX: 0,
    legendTranslateY: 60,

    /** motion */
    enableAnimate: true,
    motionConfig: "default",

    /** options */
    chartTitle: "",
    chartTitleColor: "dark",
    chartTitlePosition: "center",
    chartTitleSize: 3,

    /** screenshot */
    screenshotFilename: "",
    screenshotImageQuality: 1.0,
    screenshotImageType: "image/png",

    /** error */
    pagesInError: new Set(),
};

export { initialResponsiveBarChartState };
