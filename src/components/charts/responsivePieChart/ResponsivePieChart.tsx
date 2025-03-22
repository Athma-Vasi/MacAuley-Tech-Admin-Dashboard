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

import { COLORS_SWATCHES } from "../../../constants";
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
  STICKY_STYLE,
} from "../constants";
// import { ChartsAndGraphsControlsStacker } from "../utils";
import {
  ChartAndControlsDisplay,
  ChartsAndGraphsControlsStacker,
} from "../utils";
import { responsivePieChartAction } from "./actions";
import { responsivePieChartReducer } from "./reducers";
import { initialResponsivePieChartState } from "./state";
import type { ResponsivePieChartProps } from "./types";
import { createPieFillPatterns } from "./utils";

function ResponsivePieChart({
  dashboardChartTitle,
  hideControls = false,
  pieChartData,
  unitKind = "currency",
}: ResponsivePieChartProps) {
  const {
    globalState: { themeObject, isPrefersReducedMotion },
  } = useGlobalState();

  const {
    textColor,
    grayColorShade,
    scrollBarStyle,
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  // ensures appropriate colors based on color scheme
  const modifiedInitialResponsivePieChartState = {
    ...initialResponsivePieChartState,
    chartTitle: dashboardChartTitle ?? "Pie Chart",
    arcLabelsTextColor: textColor,
    arcLinkLabelsTextColor: textColor,
    chartTitleColor: textColor,
  };

  const [responsivePieChartState, responsivePieChartDispatch] = useReducer(
    responsivePieChartReducer,
    modifiedInitialResponsivePieChartState,
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
      valueFormat={(value) =>
        `${unitKind === "currency" ? "$" : ""}${addCommaSeparator(value)}${
          unitKind === "percent" ? "%" : ""
        }`}
    />
  );

  if (hideControls) {
    return (
      <Group h={300} w={300} style={{ outline: "1px solid brown" }}>
        {displayResponsivePie}
      </Group>
    );
  }
  /**
 * const enableArcLinkLabelsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableArcLinkLabels,
        invalidValueAction: parentChartAction.setPageInError,
        name: "enableArcLinkLabels",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableArcLabels,
        value: enableArcLinkLabels,
      }}
    />
  );

  const arcLabelSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_SUNBURST_ARC_LABEL_DATA,
        description: "Define arc label",
        name: "arcLabel",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setArcLabel,
        value: arcLabel,
      }}
    />
  );

  const arcLabelsRadiusOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 2,
        min: 0,
        name: "arcLabelsRadiusOffset",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0.5,
        step: 0.05,
        validValueAction: parentChartAction.setArcLabelsRadiusOffset,
        value: arcLabelsRadiusOffset,
      }}
    />
  );
 */

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
        invalidValueAction: responsivePieChartAction.setPageInError,
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
    />
  );

  const enableFillPatternsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableFillPatterns,
        invalidValueAction: responsivePieChartAction.setPageInError,
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
        invalidValueAction: responsivePieChartAction.setPageInError,
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
        invalidValueAction: responsivePieChartAction.setPageInError,
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
            payload: modifiedInitialResponsivePieChartState,
          });
        },
      }}
    />
  );

  /** base */

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

  const displayStartAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={startAngleSliderInput}
      label="Start angle"
      symbol="°"
      value={startAngle}
    />
  );

  const displayEndAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={endAngleSliderInput}
      label="End angle"
      symbol="°"
      value={endAngle}
    />
  );

  const displayInnerRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={innerRadiusSliderInput}
      label="Inner radius"
      symbol="px"
      value={innerRadius}
    />
  );

  const displayPadAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={padAngleSliderInput}
      label="Pad angle"
      symbol="°"
      value={padAngle}
    />
  );

  const displayCornerRadiusSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
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
      {displayStartAngleSliderInput}
      {displayEndAngleSliderInput}
      {displayInnerRadiusSliderInput}
      {displayPadAngleSliderInput}
      {displayCornerRadiusSliderInput}
      {displaySortByValueSwitchInput}
    </Stack>
  );

  /** style */
  const displayStyleHeading = (
    <Group
      w="100%"
      style={STICKY_STYLE}
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
      initialChartState={modifiedInitialResponsivePieChartState}
      input={colorSchemeSelectInput}
      label="Chart colors"
      // prevents display of camelCased or snake_cased value
      value={NIVO_COLOR_SCHEME_DATA.find(({ value }) => value === colorScheme)
        ?.label ?? colorScheme}
    />
  );

  const displayBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={borderColorInput}
      label="Arc Border color"
      value={arcBorderColor}
    />
  );

  const displayArcBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={chartBorderWidthSliderInput}
      label="Arc border width"
      symbol="px"
      value={arcBorderWidth}
    />
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      {displayEnableFillPatternsSwitchInput}
      {displayColorSchemeSelectInput}
      {displayBorderColorInput}
      {displayArcBorderWidthSliderInput}
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
      initialChartState={modifiedInitialResponsivePieChartState}
      parentChartAction={responsivePieChartAction}
      parentChartDispatch={responsivePieChartDispatch}
    />
  );

  /** arc link labels */
  const displayArcLinkLabelsHeading = (
    <Group
      style={STICKY_STYLE}
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
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsSkipAngleSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels skip angle"
      symbol="°"
      value={arcLinkLabelsSkipAngle}
    />
  );

  const displayArcLinkLabelsOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsOffsetSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels offset"
      symbol="px"
      value={arcLinkLabelsOffset}
    />
  );

  const displayArcLinkLabelsDiagonalLengthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsDiagonalLengthSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels diagonal length"
      symbol="px"
      value={arcLinkLabelsDiagonalLength}
    />
  );

  const displayArcLinkLabelsStraightLengthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsStraightLengthSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels straight length"
      symbol="px"
      value={arcLinkLabelsStraightLength}
    />
  );

  const displayArcLinkLabelsHeadingOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsTextOffsetSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels text offset"
      symbol="px"
      value={arcLinkLabelsTextOffset}
    />
  );

  const displayArcLinkLabelsThicknessSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsThicknessSliderInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels thickness"
      symbol="px"
      value={arcLinkLabelsThickness}
    />
  );

  const displayArcLinkLabelsHeadingColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={arcLinkLabelsTextColorInput}
      isInputDisabled={!enableArcLinkLabels}
      label="Arc link labels text color"
      value={arcLinkLabelsTextColor}
    />
  );

  const displayArcLinkLabelsSection = (
    <Stack w="100%">
      {displayArcLinkLabelsHeading}
      {displayEnableArcLinkLabelsSwitchInput}
      {displayArcLinkLabelsSkipAngleSliderInput}
      {displayArcLinkLabelsOffsetSliderInput}
      {displayArcLinkLabelsDiagonalLengthSliderInput}
      {displayArcLinkLabelsStraightLengthSliderInput}
      {displayArcLinkLabelsHeadingOffsetSliderInput}
      {displayArcLinkLabelsThicknessSliderInput}
      {displayArcLinkLabelsHeadingColorInput}
    </Stack>
  );

  /** interactivity */
  const displayInteractivityHeading = (
    <Group
      w="100%"
      style={STICKY_STYLE}
    >
      <Title order={5} color={textColor}>
        Interactivity
      </Title>
    </Group>
  );

  const displayActiveInnerRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={activeInnerRadiusOffsetSliderInput}
      label="Active inner radius offset"
      value={activeInnerRadiusOffset}
      symbol="px"
    />
  );

  const displayActiveOuterRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={activeOuterRadiusOffsetSliderInput}
      label="Active outer radius offset"
      value={activeOuterRadiusOffset}
      symbol="px"
    />
  );

  const displayInteractivitySection = (
    <Stack w="100%">
      {displayInteractivityHeading}
      {displayActiveInnerRadiusOffsetSliderInput}
      {displayActiveOuterRadiusOffsetSliderInput}
    </Stack>
  );

  /** motion */
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

  const displayAnimateMotionSwitchInput = (
    <Group w="100%" style={{ borderBottom: arcBorderColor }}>
      {enableAnimateSwitchInput}
    </Group>
  );

  const displayMotionConfigSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={motionConfigSelectInput}
      isInputDisabled={!enableAnimate}
      label="Motion config"
      value={motionConfig}
    />
  );

  const displayTransitionModeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={modifiedInitialResponsivePieChartState}
      input={transitionModeSelectInput}
      isInputDisabled={!enableAnimate}
      label="Transition mode"
      value={transitionMode}
    />
  );

  const displayMotionSection = (
    <Stack w="100%">
      {displayMotionHeading}
      {displayAnimateMotionSwitchInput}
      {displayMotionConfigSelectInput}
      {displayTransitionModeSelectInput}
    </Stack>
  );

  /** margin */
  const displayChartMargin = (
    <ChartMargin
      initialChartState={modifiedInitialResponsivePieChartState}
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
      initialChartState={modifiedInitialResponsivePieChartState}
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
      initialChartState={modifiedInitialResponsivePieChartState}
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
    <Stack w="100%">
      <ChartsAndGraphsControlsStacker
        initialChartState={modifiedInitialResponsivePieChartState}
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
