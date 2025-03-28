import { Flex, Group, Stack, Text, Title } from "@mantine/core";
import type { ChangeEvent } from "react";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { AccessibleTextInput } from "../../accessibleInputs/text/AccessibleTextInput";
import {
  CHART_CONTROLS_TEXT_INPUT_HEIGHT,
  SLIDER_TOOLTIP_COLOR,
} from "../constants";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA } from "../responsiveBarChart/constants";
import type { NivoAxisLegendPosition } from "../types";
import { createChartHeaderStyles } from "../utils";

type ChartAxisAction = {
  setAxisBottomLegend: "setAxisBottomLegend";
  setAxisBottomLegendOffset: "setAxisBottomLegendOffset";
  setAxisBottomLegendPosition: "setAxisBottomLegendPosition";
  setAxisBottomTickPadding: "setAxisBottomTickPadding";
  setAxisBottomTickRotation: "setAxisBottomTickRotation";
  setAxisBottomTickSize: "setAxisBottomTickSize";
  setEnableAxisBottom: "setEnableAxisBottom";
  setIsError: "setIsError";
};

type ChartAxisDispatch =
  | {
    action: ChartAxisAction["setEnableAxisBottom"];
    payload: boolean;
  }
  | {
    action:
      | ChartAxisAction["setAxisBottomTickSize"]
      | ChartAxisAction["setAxisBottomTickPadding"]
      | ChartAxisAction["setAxisBottomTickRotation"]
      | ChartAxisAction["setAxisBottomLegendOffset"];
    payload: number;
  }
  | {
    action: ChartAxisAction["setAxisBottomLegend"];
    payload: string;
  }
  | {
    action: ChartAxisAction["setAxisBottomLegendPosition"];
    payload: NivoAxisLegendPosition;
  }
  | {
    action: ChartAxisAction["setIsError"];
    payload: boolean;
  };

type ChartAxisBottomProps = {
  axisBottomLegend: string; // default: ''
  axisBottomLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisBottomLegendPosition: NivoAxisLegendPosition; // default: middle
  axisBottomTickPadding: number; // 0px - 20px default: 5 step: 1
  axisBottomTickRotation: number; // -90° - 90° default: 0 step: 1
  axisBottomTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisBottom: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
};

function ChartAxisBottom(props: ChartAxisBottomProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    axisBottomLegend,
    axisBottomLegendOffset,
    axisBottomLegendPosition,
    axisBottomTickPadding,
    axisBottomTickRotation,
    axisBottomTickSize,
    enableAxisBottom,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const enableAxisBottomSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisBottom,
        invalidValueAction: parentChartAction.setIsError,
        name: "enableAxisBottom",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableAxisBottom,
        value: enableAxisBottom,
      }}
    />
  );

  const axisBottomTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisBottomTickSize",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisBottomTickSize,
        value: axisBottomTickSize,
      }}
    />
  );

  const axisBottomTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisBottomTickPadding",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisBottomTickPadding,
        value: axisBottomTickPadding,
      }}
    />
  );

  const axisBottomTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "axisBottomTickRotation",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisBottomTickRotation,
        value: axisBottomTickRotation,
      }}
    />
  );

  const axisBottomLegendTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
    >
      <Text pt="xl">{axisBottomLegend}</Text>
      <AccessibleTextInput
        attributes={{
          invalidValueAction: parentChartAction.setIsError,
          name: "axisBottomLegend",
          parentDispatch: parentChartDispatch,
          validValueAction: parentChartAction.setAxisBottomLegend,
          value: axisBottomLegend,
        }}
      />
    </Flex>
  );

  const axisBottomLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 90,
        min: -90,
        name: "axisBottomLegendOffset",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisBottomLegendOffset,
        value: axisBottomLegendOffset,
      }}
    />
  );

  const axisBottomLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA,
        description: "Define the position of the bottom axis legend",
        disabled: !enableAxisBottom || !axisBottomLegend,
        name: "axisBottomLegendPosition",
        onChange: (event: ChangeEvent<HTMLSelectElement>) => {
          parentChartDispatch({
            action: parentChartAction.setAxisBottomLegendPosition,
            payload: event.currentTarget.value as NivoAxisLegendPosition,
          });
        },
        validValueAction: parentChartAction.setAxisBottomLegendPosition,
        value: axisBottomLegendPosition,
      }}
    />
  );

  const displayAxisBottomHeading = (
    <Group
      style={createChartHeaderStyles(backgroundColor)}
      w="100%"
    >
      <Title order={5}>
        Axis Bottom
      </Title>
    </Group>
  );

  const displayToggleAxisBottomSwitchInput = (
    <Group w="100%">
      {enableAxisBottomSwitchInput}
    </Group>
  );

  const displayAxisBottomTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomTickSizeSliderInput}
      isInputDisabled={!enableAxisBottom}
      label="Axis bottom tick size"
      symbol="px"
      value={axisBottomTickSize}
    />
  );

  const displayAxisBottomTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomTickPaddingSliderInput}
      isInputDisabled={!enableAxisBottom}
      label="Axis bottom tick padding"
      symbol="px"
      value={axisBottomTickPadding}
    />
  );

  const displayAxisBottomTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomTickRotationSliderInput}
      isInputDisabled={!enableAxisBottom}
      label="Axis bottom tick rotation"
      symbol="°"
      value={axisBottomTickRotation}
    />
  );

  const displayAxisBottomLegendTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomLegendTextInput}
      isInputDisabled={!enableAxisBottom}
      label="Axis bottom legend"
      value=""
    />
  );

  const displayAxisBottomLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomLegendOffsetSliderInput}
      isInputDisabled={!enableAxisBottom || !axisBottomLegend}
      label="Axis bottom legend offset"
      symbol="px"
      value={axisBottomLegendOffset}
    />
  );

  const displayAxisBottomLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisBottomLegendPositionSelectInput}
      isInputDisabled={!enableAxisBottom || !axisBottomLegend}
      label="Axis bottom legend position"
      value={axisBottomLegendPosition}
    />
  );

  const displayAxisBottomSection = (
    <Stack w="100%">
      {displayAxisBottomHeading}
      <Group w="100%" align="baseline">
        {displayToggleAxisBottomSwitchInput}
        {displayAxisBottomTickSizeSliderInput}
        {displayAxisBottomTickPaddingSliderInput}
        {displayAxisBottomTickRotationSliderInput}
        {displayAxisBottomLegendTextInput}
        {displayAxisBottomLegendOffsetSliderInput}
        {displayAxisBottomLegendPositionSelectInput}
      </Group>
    </Stack>
  );

  return displayAxisBottomSection;
}

export { ChartAxisBottom };
