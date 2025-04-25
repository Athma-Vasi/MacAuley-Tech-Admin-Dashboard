import { Flex, Group, Stack, Text, Title } from "@mantine/core";
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
  setAxisTopLegend: "setAxisTopLegend";
  setAxisTopLegendOffset: "setAxisTopLegendOffset";
  setAxisTopLegendPosition: "setAxisTopLegendPosition";
  setAxisTopTickPadding: "setAxisTopTickPadding";
  setAxisTopTickRotation: "setAxisTopTickRotation";
  setAxisTopTickSize: "setAxisTopTickSize";
  setEnableAxisTop: "setEnableAxisTop";
  setIsError: "setIsError";
};

type ChartAxisDispatch =
  | {
    action: ChartAxisAction["setEnableAxisTop"];
    payload: boolean;
  }
  | {
    action:
      | ChartAxisAction["setAxisTopTickSize"]
      | ChartAxisAction["setAxisTopTickPadding"]
      | ChartAxisAction["setAxisTopTickRotation"]
      | ChartAxisAction["setAxisTopLegendOffset"];
    payload: number;
  }
  | {
    action: ChartAxisAction["setAxisTopLegend"];
    payload: string;
  }
  | {
    action: ChartAxisAction["setAxisTopLegendPosition"];
    payload: NivoAxisLegendPosition;
  }
  | {
    action: ChartAxisAction["setIsError"];
    payload: boolean;
  };

type ChartAxisTopProps = {
  axisTopLegend: string; // default: ''
  axisTopLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisTopLegendPosition: NivoAxisLegendPosition; // default: middle
  axisTopTickPadding: number; // 0px - 20px default: 5 step: 1
  axisTopTickRotation: number; // -90° - 90° default: 0 step: 1
  axisTopTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisTop: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
};

function ChartAxisTop(props: ChartAxisTopProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    axisTopLegend,
    axisTopLegendOffset,
    axisTopLegendPosition,
    axisTopTickPadding,
    axisTopTickRotation,
    axisTopTickSize,
    enableAxisTop,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const enableAxisTopSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisTop,
        name: "enableAxisTop",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableAxisTop,
        value: enableAxisTop,
      }}
    />
  );

  const axisTopTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisTop,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisTopTickSize",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisTopTickSize,
        value: axisTopTickSize,
      }}
    />
  );

  const axisTopTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisTop,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisTopTickPadding",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisTopTickPadding,
        value: axisTopTickPadding,
      }}
    />
  );

  const axisTopTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisTop,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "axisTopTickRotation",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisTopTickRotation,
        value: axisTopTickRotation,
      }}
    />
  );

  const axisTopLegendTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
      align={"flex-end"}
      w="100%"
    >
      <Group w="100%" position="left" p="md">
        <Text>{axisTopLegend}</Text>
      </Group>
      <AccessibleTextInput
        attributes={{
          disabled: !enableAxisTop,
          hideLabel: true,
          invalidValueAction: parentChartAction.setIsError,
          name: "axisTopLegend",
          parentDispatch: parentChartDispatch,
          placeholder: "Axis top legend",
          validValueAction: parentChartAction.setAxisTopLegend,
          value: axisTopLegend,
        }}
      />
    </Flex>
  );

  const axisTopLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisTop || !axisTopLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 90,
        min: -90,
        name: "axisTopLegendOffset",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisTopLegendOffset,
        value: axisTopLegendOffset,
      }}
    />
  );

  const axisTopLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA,
        description: "Define the position of the top axis legend",
        disabled: !enableAxisTop || !axisTopLegend,
        hideLabel: true,
        name: "axisTopLegendPosition",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setAxisTopLegendPosition,
        value: axisTopLegendPosition,
      }}
    />
  );

  const displayAxisTopHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5}>
        Axis Top
      </Title>
    </Group>
  );

  const displayToggleAxisTopSwitchInput = (
    <Group w="100%">
      {enableAxisTopSwitchInput}
    </Group>
  );

  const displayAxisTopTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopTickSizeSliderInput}
      isInputDisabled={!enableAxisTop}
      label="Axis top tick size"
      symbol="px"
      value={axisTopTickSize}
    />
  );

  const displayAxisTopTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopTickPaddingSliderInput}
      isInputDisabled={!enableAxisTop}
      label="Axis top tick padding"
      symbol="px"
      value={axisTopTickPadding}
    />
  );

  const displayAxisTopTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopTickRotationSliderInput}
      isInputDisabled={!enableAxisTop}
      label="Axis top tick rotation"
      symbol="°"
      value={axisTopTickRotation}
    />
  );

  const displayAxisTopLegendTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopLegendTextInput}
      isInputDisabled={!enableAxisTop}
      label="Axis top legend"
      value=""
    />
  );

  const displayAxisTopLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopLegendOffsetSliderInput}
      isInputDisabled={!enableAxisTop || !axisTopLegend}
      label="Axis top legend offset"
      symbol="px"
      value={axisTopLegendOffset}
    />
  );

  const displayAxisTopLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisTopLegendPositionSelectInput}
      isInputDisabled={!enableAxisTop || !axisTopLegend}
      label="Axis top legend position"
      value={axisTopLegendPosition}
    />
  );

  const displayAxisTopSection = (
    <Stack w="100%">
      {displayAxisTopHeading}
      <Group w="100%" align="baseline" px="md">
        {displayToggleAxisTopSwitchInput}
        {displayAxisTopTickSizeSliderInput}
        {displayAxisTopTickPaddingSliderInput}
        {displayAxisTopTickRotationSliderInput}
        {displayAxisTopLegendTextInput}
        {displayAxisTopLegendOffsetSliderInput}
        {displayAxisTopLegendPositionSelectInput}
      </Group>
    </Stack>
  );

  return displayAxisTopSection;
}

export { ChartAxisTop };
