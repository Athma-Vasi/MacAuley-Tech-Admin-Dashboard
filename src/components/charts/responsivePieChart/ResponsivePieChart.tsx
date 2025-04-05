import {
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { addCommaSeparator, returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartArcLabel } from "../chartControls/ChartArcLabel";
import { ChartLegend } from "../chartControls/ChartLegend";
import { ChartMargin } from "../chartControls/ChartMargin";
import { ChartOptions } from "../chartControls/ChartOptions";
import {
  NIVO_CHART_PATTERN_DEFS,
  NIVO_COLOR_SCHEME_DATA,
  NIVO_MOTION_CONFIG_DATA,
  NIVO_TRANSITION_MODE_DATA,
  SLIDER_TOOLTIP_COLOR,
} from "../constants";

import ChartAndControlsDisplay from "../display/ChartAndControlsDisplay";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { createChartHeaderStyles } from "../utils";
import { responsivePieChartAction } from "./actions";
import { responsivePieChartReducer } from "./reducers";
import { initialResponsivePieChartState } from "./state";
import type { ResponsivePieChartProps } from "./types";
import { createPieFillPatterns } from "./utils";

function ResponsivePieChart({
  dashboardChartTitle,
  hideControls = false,
  pieChartData,
  chartUnitKind,
  tooltip,
}: ResponsivePieChartProps) {
  const {
    globalState: { themeObject, isPrefersReducedMotion },
  } = useGlobalState();

  const {
    darkColorShade,
    bgGradient,
    textColor,
    grayColorShade,
    stickyHeaderBgGradient,
    scrollBarStyle,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  useEffect(() => {
    // ensures appropriate colors based on color scheme
    const modifiedResponsivePieChartState = {
      ...initialResponsivePieChartState,
      chartTitle: dashboardChartTitle ?? "Pie Chart",
      arcLabelsTextColor: darkColorShade,
      arcLinkLabelsTextColor: textColor,
      chartTitleColor: textColor,
    };

    responsivePieChartDispatch({
      action: responsivePieChartAction.resetChartToDefault,
      payload: modifiedResponsivePieChartState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeObject]);

  const stateWithChartTitle = {
    ...initialResponsivePieChartState,
    chartTitle: dashboardChartTitle ?? "Pie Chart",
  };

  const [responsivePieChartState, responsivePieChartDispatch] = useReducer(
    responsivePieChartReducer,
    stateWithChartTitle,
  );

  const {
    startAngle, // -180 - 360 default: 0 step: 1
    endAngle, // -360 - 360 default: 360 step: 1
    innerRadius, // 0 - 1 default: 0 step: 0.05
    padAngle, // 0 - 45 default: 0 step: 1
    cornerRadius, // 0px - 45px default: 0 step: 1
    sortByValue, // default: false

    colorScheme,
    enableFillPatterns, // default: false
    arcBorderColor, // default: #ffffff
    arcBorderWidth, // 0px - 20px default: 0 step: 1

    arcLabel, // default: formattedValue
    enableArcLabels, // default: true
    arcLabelsRadiusOffset, // 0 - 2 default: 0.5 step: 0.05
    arcLabelsSkipAngle, // 0 - 45 default: 0 step: 1
    arcLabelsTextColor, // default: #333333

    enableArcLinkLabels, // default: true
    arcLinkLabelsSkipAngle, // 0 - 45 default: 0 step: 1
    arcLinkLabelsOffset, // -24px - 24px default: 0 step: 1
    arcLinkLabelsDiagonalLength, // 0px - 36px default: 16 step: 1
    arcLinkLabelsStraightLength, // 0px - 36px default: 24 step: 1
    arcLinkLabelsTextOffset, // 0px - 36px default: 6 step: 1
    arcLinkLabelsThickness, // 0px - 20px default: 1 step: 1
    arcLinkLabelsTextColor, // default: #333333

    activeInnerRadiusOffset, // 0px - 50px default: 0 step: 1
    activeOuterRadiusOffset, // 0px - 50px default: 0 step: 1

    enableAnimate, // default: true
    motionConfig,
    transitionMode,

    marginBottom, // 0px - 60px default: 60 step: 1
    marginLeft, // 0px - 60px default: 60 step: 1
    marginRight, // 0px - 60px default: 60 step: 1
    marginTop, // 0px - 60px default: 60 step: 1

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
  } = responsivePieChartState;

  const chartRef = useRef(null);

  // set motion config on enable
  useEffect(() => {
    if (!isPrefersReducedMotion) {
      return;
    }

    responsivePieChartDispatch({
      action: responsivePieChartAction.setEnableAnimate,
      payload: false,
    });
  }, [isPrefersReducedMotion]);

  const displayResponsivePie = (
    <ResponsivePie
      data={pieChartData}
      // base
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={innerRadius}
      padAngle={padAngle}
      cornerRadius={cornerRadius}
      sortByValue={sortByValue}
      // style
      colors={{ scheme: colorScheme }}
      borderColor={arcBorderColor}
      borderWidth={arcBorderWidth}
      // arc labels
      arcLabel={arcLabel}
      enableArcLabels={enableArcLabels}
      arcLabelsRadiusOffset={arcLabelsRadiusOffset}
      arcLabelsSkipAngle={arcLabelsSkipAngle}
      arcLabelsTextColor={arcLabelsTextColor}
      // arc link labels
      enableArcLinkLabels={enableArcLinkLabels}
      arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
      arcLinkLabelsOffset={arcLinkLabelsOffset}
      arcLinkLabelsDiagonalLength={arcLinkLabelsDiagonalLength}
      arcLinkLabelsStraightLength={arcLinkLabelsStraightLength}
      arcLinkLabelsTextOffset={arcLinkLabelsTextOffset}
      arcLinkLabelsThickness={arcLinkLabelsThickness}
      arcLinkLabelsTextColor={arcLinkLabelsTextColor}
      // interactivity
      activeInnerRadiusOffset={activeInnerRadiusOffset}
      activeOuterRadiusOffset={activeOuterRadiusOffset}
      // motion
      animate={enableAnimate}
      motionConfig={motionConfig}
      transitionMode={transitionMode}
      defs={NIVO_CHART_PATTERN_DEFS}
      fill={enableFillPatterns ? createPieFillPatterns(pieChartData) : []}
      legends={enableLegend
        ? [
          {
            anchor: legendAnchor,
            direction: legendDirection,
            justify: enableLegendJustify,
            translateX: legendTranslateX,
            translateY: legendTranslateY,
            itemsSpacing: legendItemsSpacing,
            itemWidth: legendItemWidth,
            itemHeight: legendItemHeight,
            itemTextColor: legendItemTextColor,
            itemDirection: legendItemDirection,
            itemOpacity: legendItemOpacity,
            symbolSize: legendSymbolSize,
            symbolShape: legendSymbolShape,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]
        : []}
      valueFormat={(value) => addCommaSeparator(value)}
      tooltip={tooltip}
    />
  );

  if (hideControls) {
    return (
      <Group
        // h={chartHeight}
        // w={chartWidth}
        // w="100%"
        style={{
          outline: "1px solid red",
          width: "clamp(350px, 100%, 618px)",
          height: "clamp(250px, 400px, 500px)",
        }}
      >
        {displayResponsivePie}
      </Group>
    );
  }

  const startAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 360,
        min: -180,
        name: "startAngle",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setStartAngle,
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
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 360,
        step: 1,
        validValueAction: responsivePieChartAction.setEndAngle,
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
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 0.05,
        validValueAction: responsivePieChartAction.setInnerRadius,
        value: innerRadius,
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
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setPadAngle,
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
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setCornerRadius,
        value: cornerRadius,
      }}
    />
  );

  const sortByValueSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: sortByValue,
        invalidValueAction: responsivePieChartAction.setIsError,
        name: "sortByValue",
        parentDispatch: responsivePieChartDispatch,
        offLabel: "Off",
        onLabel: "On",
        validValueAction: responsivePieChartAction.setSortByValue,
        value: sortByValue,
      }}
    />
  );

  const colorSchemeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_COLOR_SCHEME_DATA,
        description: "Define chart's colors",
        hideLabel: true,
        name: "colorScheme",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setColorScheme,
        value: colorScheme,
      }}
    />
  );

  const borderColorInput = (
    <ColorInput
      aria-label="Border color"
      color={arcBorderColor}
      onChange={(color: string) => {
        responsivePieChartDispatch({
          action: responsivePieChartAction.setArcBorderColor,
          payload: color,
        });
      }}
      value={arcBorderColor}
      w={INPUT_WIDTH}
    />
  );

  const enableFillPatternsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableFillPatterns,
        invalidValueAction: responsivePieChartAction.setIsError,
        name: "enableFillPatterns",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setEnableFillPatterns,
        value: enableFillPatterns,
      }}
    />
  );

  const chartBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "arcBorderWidth",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setArcBorderWidth,
        value: arcBorderWidth,
      }}
    />
  );

  const enableArcLinkLabelsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableArcLinkLabels,
        invalidValueAction: responsivePieChartAction.setIsError,
        name: "enableArcLinkLabels",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setEnableArcLabels,
        value: enableArcLinkLabels,
      }}
    />
  );

  const arcLinkLabelsSkipAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 45,
        min: 0,
        name: "arcLinkLabelsSkipAngle",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setArcLinkLabelsSkipAngle,
        value: arcLinkLabelsSkipAngle,
      }}
    />
  );

  const arcLinkLabelsOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 24,
        min: -24,
        name: "arcLinkLabelsOffset",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setArcLinkLabelsOffset,
        value: arcLinkLabelsOffset,
      }}
    />
  );

  const arcLinkLabelsDiagonalLengthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 36,
        min: 0,
        name: "arcLinkLabelsDiagonalLength",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 16,
        step: 1,
        validValueAction:
          responsivePieChartAction.setArcLinkLabelsDiagonalLength,
        value: arcLinkLabelsDiagonalLength,
      }}
    />
  );

  const arcLinkLabelsStraightLengthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 36,
        min: 0,
        name: "arcLinkLabelsStraightLength",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 24,
        step: 1,
        validValueAction:
          responsivePieChartAction.setArcLinkLabelsStraightLength,
        value: arcLinkLabelsStraightLength,
      }}
    />
  );

  const arcLinkLabelsTextOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 36,
        min: 0,
        name: "arcLinkLabelsTextOffset",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 6,
        step: 1,
        validValueAction: responsivePieChartAction.setArcLinkLabelsTextOffset,
        value: arcLinkLabelsTextOffset,
      }}
    />
  );

  const arcLinkLabelsThicknessSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableArcLinkLabels,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "arcLinkLabelsThickness",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 1,
        step: 1,
        validValueAction: responsivePieChartAction.setArcLinkLabelsThickness,
        value: arcLinkLabelsThickness,
      }}
    />
  );

  const arcLinkLabelsTextColorInput = (
    <ColorInput
      aria-label="arc link labels text color"
      color={arcLinkLabelsTextColor}
      disabled={!enableArcLinkLabels}
      onChange={(color: string) => {
        responsivePieChartDispatch({
          action: responsivePieChartAction.setArcLinkLabelsTextColor,
          payload: color,
        });
      }}
      value={arcLinkLabelsTextColor}
      w={INPUT_WIDTH}
    />
  );

  const activeInnerRadiusOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 50,
        min: 0,
        name: "activeInnerRadiusOffset",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setActiveInnerRadiusOffset,
        value: activeInnerRadiusOffset,
      }}
    />
  );

  const activeOuterRadiusOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 50,
        min: 0,
        name: "activeOuterRadiusOffset",
        parentDispatch: responsivePieChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsivePieChartAction.setActiveOuterRadiusOffset,
        value: activeOuterRadiusOffset,
      }}
    />
  );

  const enableAnimateSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAnimate,
        invalidValueAction: responsivePieChartAction.setIsError,
        name: "enableAnimate",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setEnableAnimate,
        value: enableAnimate,
      }}
    />
  );

  const motionConfigSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_MOTION_CONFIG_DATA,
        description: "Configure react-spring.",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "motionConfig",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setMotionConfig,
        value: motionConfig,
      }}
    />
  );

  const transitionModeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_TRANSITION_MODE_DATA,
        description: "Define how transitions behave.",
        disabled: !enableAnimate,
        hideLabel: true,
        name: "transitionMode",
        parentDispatch: responsivePieChartDispatch,
        validValueAction: responsivePieChartAction.setTransitionMode,
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
          responsivePieChartDispatch({
            action: responsivePieChartAction.resetChartToDefault,
            payload: stateWithChartTitle,
          });
        },
      }}
    />
  );

  /** base */

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

  const displaySortByValueSwitchInput = (
    <Group w="100%" style={{ borderBottom: arcBorderColor }}>
      {sortByValueSwitchInput}
    </Group>
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      <Group w="100%" align="baseline" px="md">
        {displayStartAngleSliderInput}
        {displayEndAngleSliderInput}
        {displayInnerRadiusSliderInput}
        {displayPadAngleSliderInput}
        {displayCornerRadiusSliderInput}
        {displaySortByValueSwitchInput}
      </Group>
    </Stack>
  );

  /** style */
  const displayStyleHeading = (
    <Group
      w="100%"
      style={createChartHeaderStyles(bgGradient)}
    >
      <Title order={5} color={textColor}>
        Style
      </Title>
    </Group>
  );

  const displayEnableFillPatternsSwitchInput = (
    <Group w="100%" style={{ borderBottom: arcBorderColor }}>
      {enableFillPatternsSwitchInput}
    </Group>
  );

  const displayColorSchemeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={colorSchemeSelectInput}
      label="Chart colors"
      // prevents display of camelCased or snake_cased value
      value={NIVO_COLOR_SCHEME_DATA.find(({ value }) => value === colorScheme)
        ?.label ?? colorScheme}
    />
  );

  const displayBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={borderColorInput}
      label="Arc Border color"
      value={arcBorderColor}
    />
  );

  const displayArcBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={chartBorderWidthSliderInput}
      label="Arc border width"
      symbol="px"
      value={arcBorderWidth}
    />
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableFillPatternsSwitchInput}
        {displayColorSchemeSelectInput}
        {displayBorderColorInput}
        {displayArcBorderWidthSliderInput}
      </Group>
    </Stack>
  );

  /** arc labels */
  const displayChartArcLabel = (
    <ChartArcLabel
      arcLabel={arcLabel}
      arcLabelsRadiusOffset={arcLabelsRadiusOffset}
      arcLabelsSkipAngle={arcLabelsSkipAngle}
      arcLabelsTextColor={arcLabelsTextColor}
      enableArcLabels={enableArcLabels}
      initialChartState={stateWithChartTitle}
      parentChartAction={responsivePieChartAction}
      parentChartDispatch={responsivePieChartDispatch}
    />
  );

  /** arc link labels */
  const displayArcLinkLabelsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Arc link labels
      </Title>
    </Group>
  );

  const displayEnableArcLinkLabelsSwitchInput = (
    <Group w="100%" style={{ borderBottom: arcBorderColor }}>
      {enableArcLinkLabelsSwitchInput}
    </Group>
  );

  const displayArcLinkLabelsSkipAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsSkipAngleSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels skip angle"
      symbol="°"
      value={arcLinkLabelsSkipAngle}
    />
  );

  const displayArcLinkLabelsOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsOffsetSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels offset"
      symbol="px"
      value={arcLinkLabelsOffset}
    />
  );

  const displayArcLinkLabelsDiagonalLengthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsDiagonalLengthSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels diagonal length"
      symbol="px"
      value={arcLinkLabelsDiagonalLength}
    />
  );

  const displayArcLinkLabelsStraightLengthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsStraightLengthSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels straight length"
      symbol="px"
      value={arcLinkLabelsStraightLength}
    />
  );

  const displayArcLinkLabelsHeadingOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsTextOffsetSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels text offset"
      symbol="px"
      value={arcLinkLabelsTextOffset}
    />
  );

  const displayArcLinkLabelsThicknessSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsThicknessSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels thickness"
      symbol="px"
      value={arcLinkLabelsThickness}
    />
  );

  const displayArcLinkLabelsHeadingColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={arcLinkLabelsTextColorInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels text color"
      value={arcLinkLabelsTextColor}
    />
  );

  const displayArcLinkLabelsSection = (
    <Stack w="100%">
      {displayArcLinkLabelsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableArcLinkLabelsSwitchInput}
        {displayArcLinkLabelsSkipAngleSliderInput}
        {displayArcLinkLabelsOffsetSliderInput}
        {displayArcLinkLabelsDiagonalLengthSliderInput}
        {displayArcLinkLabelsStraightLengthSliderInput}
        {displayArcLinkLabelsHeadingOffsetSliderInput}
        {displayArcLinkLabelsThicknessSliderInput}
        {displayArcLinkLabelsHeadingColorInput}
      </Group>
    </Stack>
  );

  /** interactivity */
  const displayInteractivityHeading = (
    <Group
      w="100%"
      style={createChartHeaderStyles(bgGradient)}
    >
      <Title order={5} color={textColor}>
        Interactivity
      </Title>
    </Group>
  );

  const displayActiveInnerRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={activeInnerRadiusOffsetSliderInput}
      label="Active inner radius offset"
      value={activeInnerRadiusOffset}
      symbol="px"
    />
  );

  const displayActiveOuterRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={activeOuterRadiusOffsetSliderInput}
      label="Active outer radius offset"
      value={activeOuterRadiusOffset}
      symbol="px"
    />
  );

  const displayInteractivitySection = (
    <Stack w="100%">
      {displayInteractivityHeading}
      <Group w="100%" align="baseline" px="md">
        {displayActiveInnerRadiusOffsetSliderInput}
        {displayActiveOuterRadiusOffsetSliderInput}
      </Group>
    </Stack>
  );

  /** motion */
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

  const displayAnimateMotionSwitchInput = (
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
        {displayAnimateMotionSwitchInput}
        {displayMotionConfigSelectInput}
        {displayTransitionModeSelectInput}
      </Group>
    </Stack>
  );

  /** margin */
  const displayChartMargin = (
    <ChartMargin
      initialChartState={stateWithChartTitle}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      parentChartAction={responsivePieChartAction}
      parentChartDispatch={responsivePieChartDispatch}
    />
  );

  /** legend */
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
      parentChartAction={responsivePieChartAction}
      parentChartDispatch={responsivePieChartDispatch}
    />
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
      parentChartAction={responsivePieChartAction}
      parentChartDispatch={responsivePieChartDispatch}
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

  const pieChartControlsStack = (
    <Flex w="100%" direction="column">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayChartArcLabel}
      {displayArcLinkLabelsSection}
      {displayInteractivitySection}
      {displayMotionSection}
      {displayChartLegend}
      {displayChartOptions}
      {displayResetAll}
    </Flex>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={pieChartControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayResponsivePie}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsivePieChart };
