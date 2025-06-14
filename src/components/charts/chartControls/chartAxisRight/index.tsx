import { Flex, Group, Stack, Text, Title } from "@mantine/core";
import { COLORS_SWATCHES } from "../../../../constants";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../../utils";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../../accessibleInputs/AccessibleSwitchInput";
import { AccessibleTextInput } from "../../../accessibleInputs/AccessibleTextInput";
import {
  CHART_CONTROLS_TEXT_INPUT_HEIGHT,
  SLIDER_TOOLTIP_COLOR,
} from "../../constants";
import ChartsAndGraphsControlsStacker from "../../display/ChartsAndControlsStacker";
import { NIVO_BAR_AXIS_LEGEND_POSITION_DATA } from "../../responsiveBarChart/constants";
import { NivoAxisLegendPosition } from "../../types";
import { createChartHeaderStyles } from "../../utils";

type ChartAxisAction = {
  setAxisRightLegend: "setAxisRightLegend";
  setAxisRightLegendOffset: "setAxisRightLegendOffset";
  setAxisRightLegendPosition: "setAxisRightLegendPosition";
  setAxisRightTickPadding: "setAxisRightTickPadding";
  setAxisRightTickRotation: "setAxisRightTickRotation";
  setAxisRightTickSize: "setAxisRightTickSize";
  setEnableAxisRight: "setEnableAxisRight";
  setIsError: "setIsError";
};

type ChartAxisDispatch =
  | {
    action: ChartAxisAction["setEnableAxisRight"];
    payload: boolean;
  }
  | {
    action:
      | ChartAxisAction["setAxisRightTickSize"]
      | ChartAxisAction["setAxisRightTickPadding"]
      | ChartAxisAction["setAxisRightTickRotation"]
      | ChartAxisAction["setAxisRightLegendOffset"];
    payload: number;
  }
  | {
    action: ChartAxisAction["setAxisRightLegend"];
    payload: string;
  }
  | {
    action: ChartAxisAction["setAxisRightLegendPosition"];
    payload: NivoAxisLegendPosition;
  }
  | {
    action: ChartAxisAction["setIsError"];
    payload: boolean;
  };

type ChartAxisRightProps = {
  axisRightLegend: string; // default: ''
  axisRightLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisRightLegendPosition: NivoAxisLegendPosition; // default: middle
  axisRightTickPadding: number; // 0px - 20px default: 5 step: 1
  axisRightTickRotation: number; // -90° - 90° default: 0 step: 1
  axisRightTickSize: number; // 0px - 20px default: 5 step: 1
  enableAxisRight: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
};

function ChartAxisRight(props: ChartAxisRightProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    axisRightLegend,
    axisRightLegendOffset,
    axisRightLegendPosition,
    axisRightTickPadding,
    axisRightTickRotation,
    axisRightTickSize,
    enableAxisRight,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const enableAxisRightSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisRight,
        name: "enableAxisRight",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableAxisRight,
        value: enableAxisRight.toString(),
      }}
    />
  );

  const axisRightTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisRight,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisRightTickSize",
        parentDispatch: parentChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickSize,
        value: axisRightTickSize,
      }}
    />
  );

  const axisRightTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisRight,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisRightTickPadding",
        parentDispatch: parentChartDispatch,
        defaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickPadding,
        value: axisRightTickPadding,
      }}
    />
  );

  const axisRightTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisRight,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "axisRightTickRotation",
        parentDispatch: parentChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickRotation,
        value: axisRightTickRotation,
      }}
    />
  );

  const axisRightLegendTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
      align={"flex-end"}
      w="100%"
    >
      <Group w="100%" position="left" p="md">
        <Text>{axisRightLegend}</Text>
      </Group>
      <AccessibleTextInput
        attributes={{
          disabled: !enableAxisRight,
          hideLabel: true,
          invalidValueAction: parentChartAction.setIsError,
          name: "axisRightLegend",
          parentDispatch: parentChartDispatch,
          placeholder: "Axis right legend",
          validValueAction: parentChartAction.setAxisRightLegend,
          value: axisRightLegend,
        }}
      />
    </Flex>
  );

  const axisRightLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableAxisRight || !axisRightLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 90,
        min: -90,
        name: "axisRightLegendOffset",
        parentDispatch: parentChartDispatch,
        defaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisRightLegendOffset,
        value: axisRightLegendOffset,
      }}
    />
  );

  const axisRightLegendPositionSelectInput = (
    <AccessibleSelectInput<
      ChartAxisAction["setAxisRightLegendPosition"],
      NivoAxisLegendPosition
    >
      attributes={{
        data: NIVO_BAR_AXIS_LEGEND_POSITION_DATA,
        description: "Define the position of the right axis legend",
        disabled: !enableAxisRight || !axisRightLegend,
        hideLabel: true,
        name: "axisRightLegendPosition",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setAxisRightLegendPosition,
        value: axisRightLegendPosition,
      }}
    />
  );

  const displayAxisRightHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5}>
        Axis Right
      </Title>
    </Group>
  );

  const displayToggleAxisRightSwitchInput = (
    <Group w="100%">
      {enableAxisRightSwitchInput}
    </Group>
  );

  const displayAxisRightTickSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightTickSizeSliderInput}
      isInputDisabled={!enableAxisRight}
      label="Axis right tick size"
      symbol="px"
      value={axisRightTickSize}
    />
  );

  const displayAxisRightTickPaddingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightTickPaddingSliderInput}
      isInputDisabled={!enableAxisRight}
      label="Axis right tick padding"
      symbol="px"
      value={axisRightTickPadding}
    />
  );

  const displayAxisRightTickRotationSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightTickRotationSliderInput}
      isInputDisabled={!enableAxisRight}
      label="Axis right tick rotation"
      symbol="°"
      value={axisRightTickRotation}
    />
  );

  const displayAxisRightLegendTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightLegendTextInput}
      isInputDisabled={!enableAxisRight}
      label="Axis right legend"
      value=""
    />
  );

  const displayAxisRightLegendOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightLegendOffsetSliderInput}
      isInputDisabled={!enableAxisRight || !axisRightLegend}
      label="Axis right legend offset"
      symbol="px"
      value={axisRightLegendOffset}
    />
  );

  const displayAxisRightLegendPositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={axisRightLegendPositionSelectInput}
      isInputDisabled={!enableAxisRight || !axisRightLegend}
      label="Axis right legend position"
      value={axisRightLegendPosition}
    />
  );

  const displayAxisRightSection = (
    <Stack w="100%">
      {displayAxisRightHeading}
      <Group w="100%" align="baseline" px="md">
        {displayToggleAxisRightSwitchInput}
        {displayAxisRightTickSizeSliderInput}
        {displayAxisRightTickPaddingSliderInput}
        {displayAxisRightTickRotationSliderInput}
        {displayAxisRightLegendTextInput}
        {displayAxisRightLegendOffsetSliderInput}
        {displayAxisRightLegendPositionSelectInput}
      </Group>
    </Stack>
  );

  return displayAxisRightSection;
}

export { ChartAxisRight };
