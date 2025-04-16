import {
  Box,
  ColorInput,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ResponsiveCalendar } from "@nivo/calendar";
import { useEffect, useReducer, useRef } from "react";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { ChartMargin } from "../chartControls/ChartMargin";
import { ChartOptions } from "../chartControls/ChartOptions";
import { SLIDER_TOOLTIP_COLOR } from "../constants";
import ChartAndControlsDisplay from "../display/ChartAndControlsDisplay";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { createChartHeaderStyles } from "../utils";
import { responsiveCalendarChartAction } from "./actions";
import {
  NIVO_CALENDAR_ALIGN_DATA,
  NIVO_CALENDAR_CHART_COLORS,
  NIVO_CALENDAR_DIRECTION_DATA,
  NIVO_CALENDAR_LEGEND_POSITION_DATA,
} from "./constants";
import { responsiveCalendarChartReducer } from "./reducers";
import { initialResponsiveCalendarChartState } from "./state";
import type {
  ResponsiveCalendarChartProps,
  ResponsiveCalendarChartState,
} from "./types";

function ResponsiveCalendarChart({
  calendarChartData,
  dashboardChartTitle,
  from,
  to,
  hideControls = false,
  tooltip,
}: ResponsiveCalendarChartProps) {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { windowWidth } = useWindowSize();

  const { grayColorShade, textColor, scrollBarStyle, bgGradient } =
    returnThemeColors({
      themeObject,
      colorsSwatches: COLORS_SWATCHES,
    });

  useEffect(() => {
    // sets initial colors based on app theme
    const modifiedResponsiveCalendarChartState: ResponsiveCalendarChartState = {
      ...initialResponsiveCalendarChartState,
      chartTitle: dashboardChartTitle ?? "Calendar Chart",
      emptyColor: grayColorShade,
      monthBorderColor: textColor,
      chartTitleColor: textColor,
      dayBorderColor: textColor,
    };

    responsiveCalendarChartDispatch({
      action: responsiveCalendarChartAction.resetChartToDefault,
      payload: modifiedResponsiveCalendarChartState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeObject]);

  useEffect(() => {
    const newCalendarDirection = windowWidth < 775 ? "vertical" : "horizontal";

    responsiveCalendarChartDispatch({
      action: responsiveCalendarChartAction.setCalendarDirection,
      payload: newCalendarDirection,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  const stateWithChartTitle: ResponsiveCalendarChartState = {
    ...initialResponsiveCalendarChartState,
    chartTitle: dashboardChartTitle ?? "Calendar Chart",
  };
  const [responsiveCalendarChartState, responsiveCalendarChartDispatch] =
    useReducer(
      responsiveCalendarChartReducer,
      stateWithChartTitle,
    );

  const chartRef = useRef(null);

  const {
    // base
    calendarDirection, // default: 'horizontal'
    calendarAlign, // default: 'center'

    // margin
    marginTop, // 0px - 200px default: 60 step: 1
    marginRight, // 0px - 200px default: 60 step: 1
    marginBottom, // 0px - 200px default: 60 step: 1
    marginLeft, // 0px - 200px default: 60 step: 1

    // style
    emptyColor, // default: '#fff'
    enableDefaultColors, // default: true

    // years
    yearSpacing, // 0px - 160px default: 30 step: 1
    yearLegendPosition, // default: 'before'
    yearLegendOffset, // 0px - 60px default: 10

    // months
    monthSpacing, // 0px - 160px default: 0 step: 1
    monthBorderWidth, // 0px - 20px default: 2 step: 1
    monthBorderColor, // default: '#000'
    monthLegendPosition, // default: 'before'
    monthLegendOffset, // 0px - 36px default: 10

    // days
    daySpacing, // 0px - 20px default: 0 step: 1
    dayBorderWidth, // 0px - 20px default: 1 step: 1
    dayBorderColor, // default: '#000'

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
  } = responsiveCalendarChartState;

  const { primaryColor } = themeObject;
  const colorsArray = Object.entries(COLORS_SWATCHES).find(
    ([key, _value]) => key === primaryColor,
  )?.[1];

  const displayCalendarChart = (
    <ResponsiveCalendar
      data={calendarChartData}
      from={from}
      to={to}
      // base
      direction={calendarDirection}
      align={calendarAlign}
      minValue="auto"
      maxValue="auto"
      // margin
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      // style
      emptyColor="#eeeeee"
      colors={enableDefaultColors ? NIVO_CALENDAR_CHART_COLORS : colorsArray}
      // years
      yearSpacing={yearSpacing}
      yearLegendPosition={yearLegendPosition}
      yearLegendOffset={yearLegendOffset}
      // months
      monthSpacing={monthSpacing}
      monthBorderWidth={monthBorderWidth}
      monthBorderColor={monthBorderColor}
      monthLegendPosition={monthLegendPosition}
      monthLegendOffset={monthLegendOffset}
      // days
      daySpacing={daySpacing}
      dayBorderWidth={dayBorderWidth}
      dayBorderColor={dayBorderColor}
      // interactivity
      isInteractive={true}
      tooltip={tooltip}
    />
  );

  if (hideControls) {
    return (
      <Box className="chart">
        {displayCalendarChart}
      </Box>
    );
  }

  // base
  const calendarDirectionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_CALENDAR_DIRECTION_DATA,
        description: "Define calendar direction",
        hideLabel: true,
        name: "calendarDirection",
        validValueAction: responsiveCalendarChartAction.setCalendarDirection,
        value: calendarDirection,
      }}
    />
  );

  const calendarAlignSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_CALENDAR_ALIGN_DATA,
        description: "Define calendar align",
        hideLabel: true,
        name: "calendarAlign",
        validValueAction: responsiveCalendarChartAction.setCalendarAlign,
        value: calendarAlign,
      }}
    />
  );

  // style
  const emptyColorInput = (
    <ColorInput
      aria-label="empty color"
      color={emptyColor}
      onChange={(color: string) => {
        responsiveCalendarChartDispatch({
          action: responsiveCalendarChartAction.setEmptyColor,
          payload: color,
        });
      }}
      value={emptyColor}
      w={INPUT_WIDTH}
    />
  );

  const enableDefaultColorsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableDefaultColors,
        name: "enableDefaultColors",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: responsiveCalendarChartDispatch,
        validValueAction: responsiveCalendarChartAction.setEnableDefaultColors,
        value: enableDefaultColors,
      }}
    />
  );

  // years
  const yearSpacingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 160,
        min: 0,
        name: "yearSpacing",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 30,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setYearSpacing,
        value: yearSpacing,
      }}
    />
  );

  const yearLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_CALENDAR_LEGEND_POSITION_DATA,
        description: "Define year legend position",
        hideLabel: true,
        name: "yearLegendPosition",
        validValueAction: responsiveCalendarChartAction.setYearLegendPosition,
        value: yearLegendPosition,
      }}
    />
  );

  const yearLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 60,
        min: 0,
        name: "yearLegendOffset",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 10,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setYearLegendOffset,
        value: yearLegendOffset,
      }}
    />
  );

  // months

  const monthSpacingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 160,
        min: 0,
        name: "monthSpacing",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setMonthSpacing,
        value: monthSpacing,
      }}
    />
  );

  const monthBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "monthBorderWidth",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 2,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setMonthBorderWidth,
        value: monthBorderWidth,
      }}
    />
  );

  const monthBorderColorInput = (
    <ColorInput
      aria-label="month border color"
      color={monthBorderColor}
      onChange={(color: string) => {
        responsiveCalendarChartDispatch({
          action: responsiveCalendarChartAction.setMonthBorderColor,
          payload: color,
        });
      }}
      value={monthBorderColor}
      w={INPUT_WIDTH}
    />
  );

  const monthLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_CALENDAR_LEGEND_POSITION_DATA,
        description: "Define month legend position",
        hideLabel: true,
        name: "monthLegendPosition",
        validValueAction: responsiveCalendarChartAction.setMonthLegendPosition,
        value: monthLegendPosition,
      }}
    />
  );

  const monthLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 36,
        min: 0,
        name: "monthLegendOffset",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 10,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setMonthLegendOffset,
        value: monthLegendOffset,
      }}
    />
  );

  // days

  const daySpacingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "daySpacing",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setDaySpacing,
        value: daySpacing,
      }}
    />
  );

  const dayBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "dayBorderWidth",
        parentDispatch: responsiveCalendarChartDispatch,
        sliderDefaultValue: 1,
        step: 1,
        validValueAction: responsiveCalendarChartAction.setDayBorderWidth,
        value: dayBorderWidth,
      }}
    />
  );

  const dayBorderColorInput = (
    <ColorInput
      aria-label="day border color"
      color={dayBorderColor}
      onChange={(color: string) => {
        responsiveCalendarChartDispatch({
          action: responsiveCalendarChartAction.setDayBorderColor,
          payload: color,
        });
      }}
      value={dayBorderColor}
      w={INPUT_WIDTH}
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
          responsiveCalendarChartDispatch({
            action: responsiveCalendarChartAction.resetChartToDefault,
            payload: initialResponsiveCalendarChartState,
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
      <Title order={4} color={textColor}>
        Base
      </Title>
    </Group>
  );

  const displayCalendarDirectionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={calendarDirectionSelectInput}
      label="Calendar Direction"
      value={calendarDirection}
    />
  );

  const displayCalendarAlignSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={calendarAlignSelectInput}
      label="Calendar Align"
      value={calendarAlign}
    />
  );

  const displayBaseSection = (
    <Stack w="100%">
      {displayBaseHeading}
      <Group w="100%" align="baseline" px="md">
        {displayCalendarDirectionSelectInput}
        {displayCalendarAlignSelectInput}
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
      parentChartAction={responsiveCalendarChartAction}
      parentChartDispatch={responsiveCalendarChartDispatch}
    />
  );

  // style
  const displayStyleHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={4} color={textColor}>
        Style
      </Title>
    </Group>
  );

  const displayEmptyColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={emptyColorInput}
      label="Empty Color"
      value={emptyColor}
    />
  );

  const displayEnableDefaultColorsSwitchInput = (
    <Group w="100%">
      {enableDefaultColorsSwitchInput}
    </Group>
  );

  const displayStyleSection = (
    <Stack w="100%">
      {displayStyleHeading}
      <Group w="100%" align="baseline" px="md">
        {displayEnableDefaultColorsSwitchInput}
        {displayEmptyColorInput}
      </Group>
    </Stack>
  );

  // years
  const displayYearsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={4} color={textColor}>
        Years
      </Title>
    </Group>
  );

  const displayYearSpacingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={yearSpacingSliderInput}
      label="Year Spacing"
      symbol="px"
      value={yearSpacing}
    />
  );

  const displayYearLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={yearLegendPositionSelectInput}
      label="Year Legend Position"
      value={yearLegendPosition}
    />
  );

  const displayYearLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={yearLegendOffsetSliderInput}
      label="Year Legend Offset"
      symbol="px"
      value={yearLegendOffset}
    />
  );

  const displayYearsSection = (
    <Stack w="100%">
      {displayYearsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayYearSpacingSliderInput}
        {displayYearLegendPositionSelectInput}
        {displayYearLegendOffsetSliderInput}
      </Group>
    </Stack>
  );

  // months
  const displayMonthsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={4} color={textColor}>
        Months
      </Title>
    </Group>
  );

  const displayMonthSpacingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={monthSpacingSliderInput}
      label="Month Spacing"
      symbol="px"
      value={monthSpacing}
    />
  );

  const displayMonthBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={monthBorderWidthSliderInput}
      label="Month Border Width"
      symbol="px"
      value={monthBorderWidth}
    />
  );

  const displayMonthBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={monthBorderColorInput}
      label="Month Border Color"
      value={monthBorderColor}
    />
  );

  const displayMonthLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={monthLegendPositionSelectInput}
      label="Month Legend Position"
      value={monthLegendPosition}
    />
  );

  const displayMonthLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={monthLegendOffsetSliderInput}
      label="Month Legend Offset"
      symbol="px"
      value={monthLegendOffset}
    />
  );

  const displayMonthsSection = (
    <Stack w="100%">
      {displayMonthsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayMonthSpacingSliderInput}
        {displayMonthBorderWidthSliderInput}
        {displayMonthBorderColorInput}
        {displayMonthLegendPositionSelectInput}
        {displayMonthLegendOffsetSliderInput}
      </Group>
    </Stack>
  );

  // days
  const displayDaysHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={4} color={textColor}>
        Days
      </Title>
    </Group>
  );

  const displayDaySpacingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={daySpacingSliderInput}
      label="Day Spacing"
      symbol="px"
      value={daySpacing}
    />
  );

  const displayDayBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={dayBorderWidthSliderInput}
      label="Day Border Width"
      symbol="px"
      value={dayBorderWidth}
    />
  );

  const displayDayBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={stateWithChartTitle}
      input={dayBorderColorInput}
      label="Day Border Color"
      value={dayBorderColor}
    />
  );

  const displayDaysSection = (
    <Stack w="100%">
      {displayDaysHeading}
      <Group w="100%" align="baseline" px="md">
        {displayDaySpacingSliderInput}
        {displayDayBorderWidthSliderInput}
        {displayDayBorderColorInput}
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
      parentChartAction={responsiveCalendarChartAction}
      parentChartDispatch={responsiveCalendarChartDispatch}
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

  // display
  const calendarChartControlsStack = (
    <Stack w="100%" spacing="xl">
      {displayBaseSection}
      {displayChartMargin}
      {displayStyleSection}
      {displayYearsSection}
      {displayMonthsSection}
      {displayDaysSection}
      {displayChartOptions}
      {displayResetAll}
    </Stack>
  );

  const displayChartAndControls = (
    <ChartAndControlsDisplay
      chartControlsStack={calendarChartControlsStack}
      chartRef={chartRef}
      chartTitle={chartTitle}
      chartTitleColor={chartTitleColor}
      chartTitlePosition={chartTitlePosition}
      chartTitleSize={chartTitleSize}
      responsiveChart={displayCalendarChart}
      scrollBarStyle={scrollBarStyle}
    />
  );

  return displayChartAndControls;
}

export { ResponsiveCalendarChart };
