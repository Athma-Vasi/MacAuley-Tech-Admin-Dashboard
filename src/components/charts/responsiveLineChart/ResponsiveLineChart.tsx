import {
  Box,
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ResponsiveLine } from "@nivo/line";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";

import { addCommaSeparator, returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { ChartAxisBottom } from "../chartControls/chartAxisBottom";
import {
  NIVO_CHART_PATTERN_DEFS,
  NIVO_COLOR_SCHEME_DATA,
  NIVO_MOTION_CONFIG_DATA,
  SLIDER_TOOLTIP_COLOR,
} from "../constants";

import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartAxisLeft } from "../chartControls/chartAxisLeft";
import { ChartAxisRight } from "../chartControls/chartAxisRight";
import { ChartAxisTop } from "../chartControls/chartAxisTop";
import { ChartLegend } from "../chartControls/chartLegend";
import { ChartMargin } from "../chartControls/chartMargin";
import { ChartOptions } from "../chartControls/chartOptions";
import ChartAndControlsDisplay from "../display/ChartAndControlsDisplay";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import {
  NivoLineAreaBlendMode,
  NivoLineAxesScale,
  NivoLineCrosshairType,
  NivoLineCurve,
  NivoLinePointLabel,
  NivoMotionConfig,
} from "../types";
import { createChartHeaderStyles } from "../utils";
import { responsiveLineChartAction } from "./actions";
import {
  NIVO_LINE_AREA_BLEND_MODE_DATA,
  NIVO_LINE_AXES_SCALE,
  NIVO_LINE_CROSSHAIR_TYPE_DATA,
  NIVO_LINE_CURVE_DATA,
  NIVO_LINE_POINT_LABEL_DATA,
} from "./constants";
import { responsiveLineChartReducer } from "./reducers";
import { initialResponsiveLineChartState } from "./state";
import type {
  ResponsiveLineChartAction,
  ResponsiveLineChartProps,
  ResponsiveLineChartState,
} from "./types";

function ResponsiveLineChart({
  chartUnitKind,
  dashboardChartTitle,
  hideControls = false,
  lineChartData,
  onClick,
  tooltip,
  xFormat,
  yFormat,
  yScaleMax = "auto",
  yScaleMin = "auto",
}: ResponsiveLineChartProps) {
  const {
    globalState: { isPrefersReducedMotion, themeObject },
  } = useGlobalState();

  const { grayColorShade, textColor, scrollBarStyle, bgGradient } =
    returnThemeColors({
      themeObject,
      colorsSwatches: COLORS_SWATCHES,
    });

  useEffect(() => {
    // sets initial colors based on app theme
    const modifiedResponsiveLineChartState: ResponsiveLineChartState = {
      ...initialResponsiveLineChartState,
      chartTitle: dashboardChartTitle ?? "Line Chart",
      pointColor: "#00000000",
      chartTitleColor: textColor,
      legendItemTextColor: textColor,
    };

    responsiveLineChartDispatch({
      action: responsiveLineChartAction.resetChartToDefault,
      payload: modifiedResponsiveLineChartState,
    });
  }, [themeObject]);

  const stateWithChartTitle = {
    ...initialResponsiveLineChartState,
    chartTitle: dashboardChartTitle ?? "Line Chart",
  };

  const [responsiveLineChartState, responsiveLineChartDispatch] = useReducer(
    responsiveLineChartReducer,
    stateWithChartTitle,
  );

  const {
    // base
    enableYScaleStacked, // default: false
    reverseScale, // default: false
    xScale, // default: linear
    yScale, // default: linear

    // margin
    marginTop, // 0px - 200px default: 60 step: 1
    marginRight, // 0px - 200px default: 60 step: 1
    marginBottom, // 0px - 200px default: 60 step: 1
    marginLeft, // 0px - 200px default: 60 step: 1

    // style
    areaBlendMode, // default: 'normal'
    areaOpacity, // 0 - 1 default: 0.2 step: 0.1
    chartColors, // default: 'nivo'
    enableArea, // default: false
    lineCurve, // default: 'linear'
    lineWidth, // 0px - 20px default: 2 step: 1

    // points
    enablePointLabel, // default: false
    enablePoints, // default: false
    pointBorderWidth, // 0px - 20px default: 0 step: 1
    pointColor, // default: gray
    pointLabel, // default: 'y'
    pointLabelYOffset, // -22px - 24px default: -12 step: 1
    pointSize, // 0px - 20px default: 6 step: 1

    // grids
    enableGridX, // default: true
    enableGridY, // default: true

    // axes
    // axisTop
    axisTopLegend, // default: ''
    axisTopLegendOffset, // -60px - 60px default: 0 step: 1
    axisTopLegendPosition, // 'start' | 'middle' | 'end' default: 'middle'
    axisTopTickPadding, // 0px - 20px default: 5 step: 1
    axisTopTickRotation, // -90° - 90° default: 0 step: 1
    axisTopTickSize, // 0px - 20px default: 5 step: 1
    enableAxisTop, // default: false ? null
    // axisRight
    axisRightLegend, // default: ''
    axisRightLegendOffset, // -60px - 60px default: 0 step: 1
    axisRightLegendPosition, // 'start' | 'middle' | 'end' default: 'middle'
    axisRightTickPadding, // 0px - 20px default: 5 step: 1
    axisRightTickRotation, // -90° - 90° default: 0 step: 1
    axisRightTickSize, // 0px - 20px default: 5 step: 1
    enableAxisRight, // default: false ? null
    // axisBottom
    axisBottomLegend, // default: ''
    axisBottomLegendOffset, // -60px - 60px default: 0 step: 1
    axisBottomLegendPosition, // 'start' | 'middle' | 'end' default: 'middle'
    axisBottomTickPadding, // 0px - 20px default: 5 step: 1
    axisBottomTickRotation, // -90° - 90° default: 0 step: 1
    axisBottomTickSize, // 0px - 20px default: 5 step: 1
    enableAxisBottom, // default: true ? {...} : null
    // axisLeft
    axisLeftLegend, // default: ''
    axisLeftLegendOffset, // -60px - 60px default: 0 step: 1
    axisLeftLegendPosition, // 'start' | 'middle' | 'end' default: 'middle'
    axisLeftTickPadding, // 0px - 20px default: 5 step: 1
    axisLeftTickRotation, // -90° - 90° default: 0 step: 1
    axisLeftTickSize, // 0px - 20px default: 5 step: 1
    enableAxisLeft, // default: true ? {...} : null

    // interactivity
    enableCrosshair, // default: true
    crosshairType, // default: 'bottom-left'

    // legends
    enableLegend, // default: false
    enableLegendJustify, // default: false
    legendAnchor, // default: bottom-right
    legendDirection, // default: column
    legendItemBackground, // default: 'rgba(0, 0, 0, 0)'
    legendItemDirection, // default: left-to-right
    legendItemHeight, // 10px - 200px default: 20 step: 1
    legendItemOpacity, // 0 - 1 default: 1 step: 0.05
    legendItemTextColor, // default: 'gray'
    legendItemWidth, // 10px - 200px default: 60 step: 1
    legendItemsSpacing, // 0px - 60px default: 2 step: 1
    legendSymbolBorderColor, // default: 'rgba(0, 0, 0, .5)'
    legendSymbolBorderWidth, // 0px - 20px default: 0 step: 1
    legendSymbolShape, // default: circle
    legendSymbolSize, // 2px - 60px default: 12 step: 1
    legendSymbolSpacing, // 0px - 60px default: 8 step: 1
    legendTranslateX, // -200px - 200px default: 0 step: 1
    legendTranslateY, // -200px - 200px default: 0 step: 1

    // motion
    enableAnimate, // default: true
    motionConfig, // default: 'gentle'

    // options
    chartTitle,
    chartTitleColor, // default: 'gray'
    chartTitlePosition, // default: 'center'
    chartTitleSize, // 1 - 6 default: 3

    // screenshot
    screenshotFilename,
    screenshotImageQuality, // 0 - 1 default: 1 step: 0.1
    screenshotImageType, // default: 'image/png'

    isError,
  } = responsiveLineChartState;

  const chartRef = useRef(null);

  // set motion config on enable
  useEffect(() => {
    if (!isPrefersReducedMotion) {
      return;
    }

    responsiveLineChartDispatch({
      action: responsiveLineChartAction.setEnableAnimate,
      payload: false,
    });
  }, [isPrefersReducedMotion]);

  const displayResponsiveLine = (
    <ResponsiveLine
      data={lineChartData}
      // base
      xScale={{ type: xScale }}
      xFormat={xFormat}
      yScale={{
        type: yScale,
        min: yScaleMin,
        max: yScaleMax,
        stacked: enableYScaleStacked,
        reverse: reverseScale,
      }}
      yFormat={yFormat}
      // margin
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      // style
      curve={lineCurve}
      colors={{ scheme: chartColors }}
      lineWidth={lineWidth}
      enableArea={enableArea}
      areaOpacity={areaOpacity}
      areaBlendMode={areaBlendMode}
      defs={NIVO_CHART_PATTERN_DEFS}
      // points
      enablePoints={enablePoints}
      pointSize={pointSize}
      pointColor={pointColor}
      pointBorderWidth={pointBorderWidth}
      pointBorderColor={{ from: "serieColor" }}
      enablePointLabel={enablePointLabel}
      pointLabel={pointLabel}
      pointLabelYOffset={pointLabelYOffset}
      // grids
      enableGridX={enableGridX}
      enableGridY={enableGridY}
      // axes
      axisTop={enableAxisTop
        ? {
          format: (value) => addCommaSeparator(value),
          legend: axisTopLegend,
          legendOffset: axisTopLegendOffset,
          legendPosition: axisTopLegendPosition,
          tickPadding: axisTopTickPadding,
          tickRotation: axisTopTickRotation,
          tickSize: axisTopTickSize,
        }
        : null}
      axisRight={enableAxisRight
        ? {
          format: (value) => addCommaSeparator(value),
          legend: axisRightLegend,
          legendOffset: axisRightLegendOffset,
          legendPosition: axisRightLegendPosition,
          tickPadding: axisRightTickPadding,
          tickRotation: axisRightTickRotation,
          tickSize: axisRightTickSize,
        }
        : null}
      axisBottom={enableAxisBottom
        ? {
          format: (value) => addCommaSeparator(value),
          legend: axisBottomLegend,
          legendOffset: axisBottomLegendOffset,
          legendPosition: axisBottomLegendPosition,
          tickPadding: axisBottomTickPadding,
          tickRotation: axisBottomTickRotation,
          tickSize: axisBottomTickSize,
        }
        : null}
      axisLeft={enableAxisLeft
        ? {
          format: (value) => addCommaSeparator(value),
          legend: axisLeftLegend,
          legendOffset: axisLeftLegendOffset,
          legendPosition: axisLeftLegendPosition,
          tickPadding: axisLeftTickPadding,
          tickRotation: axisLeftTickRotation,
          tickSize: axisLeftTickSize,
        }
        : null}
      // interactivity
      isInteractive={true}
      enableCrosshair={enableCrosshair}
      crosshairType={crosshairType}
      useMesh={true}
      // legends
      legends={enableLegend
        ? [
          {
            anchor: legendAnchor,
            direction: legendDirection,
            justify: enableLegendJustify,
            translateX: legendTranslateX,
            translateY: legendTranslateY,
            itemsSpacing: legendItemsSpacing,
            itemDirection: legendItemDirection,
            itemTextColor: legendItemTextColor,
            itemBackground: legendItemBackground,
            itemWidth: legendItemWidth,
            itemHeight: legendItemHeight,
            itemOpacity: legendItemOpacity,
            symbolSize: legendSymbolSize,
            symbolShape: legendSymbolShape,
            symbolBorderColor: legendSymbolBorderColor,
            symbolBorderWidth: legendSymbolBorderWidth,
            symbolSpacing: legendSymbolSpacing,

            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]
        : []}
      // motion
      animate={enableAnimate}
      motionConfig={motionConfig}
      tooltip={tooltip}
    />
  );

  if (hideControls) {
    return (
      <Box
        className="chart"
        data-testid="responsive-line-chart"
        onClick={onClick}
      >
        {displayResponsiveLine}
      </Box>
    );
  }

  // base

  const xScaleSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setXScale"],
      NivoLineAxesScale
    >
      attributes={{
        data: NIVO_LINE_AXES_SCALE,
        description: "Define x scale",
        hideLabel: true,
        name: "xScale",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setXScale,
        value: xScale,
      }}
    />
  );

  const yScaleSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setYScale"],
      NivoLineAxesScale
    >
      attributes={{
        data: NIVO_LINE_AXES_SCALE,
        description: "Define y scale",
        hideLabel: true,
        name: "yScale",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setYScale,
        value: yScale,
      }}
    />
  );

  const enableYScaleStackedSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableYScaleStacked,
        name: "enableYScaleStacked",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableYScaleStacked,
        value: enableYScaleStacked.toString(),
      }}
    />
  );

  const reverseScaleSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: reverseScale,
        name: "reverseScale",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setReverseScale,
        value: reverseScale.toString(),
      }}
    />
  );

  // style

  const lineCurveSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setLineCurve"],
      NivoLineCurve
    >
      attributes={{
        data: NIVO_LINE_CURVE_DATA,
        description: "Define line curve",
        hideLabel: true,
        name: "lineCurve",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setLineCurve,
        value: lineCurve,
      }}
    />
  );

  const chartColorsSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_COLOR_SCHEME_DATA,
        description: "Define chart colors",
        hideLabel: true,
        name: "chartColors",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setChartColors,
        value: chartColors,
      }}
    />
  );

  const lineWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "lineWidth",
        parentDispatch: responsiveLineChartDispatch,
        defaultValue: 2,
        step: 1,
        validValueAction: responsiveLineChartAction.setLineWidth,
        value: lineWidth,
      }}
    />
  );

  const enableAreaSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableArea,
        name: "enableArea",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableArea,
        value: enableArea.toString(),
      }}
    />
  );

  const areaOpacitySliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArea,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 1,
        min: 0,
        name: "areaOpacity",
        parentDispatch: responsiveLineChartDispatch,
        defaultValue: 0.2,
        step: 0.1,
        validValueAction: responsiveLineChartAction.setAreaOpacity,
        value: areaOpacity,
      }}
    />
  );

  const areaBlendModeSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setAreaBlendMode"],
      NivoLineAreaBlendMode
    >
      attributes={{
        data: NIVO_LINE_AREA_BLEND_MODE_DATA,
        description: "Define line area blend mode",
        disabled: !enableArea,
        hideLabel: true,
        name: "areaBlendMode",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setAreaBlendMode,
        value: areaBlendMode,
      }}
    />
  );

  // points

  const enablePointsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enablePoints,
        name: "enablePoints",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnablePoints,
        value: enablePoints.toString(),
      }}
    />
  );

  const pointSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enablePoints,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "pointSize",
        parentDispatch: responsiveLineChartDispatch,
        defaultValue: 6,
        step: 1,
        validValueAction: responsiveLineChartAction.setPointSize,
        value: pointSize,
      }}
    />
  );

  const pointColorInput = (
    <ColorInput
      aria-label="point color"
      color={pointColor}
      disabled={!enablePoints}
      onChange={(color: string) => {
        responsiveLineChartDispatch({
          action: responsiveLineChartAction.setPointColor,
          payload: color,
        });
      }}
      value={pointColor}
      w={INPUT_WIDTH}
    />
  );

  const pointBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enablePoints,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "pointBorderWidth",
        parentDispatch: responsiveLineChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: responsiveLineChartAction.setPointBorderWidth,
        value: pointBorderWidth,
      }}
    />
  );

  const enablePointLabelSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enablePointLabel,
        name: "enablePointLabel",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnablePointLabel,
        value: enablePointLabel.toString(),
      }}
    />
  );

  const pointLabelSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setPointLabel"],
      NivoLinePointLabel
    >
      attributes={{
        data: NIVO_LINE_POINT_LABEL_DATA,
        description: "Define point label",
        disabled: !enablePointLabel,
        hideLabel: true,
        name: "pointLabel",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setPointLabel,
        value: pointLabel,
      }}
    />
  );

  const pointLabelYOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enablePointLabel,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 24,
        min: -22,
        name: "pointLabelYOffset",
        parentDispatch: responsiveLineChartDispatch,
        defaultValue: -12,
        step: 1,
        validValueAction: responsiveLineChartAction.setPointLabelYOffset,
        value: pointLabelYOffset,
      }}
    />
  );

  // grids

  const enableGridXSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableGridX,
        name: "enableGridX",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableGridX,
        value: enableGridX.toString(),
      }}
    />
  );

  const enableGridYSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableGridY,
        name: "enableGridY",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableGridY,
        value: enableGridY.toString(),
      }}
    />
  );

  // interactivity

  const enableCrosshairSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableCrosshair,
        name: "enableCrosshair",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableCrosshair,
        value: enableCrosshair.toString(),
      }}
    />
  );

  const crosshairTypeSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setCrosshairType"],
      NivoLineCrosshairType
    >
      attributes={{
        data: NIVO_LINE_CROSSHAIR_TYPE_DATA,
        description: "Define crosshair type",
        disabled: !enableCrosshair,
        hideLabel: true,
        name: "crosshairType",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setCrosshairType,
        value: crosshairType,
      }}
    />
  );

  // motion

  const enableAnimateSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAnimate,
        name: "enableAnimate",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableAnimate,
        value: enableAnimate.toString(),
      }}
    />
  );

  const motionConfigSelectInput = (
    <AccessibleSelectInput<
      ResponsiveLineChartAction["setMotionConfig"],
      NivoMotionConfig
    >
      attributes={{
        data: NIVO_MOTION_CONFIG_DATA,
        description: "Define motion config",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "motionConfig",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setMotionConfig,
        value: motionConfig,
      }}
    />
  );

  // reset all button

  const resetAllButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Reset all inputs to their default values",
        kind: "reset",
        name: "resetAll",
        onClick: () => {
          responsiveLineChartDispatch({
            action: responsiveLineChartAction.resetChartToDefault,
            payload: stateWithChartTitle,
          });
        },
      }}
    />
  );

  // input display

  // base
  const displayBaseHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Base
      </Title>
    </Group>
  );

  const displayXScaleSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={xScaleSelectInput}
      label="X scale"
      value={xScale}
    />
  );

  const displayYScaleSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={yScaleSelectInput}
      label="Y scale"
      value={yScale}
    />
  );

  const displayEnableYScaleStackedSwitchInput = (
    <Group w="100%">
      {enableYScaleStackedSwitchInput}
    </Group>
  );

  const displayReverseScaleSwitchInput = (
    <Group w="100%">
      {reverseScaleSwitchInput}
    </Group>
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      <Group w="100%" align="baseline" px="md">
        {displayXScaleSelectInput}
        {displayYScaleSelectInput}
        {displayEnableYScaleStackedSwitchInput}
        {displayReverseScaleSwitchInput}
      </Group>
    </Stack>
  );

  // margin
  const displayChartMargin = (
    <ChartMargin
      initialChartState={stateWithChartTitle}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  // style
  const displayStyleHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Style
      </Title>
    </Group>
  );

  const displayLineCurveSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={lineCurveSelectInput}
      label="Line curve"
      value={lineCurve}
    />
  );

  const displayChartColorsSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartColorsSelectInput}
      label="Chart colors"
      value={chartColors}
    />
  );

  const displayLineWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={lineWidthSliderInput}
      label="Line width"
      symbol="px"
      value={lineWidth}
    />
  );

  const displayEnableAreaSwitchInput = (
    <Group w="100%">
      {enableAreaSwitchInput}
    </Group>
  );

  const displayAreaOpacitySliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={areaOpacitySliderInput}
      isInputDisabled={!enableArea}
      label="Area opacity"
      value={areaOpacity}
    />
  );

  const displayAreaBlendModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={areaBlendModeSelectInput}
      isInputDisabled={!enableArea}
      label="Area blend mode"
      value={areaBlendMode}
    />
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      <Group w="100%" align="baseline" px="md">
        {displayLineCurveSelectInput}
        {displayChartColorsSelectInput}
        {displayLineWidthSliderInput}
        {displayEnableAreaSwitchInput}
        {displayAreaOpacitySliderInput}
        {displayAreaBlendModeSelectInput}
      </Group>
    </Stack>
  );

  // points
  const displayPointsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Points
      </Title>
    </Group>
  );

  const displayEnablePointsSwitchInput = (
    <Group w="100%">
      {enablePointsSwitchInput}
    </Group>
  );

  const displayPointSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={pointSizeSliderInput}
      isInputDisabled={!enablePoints}
      label="Point size"
      symbol="px"
      value={pointSize}
    />
  );

  const displayPointColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={pointColorInput}
      isInputDisabled={!enablePoints}
      label="Point color"
      value={pointColor}
    />
  );

  const displayPointBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={pointBorderWidthSliderInput}
      isInputDisabled={!enablePoints}
      label="Point border width"
      symbol="px"
      value={pointBorderWidth}
    />
  );

  const displayEnablePointLabelSwitchInput = (
    <Group w="100%">
      {enablePointLabelSwitchInput}
    </Group>
  );

  const displayPointLabelSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={pointLabelSelectInput}
      isInputDisabled={!enablePointLabel}
      label="Point label"
      value={pointLabel}
    />
  );

  const displayPointLabelYOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={pointLabelYOffsetSliderInput}
      isInputDisabled={!enablePointLabel}
      label="Point label Y offset"
      symbol="px"
      value={pointLabelYOffset}
    />
  );

  const displayPointsSection = (
    <Stack w="100%">
      {displayPointsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnablePointsSwitchInput}
        {displayPointSizeSliderInput}
        {displayPointColorInput}
        {displayPointBorderWidthSliderInput}
        {displayEnablePointLabelSwitchInput}
        {displayPointLabelSelectInput}
        {displayPointLabelYOffsetSliderInput}
      </Group>
    </Stack>
  );

  // grids
  const displayGridsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Grids
      </Title>
    </Group>
  );

  const displayEnableGridXSwitchInput = (
    <Group w="100%">
      {enableGridXSwitchInput}
    </Group>
  );

  const displayEnableGridYSwitchInput = (
    <Group w="100%">
      {enableGridYSwitchInput}
    </Group>
  );

  const displayGridsSection = (
    <Stack w="100%">
      {displayGridsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableGridXSwitchInput}
        {displayEnableGridYSwitchInput}
      </Group>
    </Stack>
  );

  // axes
  const displayChartAxisTop = (
    <ChartAxisTop
      axisTopLegend={axisTopLegend}
      axisTopLegendOffset={axisTopLegendOffset}
      axisTopLegendPosition={axisTopLegendPosition}
      axisTopTickPadding={axisTopTickPadding}
      axisTopTickRotation={axisTopTickRotation}
      axisTopTickSize={axisTopTickSize}
      enableAxisTop={enableAxisTop}
      initialChartState={stateWithChartTitle}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  const displayChartAxisRight = (
    <ChartAxisRight
      axisRightLegend={axisRightLegend}
      axisRightLegendOffset={axisRightLegendOffset}
      axisRightLegendPosition={axisRightLegendPosition}
      axisRightTickPadding={axisRightTickPadding}
      axisRightTickRotation={axisRightTickRotation}
      axisRightTickSize={axisRightTickSize}
      enableAxisRight={enableAxisRight}
      initialChartState={stateWithChartTitle}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  const displayChartAxisBottom = (
    <ChartAxisBottom
      axisBottomLegend={axisBottomLegend}
      axisBottomLegendOffset={axisBottomLegendOffset}
      axisBottomLegendPosition={axisBottomLegendPosition}
      axisBottomTickPadding={axisBottomTickPadding}
      axisBottomTickRotation={axisBottomTickRotation}
      axisBottomTickSize={axisBottomTickSize}
      enableAxisBottom={enableAxisBottom}
      initialChartState={stateWithChartTitle}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  const displayChartAxisLeft = (
    <ChartAxisLeft
      axisLeftLegend={axisLeftLegend}
      axisLeftLegendOffset={axisLeftLegendOffset}
      axisLeftLegendPosition={axisLeftLegendPosition}
      axisLeftTickPadding={axisLeftTickPadding}
      axisLeftTickRotation={axisLeftTickRotation}
      axisLeftTickSize={axisLeftTickSize}
      enableAxisLeft={enableAxisLeft}
      initialChartState={stateWithChartTitle}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  // interactivity
  const displayInteractivityHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Interactivity
      </Title>
    </Group>
  );

  const displayEnableCrosshairSwitchInput = (
    <Group w="100%">
      {enableCrosshairSwitchInput}
    </Group>
  );

  const displayCrosshairTypeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={crosshairTypeSelectInput}
      isInputDisabled={!enableCrosshair}
      label="Crosshair type"
      value={crosshairType}
    />
  );

  const displayInteractivitySection = (
    <Stack w="100%">
      {displayInteractivityHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableCrosshairSwitchInput}
        {displayCrosshairTypeSelectInput}
      </Group>
    </Stack>
  );

  // legends
  const displayChartLegend = (
    <ChartLegend
      enableLegend={enableLegend}
      enableLegendJustify={enableLegendJustify}
      initialChartState={stateWithChartTitle}
      legendAnchor={legendAnchor}
      legendDirection={legendDirection}
      legendItemBackground={legendItemBackground}
      legendItemDirection={legendItemDirection}
      legendItemHeight={legendItemHeight}
      legendItemOpacity={legendItemOpacity}
      legendItemTextColor={legendItemTextColor}
      legendItemWidth={legendItemWidth}
      legendItemsSpacing={legendItemsSpacing}
      legendSymbolBorderColor={legendSymbolBorderColor}
      legendSymbolBorderWidth={legendSymbolBorderWidth}
      legendSymbolShape={legendSymbolShape}
      legendSymbolSize={legendSymbolSize}
      legendSymbolSpacing={legendSymbolSpacing}
      legendTranslateX={legendTranslateX}
      legendTranslateY={legendTranslateY}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  // motion
  const displayMotionHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Motion
      </Title>
    </Group>
  );

  const displayEnableAnimateSwitchInput = (
    <Group w="100%">
      {enableAnimateSwitchInput}
    </Group>
  );

  const displayMotionConfigSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={motionConfigSelectInput}
      isInputDisabled={!enableAnimate}
      label="Motion config"
      value={motionConfig}
    />
  );

  const displayMotionSection = (
    <Stack w="100%">
      {displayMotionHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableAnimateSwitchInput}
        {displayMotionConfigSelectInput}
      </Group>
    </Stack>
  );

  // options
  const displayChartOptions = (
    <ChartOptions
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      initialChartState={stateWithChartTitle}
      isError={isError}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
      screenshotFilename={screenshotFilename}
      screenshotImageQuality={screenshotImageQuality}
      screenshotImageType={screenshotImageType}
    />
  );

  const displayResetAllButton = (
    <Tooltip label="Reset all inputs to their default values">
      <Group>{resetAllButton}</Group>
    </Tooltip>
  );

  const displayResetAll = (
    <Stack w="100%" p="md">
      <ChartsAndGraphsControlsStacker
        initialChartState={stateWithChartTitle}
        input={displayResetAllButton}
        label="Reset all values"
        value=""
      />
    </Stack>
  );

  const lineChartControlsStack = (
    <Flex w="100%" direction="column">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayPointsSection}
      {displayGridsSection}
      {displayChartAxisTop}
      {displayChartAxisRight}
      {displayChartAxisBottom}
      {displayChartAxisLeft}
      {displayInteractivitySection}
      {displayChartLegend}
      {displayMotionSection}
      {displayChartOptions}
      {displayResetAll}
    </Flex>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={lineChartControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayResponsiveLine}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsiveLineChart };
