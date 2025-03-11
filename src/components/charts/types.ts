type NivoColorScheme =
    | "nivo"
    | "category10"
    | "accent"
    | "dark2"
    | "paired"
    | "pastel1"
    | "pastel2"
    | "set1"
    | "set2"
    | "set3"
    | "brown_blueGreen"
    | "purpleRed_green"
    | "pink_yellowGreen"
    | "purple_orange"
    | "red_blue"
    | "red_grey"
    | "red_yellow_blue"
    | "red_yellow_green"
    | "spectral"
    | "blues"
    | "greens"
    | "greys"
    | "oranges"
    | "purples"
    | "reds"
    | "blue_green"
    | "blue_purple"
    | "green_blue"
    | "orange_red"
    | "purple_blue_green"
    | "purple_blue"
    | "purple_red"
    | "red_purple"
    | "yellow_green_blue"
    | "yellow_green"
    | "yellow_orange_brown"
    | "yellow_orange_red";

type NivoMotionConfig =
    | "default"
    | "gentle"
    | "wobbly"
    | "stiff"
    | "slow"
    | "molasses";

type NivoTransitionMode =
    | "startAngle"
    | "middleAngle"
    | "endAngle"
    | "innerRadius"
    | "centerRadius"
    | "outerRadius"
    | "pushIn"
    | "pushOut";

type NivoFillPatternObject = {
    match: {
        id: string;
    };
    id: "dots" | "lines";
};

type NivoLegendAnchor =
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left"
    | "center";

type NivoLegendDirection = "row" | "column";

type NivoLegendItemDirection =
    | "left-to-right"
    | "right-to-left"
    | "top-to-bottom"
    | "bottom-to-top";

type NivoLegendSymbolShape = "circle" | "diamond" | "square" | "triangle";

type NivoLineCurve =
    | "basis"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "natural"
    | "step"
    | "stepAfter"
    | "stepBefore";

type NivoLineAreaBlendMode =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";

type NivoLineCrosshairType =
    | "x"
    | "y"
    | "top-left"
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "cross";

type NivoLineAxesScale = "linear" | "point";

type NivoLinePointLabel = "x" | "y";

type NivoCalendarAlign =
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left"
    | "center";

type NivoCalendarDirection = "horizontal" | "vertical";
type NivoCalendarLegendPosition = "before" | "after";

type NivoArcLabel = "id" | "value" | "formattedValue";

type NivoAxisLegendPosition = "start" | "middle" | "end";

type NivoBarGroupMode = "grouped" | "stacked";
type NivoBarLayout = "horizontal" | "vertical";
type NivoBarValueScale = "linear" | "symlog";
type NivoChartTitlePosition = "left" | "center" | "right";

type NivoChartUnitKind = "currency" | "percent" | "number";

export type {
    NivoArcLabel,
    NivoAxisLegendPosition,
    NivoBarGroupMode,
    NivoBarLayout,
    NivoBarValueScale,
    NivoCalendarAlign,
    NivoCalendarDirection,
    NivoCalendarLegendPosition,
    NivoChartTitlePosition,
    NivoChartUnitKind,
    NivoColorScheme,
    NivoFillPatternObject,
    NivoLegendAnchor,
    NivoLegendDirection,
    NivoLegendItemDirection,
    NivoLegendSymbolShape,
    NivoLineAreaBlendMode,
    NivoLineAxesScale,
    NivoLineCrosshairType,
    NivoLineCurve,
    NivoLinePointLabel,
    NivoMotionConfig,
    NivoTransitionMode,
};
