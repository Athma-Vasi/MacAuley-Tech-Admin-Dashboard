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
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { addCommaSeparator, returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import {
  NIVO_COLOR_SCHEME_DATA,
  NIVO_MOTION_CONFIG_DATA,
  NIVO_TRANSITION_MODE_DATA,
  SLIDER_TOOLTIP_COLOR,
} from "../constants";

import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartLegend } from "../chartControls/chartLegend";
import { ChartMargin } from "../chartControls/chartMargin";
import { ChartOptions } from "../chartControls/chartOptions";
import ChartAndControlsDisplay from "../display/ChartAndControlsDisplay";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { NivoMotionConfig, NivoTransitionMode } from "../types";
import { createChartHeaderStyles } from "../utils";
import {
  ResponsiveRadialBarChartAction,
  responsiveRadialBarChartAction,
} from "./actions";
import { responsiveRadialBarChartReducer } from "./reducers";
import { initialResponsiveRadialBarChartState } from "./state";
import type {
  ResponsiveRadialBarChartProps,
  ResponsiveRadialBarChartState,
} from "./types";

function ResponsiveRadialBarChart(
  {
    dashboardChartTitle,
    hideControls = false,
    onClick,
    radialBarChartData,
    tooltip,
  }: ResponsiveRadialBarChartProps,
) {
  const {
    globalState: { isPrefersReducedMotion, themeObject },
  } = useGlobalState();

  const {
    darkColorShade,
    bgGradient,
    grayColorShade,
    textColor,
    scrollBarStyle,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  useEffect(() => {
    // sets initial colors based on color scheme
    const modifiedResponsiveRadialBarChartState: ResponsiveRadialBarChartState =
      {
        ...initialResponsiveRadialBarChartState,
        chartTitle: dashboardChartTitle ?? "Radial Bar Chart",
        chartTitleColor: textColor,
        legendItemTextColor: textColor,
        labelsTextColor: darkColorShade,
        ringBorderColor: textColor,
        tracksColor: grayColorShade,
      };

    responsiveRadialBarChartDispatch({
      action: responsiveRadialBarChartAction.resetChartToDefault,
      payload: modifiedResponsiveRadialBarChartState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeObject]);

  const stateWithChartTitle = {
    ...initialResponsiveRadialBarChartState,
    chartTitle: dashboardChartTitle ?? "Radial Bar Chart",
  };

  const [responsiveRadialBarChartState, responsiveRadialBarChartDispatch] =
    useReducer(
      responsiveRadialBarChartReducer,
      stateWithChartTitle,
    );

  const chartRef = useRef(null);

  const {
    // base
    // base -> margin
    marginTop, // 0px - 200px default: 60 step: 1
    marginRight, // 0px - 200px default: 60 step: 1
    marginBottom, // 0px - 200px default: 60 step: 1
    marginLeft, // 0px - 200px default: 60 step: 1
    // base -> angles
    startAngle, // -360 - 360 default: 0 step: 1
    endAngle, // -360 - 360 default: 270 step: 1
    innerRadius, // 0 - 0.95 default: 0.3 step: 0.05
    paddingRing, // 0 - 0.9 default: 0.2 step: 0.1
    padAngle, // 0 - 45 default: 0 step: 1
    cornerRadius, // 0px - 45px default: 0 step: 1

    // style
    chartColors, // default: 'nivo'
    ringBorderWidth, // 0px - 20px default: 0 step: 1
    ringBorderColor, // default: #ffffff

    // tracks
    enableTracks, // default: true
    tracksColor, // default: #333333

    // grids
    enableRadialGrid, // default: true
    enableCircularGrid, // default: true

    // axes
    // radial axis start
    enableRadialAxisStart, // default: true
    radialAxisStartTickSize, // 0 - 20 default: 5 step: 1
    radialAxisStartTickPadding, // 0 - 20 default: 5 step: 1
    radialAxisStartTickRotation, // -90 - 90 default: 0 step: 1

    // radial axis end
    enableRadialAxisEnd, // default: false
    radialAxisEndTickSize, // 0 - 20 default: 5 step: 1
    radialAxisEndTickPadding, // 0 - 20 default: 5 step: 1
    radialAxisEndTickRotation, // -90 - 90 default: 0 step: 1

    // circular axis inner
    enableCircularAxisInner, // default: false
    circularAxisInnerTickSize, // 0 - 20 default: 5 step: 1
    circularAxisInnerTickPadding, // 0 - 20 default: 5 step: 1
    circularAxisInnerTickRotation, // -90 - 90 default: 0 step: 1

    // circular axis outer
    enableCircularAxisOuter, // default: true
    circularAxisOuterTickSize, // 0 - 20 default: 5 step: 1
    circularAxisOuterTickPadding, // 0 - 20 default: 5 step: 1
    circularAxisOuterTickRotation, // -90 - 90 default: 0 step: 1

    // labels
    enableLabels, // default: false
    labelsSkipAngle, // 0 - 45 default: 10 step: 1
    labelsRadiusOffset, // 0 - 2 default: 0.5 step: 0.05
    labelsTextColor, // default: #333333

    // legend
    enableLegend, // default: false
    enableLegendJustify, // default: false
    legendAnchor, // default: bottom-right
    legendDirection, // default: column
    legendItemBackground, // default: rgba(0, 0, 0, 0)
    legendItemDirection, // default: left-to-right
    legendItemHeight, // 10px - 200px default: 20 step: 1
    legendItemOpacity, // 0 - 1 default: 1 step: 0.05
    legendItemTextColor, // default: #ffffff
    legendItemWidth, // 10px - 200px default: 60 step: 1
    legendItemsSpacing, // 0px - 60px default: 2 step: 1
    legendSymbolBorderColor, // default: #ffffff
    legendSymbolBorderWidth, // 0px - 20px default: 0 step: 1
    legendSymbolShape, // default: square
    legendSymbolSize, // 2px - 60px default: 12 step: 1
    legendSymbolSpacing, // 0px - 60px default: 8 step: 1
    legendTranslateX, // -200px - 200px default: 0 step: 1
    legendTranslateY, // -200px - 200px default: 0 step: 1

    // motion
    enableAnimate, // default: true
    motionConfig, // default: 'gentle'
    transitionMode, // default: 'centerRadius'

    // options
    chartTitle,
    chartTitleColor,
    chartTitlePosition,
    chartTitleSize,

    // screenshot
    screenshotFilename,
    screenshotImageQuality,
    screenshotImageType,

    isError,
  } = responsiveRadialBarChartState;

  // set motion config on enable
  useEffect(() => {
    if (!isPrefersReducedMotion) {
      return;
    }

    responsiveRadialBarChartDispatch({
      action: responsiveRadialBarChartAction.setEnableAnimate,
      payload: false,
    });
  }, [isPrefersReducedMotion]);

  const displayResponsiveRadialBar = (
    <ResponsiveRadialBar
      data={radialBarChartData}
      // base
      maxValue="auto"
      valueFormat={(value) => addCommaSeparator(value)}
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={innerRadius}
      padding={paddingRing}
      padAngle={padAngle}
      cornerRadius={cornerRadius}
      // style
      colors={{ scheme: chartColors }}
      borderWidth={ringBorderWidth}
      borderColor={ringBorderColor}
      // tracks
      enableTracks={enableTracks}
      tracksColor={tracksColor}
      // grids
      enableRadialGrid={enableRadialGrid}
      enableCircularGrid={enableCircularGrid}
      // axes
      radialAxisStart={enableRadialAxisStart
        ? {
          tickSize: radialAxisStartTickSize,
          tickPadding: radialAxisStartTickPadding,
          tickRotation: radialAxisStartTickRotation,
        }
        : void 0}
      radialAxisEnd={enableRadialAxisEnd
        ? {
          tickSize: radialAxisEndTickSize,
          tickPadding: radialAxisEndTickPadding,
          tickRotation: radialAxisEndTickRotation,
        }
        : void 0}
      circularAxisInner={enableCircularAxisInner
        ? {
          tickSize: circularAxisInnerTickSize,
          tickPadding: circularAxisInnerTickPadding,
          tickRotation: circularAxisInnerTickRotation,
        }
        : void 0}
      circularAxisOuter={enableCircularAxisOuter
        ? {
          tickSize: circularAxisOuterTickSize,
          tickPadding: circularAxisOuterTickPadding,
          tickRotation: circularAxisOuterTickRotation,
        }
        : void 0}
      // labels
      enableLabels={enableLabels}
      labelsSkipAngle={labelsSkipAngle}
      labelsRadiusOffset={labelsRadiusOffset}
      labelsTextColor={labelsTextColor}
      // legends
      legends={enableLegend
        ? [
          {
            anchor: legendAnchor,
            direction: legendDirection,
            justify: enableLegendJustify,
            translateX: legendTranslateX,
            translateY: legendTranslateY,
            itemWidth: legendItemWidth,
            itemHeight: legendItemHeight,
            itemsSpacing: legendItemsSpacing,
            itemOpacity: legendItemOpacity,
            symbolSize: legendSymbolSize,
            itemDirection: legendItemDirection,
            itemBackground: legendItemBackground,
            itemTextColor: legendItemTextColor,
            symbolShape: legendSymbolShape,
            symbolBorderColor: legendSymbolBorderColor,
            symbolBorderWidth: legendSymbolBorderWidth,
            symbolSpacing: legendSymbolSpacing,
            // padding: 20,
            effects: [
              {
                on: "hover",
                style: {
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
      transitionMode={transitionMode}
      isInteractive={true}
      role="application"
      ariaLabel="Nivo radial bar chart"
      tooltip={tooltip}
    />
  );

  if (hideControls) {
    return (
      <Box
        className="chart radial"
        data-testid="responsive-radial-bar-chart"
        onClick={onClick}
      >
        {displayResponsiveRadialBar}
      </Box>
    );
  }

  // base

  // base -> angles
  const startAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 360,
        min: -360,
        name: "startAngle",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setStartAngle,
        value: startAngle,
      }}
    />
  );

  const endAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 360,
        min: -360,
        name: "endAngle",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 270,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setEndAngle,
        value: endAngle,
      }}
    />
  );

  const innerRadiusSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 0.95,
        min: 0,
        name: "innerRadius",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0.3,
        step: 0.05,
        validValueAction: responsiveRadialBarChartAction.setInnerRadius,
        value: innerRadius,
      }}
    />
  );

  const paddingRingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 0.9,
        min: 0,
        name: "paddingRing",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0.2,
        step: 0.1,
        validValueAction: responsiveRadialBarChartAction.setPaddingRing,
        value: paddingRing,
      }}
    />
  );

  const padAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 45,
        min: 0,
        name: "padAngle",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setPadAngle,
        value: padAngle,
      }}
    />
  );

  const cornerRadiusSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 45,
        min: 0,
        name: "cornerRadius",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setCornerRadius,
        value: cornerRadius,
      }}
    />
  );

  // style
  const chartColorsSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_COLOR_SCHEME_DATA,
        description: "Define chart colors.",
        hideLabel: true,
        name: "chartColors",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setChartColors,
        value: chartColors,
      }}
    />
  );

  const ringBorderColorsInput = (
    <ColorInput
      aria-label="Ring border color"
      color={ringBorderColor}
      onChange={(color: string) => {
        responsiveRadialBarChartDispatch({
          action: responsiveRadialBarChartAction.setRingBorderColor,
          payload: color,
        });
      }}
      value={ringBorderColor}
      w={INPUT_WIDTH}
    />
  );

  const ringBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "ringBorderWidth",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setRingBorderWidth,
        value: ringBorderWidth,
      }}
    />
  );

  // tracks
  const enableTracksSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableTracks,
        name: "enableTracks",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableTracks,
        value: enableTracks.toString(),
      }}
    />
  );

  const tracksColorInput = (
    <ColorInput
      aria-label="Tracks color"
      color={tracksColor}
      disabled={!enableTracks}
      onChange={(color: string) => {
        responsiveRadialBarChartDispatch({
          action: responsiveRadialBarChartAction.setTracksColor,
          payload: color,
        });
      }}
      value={tracksColor}
      w={INPUT_WIDTH}
    />
  );

  // grids
  const enableRadialGridSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableRadialGrid,
        name: "enableRadialGrid",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableRadialGrid,
        value: enableRadialGrid.toString(),
      }}
    />
  );

  const enableCircularGridSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableCircularGrid,
        name: "enableCircularGrid",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableCircularGrid,
        value: enableCircularGrid.toString(),
      }}
    />
  );
  // axes
  // radial axis start
  const enableRadialAxisStartSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableRadialAxisStart,
        name: "enableRadialAxisStart",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction:
          responsiveRadialBarChartAction.setEnableRadialAxisStart,
        value: enableRadialAxisStart.toString(),
      }}
    />
  );

  const radialAxisStartTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisStart,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "radialAxisStartTickSize",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisStartTickSize,
        value: radialAxisStartTickSize,
      }}
    />
  );

  const radialAxisStartTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisStart,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "radialAxisStartTickPadding",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisStartTickPadding,
        value: radialAxisStartTickPadding,
      }}
    />
  );

  const radialAxisStartTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisStart,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "radialAxisStartTickRotation",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisStartTickRotation,
        value: radialAxisStartTickRotation,
      }}
    />
  );

  // radial axis end
  const enableRadialAxisEndSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableRadialAxisEnd,
        name: "enableRadialAxisEnd",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableRadialAxisEnd,
        value: enableRadialAxisEnd.toString(),
      }}
    />
  );

  const radialAxisEndTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisEnd,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "radialAxisEndTickSize",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisEndTickSize,
        value: radialAxisEndTickSize,
      }}
    />
  );

  const radialAxisEndTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisEnd,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "radialAxisEndTickPadding",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisEndTickPadding,
        value: radialAxisEndTickPadding,
      }}
    />
  );

  const radialAxisEndTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableRadialAxisEnd,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "radialAxisEndTickRotation",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setRadialAxisEndTickRotation,
        value: radialAxisEndTickRotation,
      }}
    />
  );

  // circular axis inner
  const enableCircularAxisInnerSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableCircularAxisInner,
        name: "enableCircularAxisInner",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction:
          responsiveRadialBarChartAction.setEnableCircularAxisInner,
        value: enableCircularAxisInner.toString(),
      }}
    />
  );

  const circularAxisInnerTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisInner,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "circularAxisInnerTickSize",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisInnerTickSize,
        value: circularAxisInnerTickSize,
      }}
    />
  );

  const circularAxisInnerTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisInner,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "circularAxisInnerTickPadding",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisInnerTickPadding,
        value: circularAxisInnerTickPadding,
      }}
    />
  );

  const circularAxisInnerTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisInner,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "circularAxisInnerTickRotation",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisInnerTickRotation,
        value: circularAxisInnerTickRotation,
      }}
    />
  );

  // circular axis outer
  const enableCircularAxisOuterSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableCircularAxisOuter,
        name: "enableCircularAxisOuter",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction:
          responsiveRadialBarChartAction.setEnableCircularAxisOuter,
        value: enableCircularAxisOuter.toString(),
      }}
    />
  );

  const circularAxisOuterTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisOuter,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "circularAxisOuterTickSize",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisOuterTickSize,
        value: circularAxisOuterTickSize,
      }}
    />
  );

  const circularAxisOuterTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisOuter,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "circularAxisOuterTickPadding",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisOuterTickPadding,
        value: circularAxisOuterTickPadding,
      }}
    />
  );

  const circularAxisOuterTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableCircularAxisOuter,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "circularAxisOuterTickRotation",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction:
          responsiveRadialBarChartAction.setCircularAxisOuterTickRotation,
        value: circularAxisOuterTickRotation,
      }}
    />
  );

  // labels
  const enableLabelsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableLabels,
        name: "enableLabels",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableLabels,
        value: enableLabels.toString(),
      }}
    />
  );

  const labelsSkipAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 45,
        min: 0,
        name: "labelsSkipAngle",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 10,
        step: 1,
        validValueAction: responsiveRadialBarChartAction.setLabelsSkipAngle,
        value: labelsSkipAngle,
      }}
    />
  );

  const labelsRadiusOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 2,
        min: 0,
        name: "labelsRadiusOffset",
        parentDispatch: responsiveRadialBarChartDispatch,
        defaultValue: 0.5,
        step: 0.05,
        validValueAction: responsiveRadialBarChartAction.setLabelsRadiusOffset,
        value: labelsRadiusOffset,
      }}
    />
  );

  const labelsTextColorInput = (
    <ColorInput
      aria-label="Labels text color"
      color={labelsTextColor}
      disabled={!enableLabels}
      onChange={(color: string) => {
        responsiveRadialBarChartDispatch({
          action: responsiveRadialBarChartAction.setLabelsTextColor,
          payload: color,
        });
      }}
      value={labelsTextColor}
      w={INPUT_WIDTH}
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
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setEnableAnimate,
        value: enableAnimate.toString(),
      }}
    />
  );

  const motionConfigSelectInput = (
    <AccessibleSelectInput<
      ResponsiveRadialBarChartAction["setMotionConfig"],
      NivoMotionConfig
    >
      attributes={{
        data: NIVO_MOTION_CONFIG_DATA,
        description: "Define motion config",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "motionConfig",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setMotionConfig,
        value: motionConfig,
      }}
    />
  );

  const transitionModeSelectInput = (
    <AccessibleSelectInput<
      ResponsiveRadialBarChartAction["setTransitionMode"],
      NivoTransitionMode
    >
      attributes={{
        data: NIVO_TRANSITION_MODE_DATA,
        description: "Define transition mode",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "transitionMode",
        parentDispatch: responsiveRadialBarChartDispatch,
        validValueAction: responsiveRadialBarChartAction.setTransitionMode,
        value: transitionMode,
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
          responsiveRadialBarChartDispatch({
            action: responsiveRadialBarChartAction.resetChartToDefault,
            payload: stateWithChartTitle,
          });
        },
      }}
    />
  );

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

  const displayStartAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={startAngleSliderInput}
      label="Start angle"
      symbol="°"
      value={startAngle}
    />
  );

  const displayEndAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={endAngleSliderInput}
      label="End angle"
      symbol="°"
      value={endAngle}
    />
  );

  const displayInnerRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={innerRadiusSliderInput}
      label="Inner radius"
      symbol="px"
      value={innerRadius}
    />
  );

  const displayPaddingRingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={paddingRingSliderInput}
      label="Padding ring"
      value={paddingRing}
    />
  );

  const displayPadAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={padAngleSliderInput}
      label="Pad angle"
      symbol="°"
      value={padAngle}
    />
  );

  const displayCornerRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={cornerRadiusSliderInput}
      label="Corner radius"
      symbol="px"
      value={cornerRadius}
    />
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      <Group w="100%" align="baseline" px="md">
        {displayStartAngleSliderInput}
        {displayEndAngleSliderInput}
        {displayInnerRadiusSliderInput}
        {displayPaddingRingSliderInput}
        {displayPadAngleSliderInput}
        {displayCornerRadiusSliderInput}
      </Group>
    </Stack>
  );

  const displayChartMargin = (
    <ChartMargin
      initialChartState={stateWithChartTitle}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      parentChartAction={responsiveRadialBarChartAction}
      parentChartDispatch={responsiveRadialBarChartDispatch}
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

  const displayChartColorsSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartColorsSelectInput}
      isInputDisabled={false}
      label="Chart colors"
      value={chartColors}
    />
  );

  const displayRingBorderColorsInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={ringBorderColorsInput}
      isInputDisabled={false}
      label="Ring border color"
      value={ringBorderColor}
    />
  );

  const displayRingBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={ringBorderWidthSliderInput}
      isInputDisabled={false}
      label="Ring border width"
      symbol="px"
      value={ringBorderWidth}
    />
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      <Group w="100%" align="baseline" px="md">
        {displayChartColorsSelectInput}
        {displayRingBorderColorsInput}
        {displayRingBorderWidthSliderInput}
      </Group>
    </Stack>
  );

  // tracks
  const displayTracksHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Tracks
      </Title>
    </Group>
  );

  const displayEnableTracksSwitchInput = (
    <Group w="100%">
      {enableTracksSwitchInput}
    </Group>
  );

  const displayTracksColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={tracksColorInput}
      isInputDisabled={!enableTracks}
      label="Tracks color"
      value={tracksColor}
    />
  );

  const displayTracksSection = (
    <Stack w="100%">
      {displayTracksHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableTracksSwitchInput}
        {displayTracksColorInput}
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

  const displayEnableRadialGridSwitchInput = (
    <Group w="100%">
      {enableRadialGridSwitchInput}
    </Group>
  );

  const displayEnableCircularGridSwitchInput = (
    <Group w="100%">
      {enableCircularGridSwitchInput}
    </Group>
  );

  const displayGridsSection = (
    <Stack w="100%">
      {displayGridsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableRadialGridSwitchInput}
        {displayEnableCircularGridSwitchInput}
      </Group>
    </Stack>
  );

  // axes
  // radial axis start
  const displayRadialAxisStartHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Radial axis start
      </Title>
    </Group>
  );

  const displayEnableRadialAxisStartSwitchInput = (
    <Group w="100%">
      {enableRadialAxisStartSwitchInput}
    </Group>
  );

  const displayRadialAxisStartTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisStartTickSizeSliderInput}
      isInputDisabled={!enableRadialAxisStart}
      label="Radial axis start tick size"
      symbol="px"
      value={radialAxisStartTickSize}
    />
  );

  const displayRadialAxisStartTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisStartTickPaddingSliderInput}
      isInputDisabled={!enableRadialAxisStart}
      label="Radial axis start tick padding"
      symbol="px"
      value={radialAxisStartTickPadding}
    />
  );

  const displayRadialAxisStartTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisStartTickRotationSliderInput}
      isInputDisabled={!enableRadialAxisStart}
      label="Radial axis start tick rotation"
      symbol="°"
      value={radialAxisStartTickRotation}
    />
  );

  const displayRadialAxisStartSection = (
    <Stack w="100%">
      {displayRadialAxisStartHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableRadialAxisStartSwitchInput}
        {displayRadialAxisStartTickSizeSliderInput}
        {displayRadialAxisStartTickPaddingSliderInput}
        {displayRadialAxisStartTickRotationSliderInput}
      </Group>
    </Stack>
  );

  // radial axis end
  const displayRadialAxisEndHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Radial axis end
      </Title>
    </Group>
  );

  const displayEnableRadialAxisEndSwitchInput = (
    <Group w="100%">
      {enableRadialAxisEndSwitchInput}
    </Group>
  );

  const displayRadialAxisEndTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisEndTickSizeSliderInput}
      isInputDisabled={!enableRadialAxisEnd}
      label="Radial axis end tick size"
      symbol="px"
      value={radialAxisEndTickSize}
    />
  );

  const displayRadialAxisEndTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisEndTickPaddingSliderInput}
      isInputDisabled={!enableRadialAxisEnd}
      label="Radial axis end tick padding"
      symbol="px"
      value={radialAxisEndTickPadding}
    />
  );

  const displayRadialAxisEndTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={radialAxisEndTickRotationSliderInput}
      isInputDisabled={!enableRadialAxisEnd}
      label="Radial axis end tick rotation"
      symbol="°"
      value={radialAxisEndTickRotation}
    />
  );

  const displayRadialAxisEndSection = (
    <Stack w="100%">
      {displayRadialAxisEndHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableRadialAxisEndSwitchInput}
        {displayRadialAxisEndTickSizeSliderInput}
        {displayRadialAxisEndTickPaddingSliderInput}
        {displayRadialAxisEndTickRotationSliderInput}
      </Group>
    </Stack>
  );

  // circular axis inner
  const displayCircularAxisInnerHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Circular axis inner
      </Title>
    </Group>
  );

  const displayEnableCircularAxisInnerSwitchInput = (
    <Group w="100%">
      {enableCircularAxisInnerSwitchInput}
    </Group>
  );

  const displayCircularAxisInnerTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisInnerTickSizeSliderInput}
      isInputDisabled={!enableCircularAxisInner}
      label="Circular axis inner tick size"
      symbol="px"
      value={circularAxisInnerTickSize}
    />
  );

  const displayCircularAxisInnerTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisInnerTickPaddingSliderInput}
      isInputDisabled={!enableCircularAxisInner}
      label="Circular axis inner tick padding"
      symbol="px"
      value={circularAxisInnerTickPadding}
    />
  );

  const displayCircularAxisInnerTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisInnerTickRotationSliderInput}
      isInputDisabled={!enableCircularAxisInner}
      label="Circular axis inner tick rotation"
      symbol="°"
      value={circularAxisInnerTickRotation}
    />
  );

  const displayCircularAxisInnerSection = (
    <Stack w="100%">
      {displayCircularAxisInnerHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableCircularAxisInnerSwitchInput}
        {displayCircularAxisInnerTickSizeSliderInput}
        {displayCircularAxisInnerTickPaddingSliderInput}
        {displayCircularAxisInnerTickRotationSliderInput}
      </Group>
    </Stack>
  );

  // circular axis outer
  const displayCircularAxisOuterHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Circular axis outer
      </Title>
    </Group>
  );

  const displayEnableCircularAxisOuterSwitchInput = (
    <Group w="100%">
      {enableCircularAxisOuterSwitchInput}
    </Group>
  );

  const displayCircularAxisOuterTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisOuterTickSizeSliderInput}
      isInputDisabled={!enableCircularAxisOuter}
      label="Circular axis outer tick size"
      symbol="px"
      value={circularAxisOuterTickSize}
    />
  );

  const displayCircularAxisOuterTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisOuterTickPaddingSliderInput}
      isInputDisabled={!enableCircularAxisOuter}
      label="Circular axis outer tick padding"
      symbol="px"
      value={circularAxisOuterTickPadding}
    />
  );

  const displayCircularAxisOuterTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={circularAxisOuterTickRotationSliderInput}
      isInputDisabled={!enableCircularAxisOuter}
      label="Circular axis outer tick rotation"
      symbol="°"
      value={circularAxisOuterTickRotation}
    />
  );

  const displayCircularAxisOuterSection = (
    <Stack w="100%">
      {displayCircularAxisOuterHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableCircularAxisOuterSwitchInput}
        {displayCircularAxisOuterTickSizeSliderInput}
        {displayCircularAxisOuterTickPaddingSliderInput}
        {displayCircularAxisOuterTickRotationSliderInput}
      </Group>
    </Stack>
  );

  // labels
  const displayLabelsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Labels
      </Title>
    </Group>
  );

  const displayEnableLabelsSwitchInput = (
    <Group w="100%">
      {enableLabelsSwitchInput}
    </Group>
  );

  const displayLabelsSkipAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelsSkipAngleSliderInput}
      isInputDisabled={!enableLabels}
      label="Labels skip angle"
      symbol="°"
      value={labelsSkipAngle}
    />
  );

  const displayLabelsRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelsRadiusOffsetSliderInput}
      isInputDisabled={!enableLabels}
      label="Labels radius offset"
      symbol="px"
      value={labelsRadiusOffset}
    />
  );

  const displayLabelsTextColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelsTextColorInput}
      isInputDisabled={!enableLabels}
      label="Labels text color"
      value={labelsTextColor}
    />
  );

  const displayLabelsSection = (
    <Stack w="100%">
      {displayLabelsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableLabelsSwitchInput}
        {displayLabelsSkipAngleSliderInput}
        {displayLabelsRadiusOffsetSliderInput}
        {displayLabelsTextColorInput}
      </Group>
    </Stack>
  );

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
      parentChartAction={responsiveRadialBarChartAction}
      parentChartDispatch={responsiveRadialBarChartDispatch}
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

  const displayTransitionModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={transitionModeSelectInput}
      isInputDisabled={!enableAnimate}
      label="Transition mode"
      value={transitionMode}
    />
  );

  const displayMotionSection = (
    <Stack w="100%">
      {displayMotionHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableAnimateSwitchInput}
        {displayMotionConfigSelectInput}
        {displayTransitionModeSelectInput}
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
      parentChartAction={responsiveRadialBarChartAction}
      parentChartDispatch={responsiveRadialBarChartDispatch}
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

  const radialBarChartControlsStack = (
    <Flex w="100%" direction="column">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayTracksSection}
      {displayGridsSection}
      {displayRadialAxisStartSection}
      {displayRadialAxisEndSection}
      {displayCircularAxisInnerSection}
      {displayCircularAxisOuterSection}
      {displayLabelsSection}
      {displayChartLegend}
      {displayMotionSection}
      {displayChartOptions}
      {displayResetAll}
    </Flex>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={radialBarChartControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayResponsiveRadialBar}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsiveRadialBarChart };
