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
  setAxisLeftLegend: "setAxisLeftLegend";
  setAxisLeftLegendOffset: "setAxisLeftLegendOffset";
  setAxisLeftLegendPosition: "setAxisLeftLegendPosition";
  setAxisLeftTickPadding: "setAxisLeftTickPadding";
  setAxisLeftTickRotation: "setAxisLeftTickRotation";
  setAxisLeftTickSize: "setAxisLeftTickSize";
  setEnableAxisLeft: "setEnableAxisLeft";
  setIsError: "setIsError";
};

type ChartAxisDispatch =
  | {
    action: ChartAxisAction["setEnableAxisLeft"];
    payload: boolean;
  }
  | {
    action:
      | ChartAxisAction["setAxisLeftTickSize"]
      | ChartAxisAction["setAxisLeftTickPadding"]
      | ChartAxisAction["setAxisLeftTickRotation"]
      | ChartAxisAction["setAxisLeftLegendOffset"];
    payload: number;
  }
  | {
    action: ChartAxisAction["setAxisLeftLegend"];
    payload: string;
  }
  | {
    action: ChartAxisAction["setAxisLeftLegendPosition"];
    payload: NivoAxisLegendPosition;
  }
  | {
    action: ChartAxisAction["setIsError"];
    payload: boolean;
  };

type ChartAxisLeftProps = {
  axisLeftLegend: string; // default: ''
  axisLeftLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisLeftLegendPosition: NivoAxisLegendPosition; // default: middle
  axisLeftTickPadding: number; // 0px - 20px default: 5 step: 1
  axisLeftTickRotation: number; // -90° - 90° default: 0 step: 1
  axisLeftTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisLeft: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
};

function ChartAxisLeft(props: ChartAxisLeftProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    axisLeftLegend,
    axisLeftLegendOffset,
    axisLeftLegendPosition,
    axisLeftTickPadding,
    axisLeftTickRotation,
    axisLeftTickSize,
    enableAxisLeft,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const enableAxisLeftSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisLeft,
        invalidValueAction: parentChartAction.setIsError,
        name: "enableAxisLeft",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableAxisLeft,
        value: enableAxisLeft,
      }}
    />
  );

  const axisLeftTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisLeftTickSize",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisLeftTickSize,
        value: axisLeftTickSize,
      }}
    />
  );

  const axisLeftTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisLeftTickPadding",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisLeftTickPadding,
        value: axisLeftTickPadding,
      }}
    />
  );

  const axisLeftTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "axisLeftTickRotation",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisLeftTickRotation,
        value: axisLeftTickRotation,
      }}
    />
  );

  const axisLeftLegendTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
    >
      <Text pt="xl">{axisLeftLegend}</Text>
      <AccessibleTextInput
        attributes={{
          invalidValueAction: parentChartAction.setIsError,
          name: "axisLeftLegend",
          parentDispatch: parentChartDispatch,
          validValueAction: parentChartAction.setAxisLeftLegend,
          value: axisLeftLegend,
        }}
      />
    </Flex>
  );

  const axisLeftLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 90,
        min: -90,
        name: "axisLeftLegendOffset",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisLeftLegendOffset,
        value: axisLeftLegendOffset,
      }}
    />
  );

  const axisLeftLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA,
        description: "Define the position of the left axis legend",
        disabled: !enableAxisLeft || !axisLeftLegend,
        name: "axisLeftLegendPosition",
        onChange: (event: ChangeEvent<HTMLSelectElement>) => {
          parentChartDispatch({
            action: parentChartAction.setAxisLeftLegendPosition,
            payload: event.currentTarget.value as NivoAxisLegendPosition,
          });
        },
        validValueAction: parentChartAction.setAxisLeftLegendPosition,
        value: axisLeftLegendPosition,
      }}
    />
  );

  const displayAxisLeftHeading = (
    <Group
      style={createChartHeaderStyles(backgroundColor)}
      w="100%"
    >
      <Title order={5}>
        Axis Left
      </Title>
    </Group>
  );

  const displayToggleAxisLeftSwitchInput = (
    <Group w="100%">
      {enableAxisLeftSwitchInput}
    </Group>
  );

  const displayAxisLeftTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftTickSizeSliderInput}
      isInputDisabled={!enableAxisLeft}
      label="Axis left tick size"
      symbol="px"
      value={axisLeftTickSize}
    />
  );

  const displayAxisLeftTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftTickPaddingSliderInput}
      isInputDisabled={!enableAxisLeft}
      label="Axis left tick padding"
      symbol="px"
      value={axisLeftTickPadding}
    />
  );

  const displayAxisLeftTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftTickRotationSliderInput}
      isInputDisabled={!enableAxisLeft}
      label="Axis left tick rotation"
      symbol="°"
      value={axisLeftTickRotation}
    />
  );

  const displayAxisLeftLegendTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftLegendTextInput}
      isInputDisabled={!enableAxisLeft}
      label="Axis left legend"
      value=""
    />
  );

  const displayAxisLeftLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftLegendOffsetSliderInput}
      isInputDisabled={!enableAxisLeft || !axisLeftLegend}
      label="Axis left legend offset"
      symbol="px"
      value={axisLeftLegendOffset}
    />
  );

  const displayAxisLeftLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisLeftLegendPositionSelectInput}
      isInputDisabled={!enableAxisLeft || !axisLeftLegend}
      label="Axis left legend position"
      value={axisLeftLegendPosition}
    />
  );

  const displayAxisLeftSection = (
    <Stack w="100%">
      {displayAxisLeftHeading}
      <Group w="100%" align="baseline">
        {displayToggleAxisLeftSwitchInput}
        {displayAxisLeftTickSizeSliderInput}
        {displayAxisLeftTickPaddingSliderInput}
        {displayAxisLeftTickRotationSliderInput}
        {displayAxisLeftLegendTextInput}
        {displayAxisLeftLegendOffsetSliderInput}
        {displayAxisLeftLegendPositionSelectInput}
      </Group>
    </Stack>
  );

  return displayAxisLeftSection;
}

export { ChartAxisLeft };
