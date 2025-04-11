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
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useWindowSize } from "../../../hooks/useWindowSize";
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
} from "../constants";

import ChartAndControlsDisplay from "../display/ChartAndControlsDisplay";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { createChartHeaderStyles } from "../utils";
import { responsiveBarChartAction } from "./actions";
import {
  BAR_CHART_GROUP_MODE_SELECT_DATA,
  BAR_CHART_LAYOUT_SELECT_DATA,
  BAR_CHART_VALUE_SCALE_SELECT_DATA,
} from "./constants";
import { responsiveBarChartReducer } from "./reducers";
import { initialResponsiveBarChartState } from "./state";
import type { ResponsiveBarChartProps, ResponsiveBarChartState } from "./types";
import { createBarFillPatterns } from "./utils";

function ResponsiveBarChart({
  barChartData,
  dashboardChartTitle,
  hideControls = false,
  indexBy,
  keys,
  chartUnitKind,
  tooltip,
}: ResponsiveBarChartProps) {
  const { windowWidth } = useWindowSize();
  const {
    globalState: { isPrefersReducedMotion, themeObject },
  } = useGlobalState();

  const {
    darkColorShade,
    textColor,
    scrollBarStyle,
    grayColorShade,
    bgGradient,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  useEffect(() => {
    // sets initial colors based on app theme
    const modifiedInitialResponsiveBarChartState: ResponsiveBarChartState = {
      ...initialResponsiveBarChartState,
      chartBorderColor: textColor,
      chartTitle: dashboardChartTitle ?? "Bar Chart",
      labelTextColor: darkColorShade,
      chartTitleColor: textColor,
    };

    responsiveBarChartDispatch({
      action: responsiveBarChartAction.resetChartToDefault,
      payload: modifiedInitialResponsiveBarChartState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeObject]);

  const stateWithChartTitle = {
    ...initialResponsiveBarChartState,
    chartTitle: dashboardChartTitle ?? "Bar Chart",
  };

  const [responsiveBarChartState, responsiveBarChartDispatch] = useReducer(
    responsiveBarChartReducer,
    stateWithChartTitle,
  );

  const chartRef = useRef(null);

  const {
    /** base */
    groupMode, // default: stacked
    layout, // default: horizontal
    reverse, // default: false
    valueScale, // default: linear
    // scale
    innerPaddingBar, // 0 - 10 default: 0 step: 1
    paddingBar, // 0.1 - 0.9 default: 0.1 step: 0.1

    // base -> margin
    marginTop, // 0px - 200px default: 60 step: 1
    marginRight, // 0px - 200px default: 60 step: 1
    marginBottom, // 0px - 200px default: 60 step: 1
    marginLeft, // 0px - 200px default: 60 step: 1

    /** style */
    chartBorderColor, // default: #ffffff
    chartBorderRadius, // 0px - 36px default: 0 step: 1
    chartBorderWidth, // 0px - 20px default: 0 step: 1
    chartColors, // default: nivo
    enableFillPatterns, // default: false

    /** labels */
    enableLabels, // default: true
    labelSkipHeight, // 0 - 36 default: 0 step: 1
    labelSkipWidth, // 0 - 36 default: 0 step: 1
    labelTextColor, // default: #ffffff

    /** grid and axes */
    enableGridX, // default: false
    enableGridY, // default: true
    // axisTop
    axisTopLegend, // default: ''
    axisTopLegendOffset, // -60px - 60px default: 0 step: 1
    axisTopLegendPosition, // default: middle
    axisTopTickPadding, // 0 - 20 default: 5 step: 1
    axisTopTickRotation, // -90 - 90 default: 0 step: 1
    axisTopTickSize, // 0 - 20 default: 5 step: 1
    enableAxisTop, // default: false ? null
    // axisRight
    axisRightLegend, // default: ''
    axisRightLegendOffset, // -60px - 60px default: 0 step: 1
    axisRightLegendPosition, // default: middle
    axisRightTickPadding, // 0 - 20 default: 5 step: 1
    axisRightTickRotation, // -90 - 90 default: 0 step: 1
    axisRightTickSize, // 0 - 20 default: 5 step: 1
    enableAxisRight, // default: false ? null
    // axisBottom
    axisBottomLegend, // default: ''
    axisBottomLegendOffset, // -60px - 60px default: 0 step: 1
    axisBottomLegendPosition, // default: middle
    axisBottomTickPadding, // 0 - 20 default: 5 step: 1
    axisBottomTickRotation, // -90 - 90 default: 0 step: 1
    axisBottomTickSize, // 0 - 20 default: 5 step: 1
    enableAxisBottom, // default: true
    // axisLeft
    axisLeftLegend, // default: ''
    axisLeftLegendOffset, // -60px - 60px default: 0 step: 1
    axisLeftLegendPosition, // default: middle
    axisLeftTickPadding, // 0 - 20 default: 5 step: 1
    axisLeftTickRotation, // -90 - 90 default: 0 step: 1
    axisLeftTickSize, // 0 - 20 default: 5 step: 1
    enableAxisLeft, // default: false ? null

    /** legend */
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

    /** motion */
    enableAnimate, // default: true
    motionConfig, // default: default

    /** options */
    chartTitle,
    chartTitleColor,
    chartTitlePosition,
    chartTitleSize,

    /** screenshot */
    screenshotFilename,
    screenshotImageQuality,
    screenshotImageType,

    isError,
  } = responsiveBarChartState;

  // set motion config on enable
  useEffect(() => {
    if (!isPrefersReducedMotion) {
      return;
    }

    responsiveBarChartDispatch({
      action: responsiveBarChartAction.setEnableAnimate,
      payload: false,
    });
  }, [isPrefersReducedMotion]);

  if (!barChartData.length) {
    return null;
  }

  const { barFillPatterns } = createBarFillPatterns(barChartData);

  const displayResponsiveBar = (
    <ResponsiveBar
      // base
      data={barChartData}
      keys={keys}
      indexBy={indexBy}
      groupMode={groupMode}
      layout={layout}
      valueScale={{ type: valueScale }}
      indexScale={{ type: "band", round: true }}
      reverse={reverse}
      minValue="auto"
      maxValue="auto"
      padding={paddingBar}
      innerPadding={innerPaddingBar}
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      // style
      colors={{ scheme: chartColors }}
      borderRadius={chartBorderRadius}
      borderWidth={chartBorderWidth}
      borderColor={chartBorderColor}
      defs={NIVO_CHART_PATTERN_DEFS}
      fill={enableFillPatterns ? barFillPatterns : []}
      // labels
      enableLabel={enableLabels}
      labelSkipWidth={labelSkipWidth}
      labelSkipHeight={labelSkipHeight}
      labelTextColor={labelTextColor}
      // grid and axes
      enableGridX={enableGridX}
      enableGridY={enableGridY}
      axisTop={enableAxisTop
        ? {
          tickSize: axisTopTickSize,
          tickPadding: axisTopTickPadding,
          tickRotation: axisTopTickRotation,
          legend: axisTopLegend,
          legendOffset: axisTopLegendOffset,
          legendPosition: axisTopLegendPosition,
          format: (value) =>
            layout === "horizontal" ? addCommaSeparator(value) : null,
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
          format: (value) =>
            layout === "vertical" ? addCommaSeparator(value) : null,
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
          format: (value) =>
            layout === "horizontal" ? addCommaSeparator(value) : null,
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
          format: (value) =>
            layout === "vertical" ? addCommaSeparator(value) : null,
        }
        : null}
      legends={enableLegend
        ? [
          {
            dataFrom: "keys",
            anchor: legendAnchor,
            direction: legendDirection,
            justify: enableLegendJustify,
            translateX: legendTranslateX,
            translateY: legendTranslateY,
            itemsSpacing: legendItemsSpacing,
            itemWidth: legendItemWidth,
            itemHeight: legendItemHeight,
            itemBackground: legendItemBackground,
            itemTextColor: legendItemTextColor,
            itemDirection: legendItemDirection,
            itemOpacity: legendItemOpacity,
            // padding:'',
            symbolBorderColor: legendSymbolBorderColor,
            symbolBorderWidth: legendSymbolBorderWidth,
            symbolShape: legendSymbolShape,
            symbolSpacing: legendSymbolSpacing,
            symbolSize: legendSymbolSize,

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
      isInteractive={true}
      role="application"
      ariaLabel={chartTitle}
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue}${e.indexValue}`}
      valueFormat={(value) => addCommaSeparator(value)}
      tooltip={tooltip}
    />
  );

  if (hideControls) {
    return (
      <Box className="chart">
        {displayResponsiveBar}
      </Box>
    );
  }

  const groupModeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_GROUP_MODE_SELECT_DATA,
        description: "Define how bars are grouped together",
        hideLabel: true,
        name: "groupMode",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setGroupMode,
        value: groupMode,
      }}
    />
  );

  const layoutSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_LAYOUT_SELECT_DATA,
        description: "Define the chart layout",
        hideLabel: true,
        name: "layout",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setLayout,
        value: layout,
      }}
    />
  );

  const valueScaleSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_VALUE_SCALE_SELECT_DATA,
        description: "Define the scale of the chart",
        hideLabel: true,
        name: "valueScale",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setValueScale,
        value: valueScale,
      }}
    />
  );

  const reverseSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: reverse,
        name: "reverse",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setReverse,
        value: reverse,
      }}
    />
  );

  const paddingBarSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 0.9,
        min: 0.1,
        name: "paddingBar",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0.1,
        step: 0.1,
        validValueAction: responsiveBarChartAction.setPaddingBar,
        value: paddingBar,
      }}
    />
  );

  const innerPaddingBarSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 10,
        min: 0,
        name: "innerPaddingBar",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveBarChartAction.setInnerPaddingBar,
        value: innerPaddingBar,
      }}
    />
  );

  // style
  const chartColorsSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_COLOR_SCHEME_DATA,
        description: "Define chart colors",
        hideLabel: true,
        name: "chartColors",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setChartColors,
        value: chartColors,
      }}
    />
  );

  const chartBorderRadiusSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>
            {value} px
          </Text>
        ),
        max: 36,
        min: 0,
        name: "chartBorderRadius",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveBarChartAction.setChartBorderRadius,
        value: chartBorderRadius,
      }}
    />
  );

  const chartBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>
            {value} px
          </Text>
        ),
        max: 20,
        min: 0,
        name: "chartBorderWidth",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveBarChartAction.setChartBorderWidth,
        value: chartBorderWidth,
      }}
    />
  );

  const chartBorderColorInput = (
    <ColorInput
      aria-label="Border color"
      color={chartBorderColor}
      onChange={(color: string) => {
        responsiveBarChartDispatch({
          action: responsiveBarChartAction.setChartBorderColor,
          payload: color,
        });
      }}
      value={chartBorderColor}
      w={INPUT_WIDTH}
    />
  );

  const enableFillPatternsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableFillPatterns,
        name: "enableFillPatterns",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setEnableFillPatterns,
        value: enableFillPatterns,
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
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setEnableLabels,
        value: enableLabels,
      }}
    />
  );

  const labelSkipWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 36,
        min: 0,
        name: "labelSkipWidth",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveBarChartAction.setLabelSkipWidth,
        value: labelSkipWidth,
      }}
    />
  );

  const labelSkipHeightSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 36,
        min: 0,
        name: "labelSkipHeight",
        parentDispatch: responsiveBarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveBarChartAction.setLabelSkipHeight,
        value: labelSkipHeight,
      }}
    />
  );

  const labelTextColorInput = (
    <ColorInput
      aria-label="Label text color"
      color={labelTextColor}
      disabled={!enableLabels}
      onChange={(color: string) => {
        responsiveBarChartDispatch({
          action: responsiveBarChartAction.setLabelTextColor,
          payload: color,
        });
      }}
      value={labelTextColor}
      w={INPUT_WIDTH}
    />
  );

  // grid and axes

  const enableGridXSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableGridX,
        name: "enableGridX",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setEnableGridX,
        value: enableGridX,
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
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setEnableGridY,
        value: enableGridY,
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
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setEnableAnimate,
        value: enableAnimate,
      }}
    />
  );

  const motionConfigSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_MOTION_CONFIG_DATA,
        description: "Define motion config.",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "motionConfig",
        parentDispatch: responsiveBarChartDispatch,
        validValueAction: responsiveBarChartAction.setMotionConfig,
        value: motionConfig,
      }}
    />
  );

  const resetAllButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Reset all inputs to their default values",
        kind: "reset",
        name: "resetAll",
        onClick: () => {
          responsiveBarChartDispatch({
            action: responsiveBarChartAction.resetChartToDefault,
            payload: stateWithChartTitle,
          });
        },
      }}
    />
  );

  // input display

  // display base

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

  const displayGroupModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={groupModeSelectInput}
      label="Group mode"
      value={groupMode}
    />
  );

  const displayLayoutSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={layoutSelectInput}
      label="Layout"
      value={layout}
    />
  );

  const displayValueScaleSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={valueScaleSelectInput}
      label="Value scale"
      value={valueScale}
    />
  );

  const displayReverseSwitchInput = (
    <Group w="100%">
      {reverseSwitchInput}
    </Group>
  );

  const displayPaddingBarSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={paddingBarSliderInput}
      label="Padding bar"
      value={paddingBar}
    />
  );

  const displayInnerPaddingBarSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={innerPaddingBarSliderInput}
      label="Inner padding bar"
      symbol="px"
      value={innerPaddingBar}
    />
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      <Group w="100%" align="baseline" px="md">
        {displayGroupModeSelectInput}
        {displayLayoutSelectInput}
        {displayValueScaleSelectInput}
        {displayReverseSwitchInput}
        {displayPaddingBarSliderInput}
        {displayInnerPaddingBarSliderInput}
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
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
    />
  );

  // display style
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

  const displayColorsSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartColorsSelectInput}
      label="Colors"
      value={chartColors}
    />
  );

  const displayBorderRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartBorderRadiusSliderInput}
      label="Chart border radius"
      symbol="px"
      value={chartBorderRadius}
    />
  );

  const displayBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartBorderWidthSliderInput}
      label="Chart border width"
      symbol="px"
      value={chartBorderWidth}
    />
  );

  const displayBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartBorderColorInput}
      label="Chart border color"
      value={chartBorderColor}
    />
  );

  const displayToggleFillPatternsSwitchInput = (
    <Group w="100%">
      {enableFillPatternsSwitchInput}
    </Group>
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      <Group w="100%" align="baseline" px="md">
        {displayColorsSelectInput}
        {displayBorderRadiusSliderInput}
        {displayBorderWidthSliderInput}
        {displayBorderColorInput}
        {displayToggleFillPatternsSwitchInput}
      </Group>
    </Stack>
  );

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
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
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
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
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
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
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
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
    />
  );

  // display labels
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

  const displayToggleLabelsSwitchInput = (
    <Group w="100%">
      {enableLabelsSwitchInput}
    </Group>
  );

  const displayLabelSkipWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelSkipWidthSliderInput}
      isInputDisabled={!enableLabels}
      label="Label skip width"
      symbol="px"
      value={labelSkipWidth}
    />
  );

  const displayLabelSkipHeightSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelSkipHeightSliderInput}
      isInputDisabled={!enableLabels}
      label="Label skip height"
      symbol="px"
      value={labelSkipHeight}
    />
  );

  const displayLabelTextColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={labelTextColorInput}
      isInputDisabled={!enableLabels}
      label="Label text color"
      value={labelTextColor}
    />
  );

  const displayLabelsSection = (
    <Stack w="100%">
      {displayLabelsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayToggleLabelsSwitchInput}
        {displayLabelSkipWidthSliderInput}
        {displayLabelSkipHeightSliderInput}
        {displayLabelTextColorInput}
      </Group>
    </Stack>
  );

  // display grid
  const displayGridHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Grid
      </Title>
    </Group>
  );

  const displayToggleGridXSwitchInput = (
    <Group>
      {enableGridXSwitchInput}
    </Group>
  );

  const displayToggleGridYSwitchInput = (
    <Group>
      {enableGridYSwitchInput}
    </Group>
  );

  const displayGridSection = (
    <Stack w="100%">
      {displayGridHeading}
      <Group w="100%" align="baseline" px="md">
        {displayToggleGridXSwitchInput}
        {displayToggleGridYSwitchInput}
      </Group>
    </Stack>
  );

  // display motion
  const displayMotionHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
    >
      <Title order={5} color={textColor}>
        Motion
      </Title>
    </Group>
  );

  const displayToggleAnimateSwitchInput = (
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
        {displayToggleAnimateSwitchInput}
        {displayMotionConfigSelectInput}
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
      legendItemsSpacing={legendItemsSpacing}
      legendItemTextColor={legendItemTextColor}
      legendItemWidth={legendItemWidth}
      legendSymbolBorderColor={legendSymbolBorderColor}
      legendSymbolShape={legendSymbolShape}
      legendSymbolSize={legendSymbolSize}
      legendTranslateX={legendTranslateX}
      legendTranslateY={legendTranslateY}
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
      legendSymbolBorderWidth={legendSymbolBorderWidth}
      legendSymbolSpacing={legendSymbolSpacing}
    />
  );

  const displayChartOptions = (
    <ChartOptions
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      initialChartState={stateWithChartTitle}
      isError={isError}
      parentChartAction={responsiveBarChartAction}
      parentChartDispatch={responsiveBarChartDispatch}
      screenshotFilename={screenshotFilename}
      screenshotImageQuality={screenshotImageQuality}
      screenshotImageType={screenshotImageType}
    />
  );

  // options
  const displayResetAllButton = (
    <Tooltip label="Reset all input values to default">
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

  const barChartControlsStack = (
    <Flex w="100%" direction="column">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayLabelsSection}
      {displayGridSection}
      {displayChartAxisTop}
      {displayChartAxisRight}
      {displayChartAxisBottom}
      {displayChartAxisLeft}
      {displayChartLegend}
      {displayMotionSection}
      {displayChartOptions}
      {displayResetAll}
    </Flex>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={barChartControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayResponsiveBar}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsiveBarChart };
