import { Group, Stack, Text, Title } from "@mantine/core";
import type { ChangeEvent } from "react";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { AccessibleTextInput } from "../../accessibleInputs/text/AccessibleTextInput";
import { SLIDER_TOOLTIP_COLOR } from "../constants";
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
  const { backgroundColor } = returnThemeColors({
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
        invalidValueAction: parentChartAction.setIsError,
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
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentChartAction.setIsError,
        name: "axisTopLegend",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setAxisTopLegend,
        value: axisTopLegend,
      }}
    />
  );

  const axisTopLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
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
        name: "axisTopLegendPosition",
        onChange: (event: ChangeEvent<HTMLSelectElement>) => {
          parentChartDispatch({
            action: parentChartAction.setAxisTopLegendPosition,
            payload: event.currentTarget.value as NivoAxisLegendPosition,
          });
        },
        validValueAction: parentChartAction.setAxisTopLegendPosition,
        value: axisTopLegendPosition,
      }}
    />
  );

  const displayAxisTopHeading = (
    <Group
      style={createChartHeaderStyles(backgroundColor)}
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
      value={axisTopLegend}
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
      <Group w="100%" align="baseline">
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
