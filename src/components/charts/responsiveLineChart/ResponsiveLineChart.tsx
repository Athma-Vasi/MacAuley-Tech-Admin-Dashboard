import {
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

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";

import { addCommaSeparator, returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartAxisBottom } from "../chartControls/ChartAxisBottom";
import { ChartAxisLeft } from "../chartControls/ChartAxisLeft";
import { ChartAxisRight } from "../chartControls/ChartAxisRight";
import { ChartAxisTop } from "../chartControls/ChartAxisTop";
import { ChartLegend } from "../chartControls/ChartLegend";
import { ChartMargin } from "../chartControls/ChartMargin";
import { ChartOptions } from "../chartControls/ChartOptions";
import {
  NIVO_CHART_PATTERN_DEFS,
  NIVO_COLOR_SCHEME_DATA,
  NIVO_MOTION_CONFIG_DATA,
  SLIDER_TOOLTIP_COLOR,
  STICKY_STYLE,
} from "../constants";

import {
  ChartAndControlsDisplay,
  ChartsAndGraphsControlsStacker,
} from "../utils";
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
  ResponsiveLineChartProps,
  ResponsiveLineChartState,
} from "./types";

function ResponsiveLineChart({
  lineChartData,
  dashboardChartTitle,
  hideControls = false,
  xFormat,
  yFormat,
  yScaleMin = "auto",
  yScaleMax = "auto",
  unitKind = "currency",
}: ResponsiveLineChartProps) {
  const {
    globalState: { isPrefersReducedMotion, themeObject },
  } = useGlobalState();

  const { grayColorShade, textColor, scrollBarStyle } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  // sets initial colors based on app theme
  const modifiedResponsiveLineChartState: ResponsiveLineChartState = {
    ...initialResponsiveLineChartState,
    chartTitle: dashboardChartTitle ?? "Line Chart",
    pointColor: "rgba(0, 0, 0, 0)",
    chartTitleColor: textColor,
  };

  const [responsiveLineChartState, responsiveLineChartDispatch] = useReducer(
    responsiveLineChartReducer,
    modifiedResponsiveLineChartState,
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

  const yAxisValue = (value: string) =>
    unitKind === "currency"
      ? "$" + addCommaSeparator(value)
      : unitKind === "percent"
      ? value + "%"
      : value;

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
          tickSize: axisTopTickSize,
          tickPadding: axisTopTickPadding,
          tickRotation: axisTopTickRotation,
          legend: axisTopLegend,
          legendOffset: axisTopLegendOffset,
          legendPosition: axisTopLegendPosition,
        }
        : null}
      axisRight={enableAxisRight
        ? {
          tickSize: axisRightTickSize,
          tickPadding: axisRightTickPadding,
          tickRotation: axisRightTickRotation,
          legend: axisRightLegend,
          legendOffset: axisRightLegendOffset,
          legendPosition: axisRightLegendPosition,
          format: (value) => addCommaSeparator(value),
        }
        : null}
      axisBottom={enableAxisBottom
        ? {
          tickSize: axisBottomTickSize,
          tickPadding: axisBottomTickPadding,
          tickRotation: axisBottomTickRotation,
          legend: axisBottomLegend,
          legendOffset: axisBottomLegendOffset,
          legendPosition: axisBottomLegendPosition,
        }
        : null}
      axisLeft={enableAxisLeft
        ? {
          tickSize: axisLeftTickSize,
          tickPadding: axisLeftTickPadding,
          tickRotation: axisLeftTickRotation,
          legend: axisLeftLegend,
          legendOffset: axisLeftLegendOffset,
          legendPosition: axisLeftLegendPosition,
          format: (value) => addCommaSeparator(value),
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
    />
  );

  if (hideControls) {
    return (
      <Group w={618} h={382}>
        {displayResponsiveLine}
      </Group>
    );
  }

  // base

  const xScaleSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_AXES_SCALE,
        description: "Define x scale",
        name: "xScale",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setXScale,
        value: xScale,
      }}
    />
  );

  const yScaleSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_AXES_SCALE,
        description: "Define y scale",
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableYScaleStacked",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableYScaleStacked,
        value: enableYScaleStacked,
      }}
    />
  );

  const reverseScaleSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: reverseScale,
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "reverseScale",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setReverseScale,
        value: reverseScale,
      }}
    />
  );

  // style

  const lineCurveSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_CURVE_DATA,
        description: "Define line curve",
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
        sliderDefaultValue: 2,
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableArea",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableArea,
        value: enableArea,
      }}
    />
  );

  const areaOpacitySliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 1,
        min: 0,
        name: "areaOpacity",
        parentDispatch: responsiveLineChartDispatch,
        sliderDefaultValue: 0.2,
        step: 0.1,
        validValueAction: responsiveLineChartAction.setAreaOpacity,
        value: areaOpacity,
      }}
    />
  );

  const areaBlendModeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_AREA_BLEND_MODE_DATA,
        description: "Define line area blend mode",
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enablePoints",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnablePoints,
        value: enablePoints,
      }}
    />
  );

  const pointSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "pointSize",
        parentDispatch: responsiveLineChartDispatch,
        sliderDefaultValue: 6,
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
    />
  );

  const pointBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "pointBorderWidth",
        parentDispatch: responsiveLineChartDispatch,
        sliderDefaultValue: 0,
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enablePointLabel",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnablePointLabel,
        value: enablePointLabel,
      }}
    />
  );

  const pointLabelSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_POINT_LABEL_DATA,
        description: "Define point label",
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
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 24,
        min: -22,
        name: "pointLabelYOffset",
        parentDispatch: responsiveLineChartDispatch,
        sliderDefaultValue: -12,
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableGridX",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableGridX,
        value: enableGridX,
      }}
    />
  );

  const enableGridYSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableGridY,
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableGridY",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableGridY,
        value: enableGridY,
      }}
    />
  );

  // interactivity

  const enableCrosshairSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableCrosshair,
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableCrosshair",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableCrosshair,
        value: enableCrosshair,
      }}
    />
  );

  const crosshairTypeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LINE_CROSSHAIR_TYPE_DATA,
        description: "Define crosshair type",
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
        invalidValueAction: responsiveLineChartAction.setPageInError,
        name: "enableAnimate",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveLineChartDispatch,
        validValueAction: responsiveLineChartAction.setEnableAnimate,
        value: enableAnimate,
      }}
    />
  );

  const motionConfigSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_MOTION_CONFIG_DATA,
        description: "Define motion config",
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
            payload: modifiedResponsiveLineChartState,
          });
        },
      }}
    />
  );

  // input display

  // base
  const displayBaseHeading = (
    <Group
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Base
      </Title>
    </Group>
  );

  const displayXScaleSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
      input={xScaleSelectInput}
      label="X scale"
      value={xScale}
    />
  );

  const displayYScaleSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
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
      {displayXScaleSelectInput}
      {displayYScaleSelectInput}
      {displayEnableYScaleStackedSwitchInput}
      {displayReverseScaleSwitchInput}
    </Stack>
  );

  // margin
  const displayChartMargin = (
    <ChartMargin
      initialChartState={modifiedResponsiveLineChartState}
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
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Style
      </Title>
    </Group>
  );

  const displayLineCurveSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
      input={lineCurveSelectInput}
      label="Line curve"
      value={lineCurve}
    />
  );

  const displayChartColorsSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
      input={chartColorsSelectInput}
      label="Chart colors"
      value={chartColors}
    />
  );

  const displayLineWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
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
      initialChartState={modifiedResponsiveLineChartState}
      input={areaOpacitySliderInput}
      isInputDisabled={!enableArea}
      label="Area opacity"
      value={areaOpacity}
    />
  );

  const displayAreaBlendModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
      input={areaBlendModeSelectInput}
      isInputDisabled={!enableArea}
      label="Area blend mode"
      value={areaBlendMode}
    />
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      {displayLineCurveSelectInput}
      {displayChartColorsSelectInput}
      {displayLineWidthSliderInput}
      {displayEnableAreaSwitchInput}
      {displayAreaOpacitySliderInput}
      {displayAreaBlendModeSelectInput}
    </Stack>
  );

  // points
  const displayPointsHeading = (
    <Group
      style={STICKY_STYLE}
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
      initialChartState={modifiedResponsiveLineChartState}
      input={pointSizeSliderInput}
      isInputDisabled={!enablePoints}
      label="Point size"
      symbol="px"
      value={pointSize}
    />
  );

  const displayPointColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
      input={pointColorInput}
      isInputDisabled={!enablePoints}
      label="Point color"
      value={pointColor}
    />
  );

  const displayPointBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
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
      initialChartState={modifiedResponsiveLineChartState}
      input={pointLabelSelectInput}
      isInputDisabled={!enablePointLabel}
      label="Point label"
      value={pointLabel}
    />
  );

  const displayPointLabelYOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveLineChartState}
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
      {displayEnablePointsSwitchInput}
      {displayPointSizeSliderInput}
      {displayPointColorInput}
      {displayPointBorderWidthSliderInput}
      {displayEnablePointLabelSwitchInput}
      {displayPointLabelSelectInput}
      {displayPointLabelYOffsetSliderInput}
    </Stack>
  );

  // grids
  const displayGridsHeading = (
    <Group
      style={STICKY_STYLE}
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
      {displayEnableGridXSwitchInput}
      {displayEnableGridYSwitchInput}
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
      initialChartState={modifiedResponsiveLineChartState}
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
      initialChartState={modifiedResponsiveLineChartState}
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
      initialChartState={modifiedResponsiveLineChartState}
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
      initialChartState={modifiedResponsiveLineChartState}
      parentChartAction={responsiveLineChartAction}
      parentChartDispatch={responsiveLineChartDispatch}
    />
  );

  // interactivity
  const displayInteractivityHeading = (
    <Group
      style={STICKY_STYLE}
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
      initialChartState={modifiedResponsiveLineChartState}
      input={crosshairTypeSelectInput}
      isInputDisabled={!enableCrosshair}
      label="Crosshair type"
      value={crosshairType}
    />
  );

  const displayInteractivitySection = (
    <Stack w="100%">
      {displayInteractivityHeading}
      {displayEnableCrosshairSwitchInput}
      {displayCrosshairTypeSelectInput}
    </Stack>
  );

  // legends
  const displayChartLegend = (
    <ChartLegend
      enableLegend={enableLegend}
      enableLegendJustify={enableLegendJustify}
      initialChartState={modifiedResponsiveLineChartState}
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
      style={STICKY_STYLE}
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
      initialChartState={modifiedResponsiveLineChartState}
      input={motionConfigSelectInput}
      isInputDisabled={!enableAnimate}
      label="Motion config"
      value={motionConfig}
    />
  );

  const displayMotionSection = (
    <Stack w="100%">
      {displayMotionHeading}
      {displayEnableAnimateSwitchInput}
      {displayMotionConfigSelectInput}
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
      initialChartState={modifiedResponsiveLineChartState}
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
    <Stack w="100%">
      <ChartsAndGraphsControlsStacker
        initialChartState={modifiedResponsiveLineChartState}
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
