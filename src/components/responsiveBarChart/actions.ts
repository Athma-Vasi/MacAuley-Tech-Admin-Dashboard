type ResponsiveBarChartAction = {
    /** base */
    setGroupMode: "setGroupMode";
    setInnerPaddingBar: "setInnerPaddingBar";
    setLayout: "setLayout";
    setPaddingBar: "setPaddingBar";
    setReverse: "setReverse";
    setValueScale: "setValueScale";

    /** margin */
    setMarginTop: "setMarginTop";
    setMarginRight: "setMarginRight";
    setMarginBottom: "setMarginBottom";
    setMarginLeft: "setMarginLeft";

    /** style */
    setChartBorderColor: "setChartBorderColor";
    setChartBorderRadius: "setChartBorderRadius";
    setChartBorderWidth: "setChartBorderWidth";
    setChartColors: "setChartColors";
    setEnableFillPatterns: "setEnableFillPatterns";

    /** labels */
    setEnableLabels: "setEnableLabels";
    setLabelSkipHeight: "setLabelSkipHeight";
    setLabelSkipWidth: "setLabelSkipWidth";
    setLabelTextColor: "setLabelTextColor";

    /** grid and axes */
    setEnableGridX: "setEnableGridX";
    setEnableGridY: "setEnableGridY";
    // axis -> axisTop
    setAxisTopLegend: "setAxisTopLegend";
    setAxisTopLegendOffset: "setAxisTopLegendOffset";
    setAxisTopLegendPosition: "setAxisTopLegendPosition";
    setAxisTopTickPadding: "setAxisTopTickPadding";
    setAxisTopTickRotation: "setAxisTopTickRotation";
    setAxisTopTickSize: "setAxisTopTickSize";
    setEnableAxisTop: "setEnableAxisTop";
    // axis -> axisRight
    setAxisRightLegend: "setAxisRightLegend";
    setAxisRightLegendOffset: "setAxisRightLegendOffset";
    setAxisRightLegendPosition: "setAxisRightLegendPosition";
    setAxisRightTickPadding: "setAxisRightTickPadding";
    setAxisRightTickRotation: "setAxisRightTickRotation";
    setAxisRightTickSize: "setAxisRightTickSize";
    setEnableAxisRight: "setEnableAxisRight";
    // axis -> axisBottom
    setAxisBottomLegend: "setAxisBottomLegend";
    setAxisBottomLegendOffset: "setAxisBottomLegendOffset";
    setAxisBottomLegendPosition: "setAxisBottomLegendPosition";
    setAxisBottomTickPadding: "setAxisBottomTickPadding";
    setAxisBottomTickRotation: "setAxisBottomTickRotation";
    setAxisBottomTickSize: "setAxisBottomTickSize";
    setEnableAxisBottom: "setEnableAxisBottom";
    // axis -> axisLeft
    setAxisLeftLegend: "setAxisLeftLegend";
    setAxisLeftLegendOffset: "setAxisLeftLegendOffset";
    setAxisLeftLegendPosition: "setAxisLeftLegendPosition";
    setAxisLeftTickPadding: "setAxisLeftTickPadding";
    setAxisLeftTickRotation: "setAxisLeftTickRotation";
    setAxisLeftTickSize: "setAxisLeftTickSize";
    setEnableAxisLeft: "setEnableAxisLeft";

    /** legend */
    setEnableLegend: "setEnableLegend";
    setEnableLegendJustify: "setEnableLegendJustify";
    setLegendAnchor: "setLegendAnchor";
    setLegendDirection: "setLegendDirection";
    setLegendItemBackground: "setLegendItemBackground";
    setLegendItemDirection: "setLegendItemDirection";
    setLegendItemHeight: "setLegendItemHeight";
    setLegendItemOpacity: "setLegendItemOpacity";
    setLegendItemTextColor: "setLegendItemTextColor";
    setLegendItemWidth: "setLegendItemWidth";
    setLegendItemsSpacing: "setLegendItemsSpacing";
    setLegendSymbolBorderColor: "setLegendSymbolBorderColor";
    setLegendSymbolBorderWidth: "setLegendSymbolBorderWidth";
    setLegendSymbolShape: "setLegendSymbolShape";
    setLegendSymbolSize: "setLegendSymbolSize";
    setLegendSymbolSpacing: "setLegendSymbolSpacing";
    setLegendTranslateX: "setLegendTranslateX";
    setLegendTranslateY: "setLegendTranslateY";

    /** motion */
    setEnableAnimate: "setEnableAnimate";
    setMotionConfig: "setMotionConfig";

    /** options */
    setChartTitle: "setChartTitle";
    setChartTitleColor: "setChartTitleColor";
    setChartTitlePosition: "setChartTitlePosition";
    setChartTitleSize: "setChartTitleSize";

    /** screenshot */
    setScreenshotFilename: "setScreenshotFilename";
    setScreenshotImageQuality: "setScreenshotImageQuality";
    setScreenshotImageType: "setScreenshotImageType";

    // reset all
    resetChartToDefault: "resetChartToDefault";

    // error
    setPageInError: "setPageInError";
};

const responsiveBarChartAction: ResponsiveBarChartAction = {
    /** base */
    setGroupMode: "setGroupMode",
    setInnerPaddingBar: "setInnerPaddingBar",
    setLayout: "setLayout",
    setPaddingBar: "setPaddingBar",
    setReverse: "setReverse",
    setValueScale: "setValueScale",

    /** margin */
    setMarginTop: "setMarginTop",
    setMarginRight: "setMarginRight",
    setMarginBottom: "setMarginBottom",
    setMarginLeft: "setMarginLeft",

    /** style */
    setChartBorderColor: "setChartBorderColor",
    setChartBorderRadius: "setChartBorderRadius",
    setChartBorderWidth: "setChartBorderWidth",
    setChartColors: "setChartColors",
    setEnableFillPatterns: "setEnableFillPatterns",

    /** labels */
    setEnableLabels: "setEnableLabels",
    setLabelSkipHeight: "setLabelSkipHeight",
    setLabelSkipWidth: "setLabelSkipWidth",
    setLabelTextColor: "setLabelTextColor",

    /** grid and axes */
    setEnableGridX: "setEnableGridX",
    setEnableGridY: "setEnableGridY",
    // axis -> axisTop
    setAxisTopLegend: "setAxisTopLegend",
    setAxisTopLegendOffset: "setAxisTopLegendOffset",
    setAxisTopLegendPosition: "setAxisTopLegendPosition",
    setAxisTopTickPadding: "setAxisTopTickPadding",
    setAxisTopTickRotation: "setAxisTopTickRotation",
    setAxisTopTickSize: "setAxisTopTickSize",
    setEnableAxisTop: "setEnableAxisTop",
    // axis -> axisRight
    setAxisRightLegend: "setAxisRightLegend",
    setAxisRightLegendOffset: "setAxisRightLegendOffset",
    setAxisRightLegendPosition: "setAxisRightLegendPosition",
    setAxisRightTickPadding: "setAxisRightTickPadding",
    setAxisRightTickRotation: "setAxisRightTickRotation",
    setAxisRightTickSize: "setAxisRightTickSize",
    setEnableAxisRight: "setEnableAxisRight",
    // axis -> axisBottom
    setAxisBottomLegend: "setAxisBottomLegend",
    setAxisBottomLegendOffset: "setAxisBottomLegendOffset",
    setAxisBottomLegendPosition: "setAxisBottomLegendPosition",
    setAxisBottomTickPadding: "setAxisBottomTickPadding",
    setAxisBottomTickRotation: "setAxisBottomTickRotation",
    setAxisBottomTickSize: "setAxisBottomTickSize",
    setEnableAxisBottom: "setEnableAxisBottom",
    // axis -> axisLeft
    setAxisLeftLegend: "setAxisLeftLegend",
    setAxisLeftLegendOffset: "setAxisLeftLegendOffset",
    setAxisLeftLegendPosition: "setAxisLeftLegendPosition",
    setAxisLeftTickPadding: "setAxisLeftTickPadding",
    setAxisLeftTickRotation: "setAxisLeftTickRotation",
    setAxisLeftTickSize: "setAxisLeftTickSize",
    setEnableAxisLeft: "setEnableAxisLeft",

    /** legend */
    setEnableLegend: "setEnableLegend",
    setEnableLegendJustify: "setEnableLegendJustify",
    setLegendAnchor: "setLegendAnchor",
    setLegendDirection: "setLegendDirection",
    setLegendItemBackground: "setLegendItemBackground",
    setLegendItemDirection: "setLegendItemDirection",
    setLegendItemHeight: "setLegendItemHeight",
    setLegendItemOpacity: "setLegendItemOpacity",
    setLegendItemTextColor: "setLegendItemTextColor",
    setLegendItemWidth: "setLegendItemWidth",
    setLegendItemsSpacing: "setLegendItemsSpacing",
    setLegendSymbolBorderColor: "setLegendSymbolBorderColor",
    setLegendSymbolBorderWidth: "setLegendSymbolBorderWidth",
    setLegendSymbolShape: "setLegendSymbolShape",
    setLegendSymbolSize: "setLegendSymbolSize",
    setLegendSymbolSpacing: "setLegendSymbolSpacing",
    setLegendTranslateX: "setLegendTranslateX",
    setLegendTranslateY: "setLegendTranslateY",

    /** motion */
    setEnableAnimate: "setEnableAnimate",
    setMotionConfig: "setMotionConfig",

    /** options */
    setChartTitle: "setChartTitle",
    setChartTitleColor: "setChartTitleColor",
    setChartTitlePosition: "setChartTitlePosition",
    setChartTitleSize: "setChartTitleSize",

    /** screenshot */
    setScreenshotFilename: "setScreenshotFilename",
    setScreenshotImageQuality: "setScreenshotImageQuality",
    setScreenshotImageType: "setScreenshotImageType",

    // reset all
    resetChartToDefault: "resetChartToDefault",

    // error
    setPageInError: "setPageInError",
};

export { responsiveBarChartAction };

export type { ResponsiveBarChartAction };
