import {
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartArcLabel } from "../chartControls/ChartArcLabel";
import { ChartMargin } from "../chartControls/ChartMargin";
import { ChartOptions } from "../chartControls/ChartOptions";
import {
  NIVO_CHART_PATTERN_DEFS,
  NIVO_COLOR_SCHEME_DATA,
  NIVO_MOTION_CONFIG_DATA,
  NIVO_TRANSITION_MODE_DATA,
  STICKY_STYLE,
} from "../constants";
// import { ChartsAndGraphsControlsStacker } from "../utils";
import {
  ChartAndControlsDisplay,
  ChartsAndGraphsControlsStacker,
} from "../utils";
import { responsiveSunburstChartAction } from "./actions";
import { responsiveSunburstChartReducer } from "./reducers";
import { initialResponsiveSunburstChartState } from "./state";
import type {
  ResponsiveSunburstChartProps,
  ResponsiveSunburstChartState,
} from "./types";

function ResponsiveSunburstChart({
  hideControls = false,
  sunburstChartData,
  valueFormat,
}: ResponsiveSunburstChartProps) {
  const {
    globalState: {
      isPrefersReducedMotion,
      themeObject,
    },
  } = useGlobalState();

  const {
    grayColorShade,
    textColor,
    scrollBarStyle,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  // sets initial colors based on app theme
  const modifiedResponsiveSunburstChartState: ResponsiveSunburstChartState = {
    ...initialResponsiveSunburstChartState,
    chartBorderColor: grayColorShade,
    arcLabelsTextColor: textColor,
    chartTitleColor: textColor,
  };

  const [responsiveSunburstChartState, responsiveSunburstChartDispatch] =
    useReducer(
      responsiveSunburstChartReducer,
      initialResponsiveSunburstChartState,
    );

  const chartRef = useRef(null);

  const {
    // base
    cornerRadius, // 0px - 45px default: 0 step: 1

    // margin
    marginTop, // 0px - 200px default: 60 step: 1
    marginRight, // 0px - 200px default: 60 step: 1
    marginBottom, // 0px - 200px default: 60 step: 1
    marginLeft, // 0px - 200px default: 60 step: 1

    // style
    chartColors, // default: 'nivo'
    inheritColorFromParent, // default: true
    chartBorderWidth, // 0px - 20px default: 1 step: 1
    chartBorderColor, // default: 'white'
    enableFillPatterns, // default: false
    fillPatterns, // default: []

    // arc labels
    enableArcLabels, // default: false
    arcLabel, // default: 'formattedValue'
    arcLabelsRadiusOffset, // 0 - 2 default: 0.5 step: 0.05
    arcLabelsSkipAngle, // 0 - 45 default: 0 step: 1
    arcLabelsTextColor, // default: 'gray'

    // motion
    enableAnimate, // default: true
    motionConfig, // default: 'gentle'
    transitionMode, // default: 'innerRadius'

    // options
    chartTitle,
    chartTitleColor,
    chartTitlePosition,
    chartTitleSize,

    // screenshot
    screenshotFilename,
    screenshotImageQuality,
    screenshotImageType,
  } = responsiveSunburstChartState;

  // set motion config on enable
  useEffect(() => {
    if (!isPrefersReducedMotion) {
      return;
    }

    responsiveSunburstChartDispatch({
      action: responsiveSunburstChartAction.setEnableAnimate,
      payload: false,
    });
  }, [isPrefersReducedMotion]);

  const displayResponsiveSunburst = (
    <ResponsiveSunburst
      data={sunburstChartData}
      id="name"
      value="value"
      valueFormat={valueFormat}
      // base
      cornerRadius={cornerRadius}
      // margin
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      // style
      colors={{ scheme: chartColors }}
      inheritColorFromParent={inheritColorFromParent}
      borderColor={chartBorderColor}
      borderWidth={chartBorderWidth}
      defs={NIVO_CHART_PATTERN_DEFS}
      fill={[{ match: { depth: 1 }, id: "lines" }]}
      // arc labels
      enableArcLabels={enableArcLabels}
      arcLabel={arcLabel}
      arcLabelsRadiusOffset={arcLabelsRadiusOffset}
      arcLabelsSkipAngle={arcLabelsSkipAngle}
      arcLabelsTextColor={arcLabelsTextColor}
      // interactivity
      isInteractive={true}
      onClick={(node, event) => {
        console.log("node", node);
        console.log("event", event);
      }}
      // motion
      animate={enableAnimate}
      motionConfig={motionConfig}
      transitionMode={transitionMode}
    />
  );

  if (hideControls) {
    return (
      <Group>
        {displayResponsiveSunburst}
      </Group>
    );
  }

  // base

  const cornerRadiusSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => <Text style={{ color: "gray" }}>{value} px</Text>,
        max: 45,
        min: 0,
        name: "cornerRadius",
        parentDispatch: responsiveSunburstChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveSunburstChartAction.setCornerRadius,
        value: cornerRadius,
      }}
    />
  );

  // style

  const chartColorsSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_COLOR_SCHEME_DATA,
        description: "Define chart colors",
        name: "charColors",
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction: responsiveSunburstChartAction.setChartColors,
        value: chartColors,
      }}
    />
  );

  const inheritColorFromParentSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: inheritColorFromParent,
        invalidValueAction: responsiveSunburstChartAction.setPageInError,
        name: "inheritColorFromParent",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction:
          responsiveSunburstChartAction.setInheritColorFromParent,
        value: inheritColorFromParent,
      }}
    />
  );

  const chartBorderSwitchSliderInput = (
    <AccessibleSliderInput
      attributes={{
        max: 20,
        min: 0,
        name: "chartBorderWidth",
        parentDispatch: responsiveSunburstChartDispatch,
        sliderDefaultValue: 1,
        step: 1,
        validValueAction: responsiveSunburstChartAction.setChartBorderWidth,
        value: chartBorderWidth,
      }}
    />
  );

  const chartBorderColorInput = (
    <ColorInput
      aria-label="chart border color"
      color={chartBorderColor}
      onChange={(color: string) => {
        responsiveSunburstChartDispatch({
          action: responsiveSunburstChartAction.setChartBorderColor,
          payload: color,
        });
      }}
      value={chartBorderColor}
    />
  );

  const enableFillPatternsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableFillPatterns,
        invalidValueAction: responsiveSunburstChartAction.setPageInError,
        name: "enableFillPatterns",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction: responsiveSunburstChartAction.setEnableFillPatterns,
        value: enableFillPatterns,
      }}
    />
  );

  // motion

  const enableAnimateSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAnimate,
        invalidValueAction: responsiveSunburstChartAction.setPageInError,
        name: "enableAnimate",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction: responsiveSunburstChartAction.setEnableAnimate,
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
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction: responsiveSunburstChartAction.setMotionConfig,
        value: motionConfig,
      }}
    />
  );

  const transitionModeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_TRANSITION_MODE_DATA,
        description: "Define transition mode",
        name: "transitionMode",
        parentDispatch: responsiveSunburstChartDispatch,
        validValueAction: responsiveSunburstChartAction.setTransitionMode,
        value: transitionMode,
      }}
    />
  );

  const resetAllButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Reset all inputs to their default values",
        kind: "reset",
        name: "reset",
        onClick: () => {
          responsiveSunburstChartDispatch({
            action: responsiveSunburstChartAction.resetChartToDefault,
            payload: modifiedResponsiveSunburstChartState,
          });
        },
      }}
    />
  );

  /// input display

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

  const displayCornerRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveSunburstChartState}
      input={cornerRadiusSliderInput}
      label="Corner Radius"
      symbol="px"
      value={cornerRadius}
    />
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      {displayCornerRadiusSliderInput}
    </Stack>
  );

  // margin
  const displayChartMargin = (
    <ChartMargin
      initialChartState={modifiedResponsiveSunburstChartState}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      parentChartAction={responsiveSunburstChartAction}
      parentChartDispatch={responsiveSunburstChartDispatch}
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

  const displayChartColorsSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveSunburstChartState}
      input={chartColorsSelectInput}
      label="Chart Colors"
      value={chartColors}
    />
  );

  const displayInheritColorFromParentSwitchInput = (
    <Group w="100%">
      {inheritColorFromParentSwitchInput}
    </Group>
  );

  const displayChartBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveSunburstChartState}
      input={chartBorderSwitchSliderInput}
      label="Chart Border Width"
      symbol="px"
      value={chartBorderWidth}
    />
  );

  const displayChartBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveSunburstChartState}
      input={chartBorderColorInput}
      label="Chart Border Color"
      value={chartBorderColor}
    />
  );

  const displayEnableFillPatternsSwitchInput = (
    <Group w="100%">
      {enableFillPatternsSwitchInput}
    </Group>
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      {displayChartColorsSelectInput}
      {displayInheritColorFromParentSwitchInput}
      {displayChartBorderWidthSliderInput}
      {displayChartBorderColorInput}
      {displayEnableFillPatternsSwitchInput}
    </Stack>
  );

  // arc labels
  const displayChartArcLabel = (
    <ChartArcLabel
      arcLabel={arcLabel}
      arcLabelsRadiusOffset={arcLabelsRadiusOffset}
      arcLabelsSkipAngle={arcLabelsSkipAngle}
      arcLabelsTextColor={arcLabelsTextColor}
      enableArcLabels={enableArcLabels}
      initialChartState={modifiedResponsiveSunburstChartState}
      parentChartAction={responsiveSunburstChartAction}
      parentChartDispatch={responsiveSunburstChartDispatch}
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
      initialChartState={modifiedResponsiveSunburstChartState}
      input={motionConfigSelectInput}
      isInputDisabled={!enableAnimate}
      label="Motion Config"
      value={motionConfig}
    />
  );

  const displayTransitionModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedResponsiveSunburstChartState}
      input={transitionModeSelectInput}
      isInputDisabled={!enableAnimate}
      label="Transition Mode"
      value={transitionMode}
    />
  );

  const displayMotionSection = (
    <Stack w="100%">
      {displayMotionHeading}
      {displayEnableAnimateSwitchInput}
      {displayMotionConfigSelectInput}
      {displayTransitionModeSelectInput}
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
      initialChartState={modifiedResponsiveSunburstChartState}
      parentChartAction={responsiveSunburstChartAction}
      parentChartDispatch={responsiveSunburstChartDispatch}
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
        initialChartState={modifiedResponsiveSunburstChartState}
        input={displayResetAllButton}
        label="Reset all values"
        value=""
      />
    </Stack>
  );

  const sunburstControlsStack = (
    <Flex direction="column" w="100%">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayChartArcLabel}
      {displayMotionSection}
      {displayChartOptions}
      {displayResetAll}
    </Flex>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={sunburstControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayResponsiveSunburst}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsiveSunburstChart };
