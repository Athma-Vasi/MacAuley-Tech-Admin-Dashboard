import { Group, Stack, Text, Title } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { SetPageInErrorPayload, StepperPage } from "../../../types";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { AccessibleTextInput } from "../../accessibleInputs/text/AccessibleTextInput";
import { SLIDER_TOOLTIP_COLOR, STICKY_STYLE } from "../constants";
import { BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA } from "../responsiveBarChart/constants";
import type { NivoAxisLegendPosition } from "../types";
import { ChartsAndGraphsControlsStacker } from "../utils";

type ChartAxisAction = {
  setAxisLeftLegend: "setAxisLeftLegend";
  setAxisLeftLegendOffset: "setAxisLeftLegendOffset";
  setAxisLeftLegendPosition: "setAxisLeftLegendPosition";
  setAxisLeftTickPadding: "setAxisLeftTickPadding";
  setAxisLeftTickRotation: "setAxisLeftTickRotation";
  setAxisLeftTickSize: "setAxisLeftTickSize";
  setEnableAxisLeft: "setEnableAxisLeft";
  setPageInError: "setPageInError";
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
    action: ChartAxisAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

type ChartAxisLeftProps = {
  axisLeftLegend: string; // default: ''
  axisLeftLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisLeftLegendPosition: NivoAxisLegendPosition; // default: middle
  axisLeftTickPadding: number; // 0px - 20px default: 5 step: 1
  axisLeftTickRotation: number; // -90° - 90° default: 0 step: 1
  axisLeftTickSize: number; // 0px - 20px default: 5 step: 1
  borderColor: string;
  enableAxisLeft: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
  sectionHeadersBgColor: string;
  stepperPages: StepperPage[];
  textColor: string;
  width: number;
};

function ChartAxisLeft(props: ChartAxisLeftProps) {
  const {
    axisLeftLegend,
    axisLeftLegendOffset,
    axisLeftLegendPosition,
    axisLeftTickPadding,
    axisLeftTickRotation,
    axisLeftTickSize,
    borderColor,
    enableAxisLeft,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
    sectionHeadersBgColor,
    stepperPages,
    textColor,
    width,
  } = props;

  const enableAxisLeftSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisLeft,
        invalidValueAction: parentChartAction.setPageInError,
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
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentChartAction.setPageInError,
        name: "axisLeftLegend",
        parentDispatch: parentChartDispatch,
        stepperPages,
        validValueAction: parentChartAction.setAxisLeftLegend,
        value: axisLeftLegend,
      }}
    />
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
      bg={sectionHeadersBgColor}
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Axis Left
      </Title>
    </Group>
  );

  const displayToggleAxisLeftSwitchInput = (
    <Group w="100%" style={{ borderLeft: borderColor }}>
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
      value={axisLeftLegend}
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
      {displayToggleAxisLeftSwitchInput}
      {displayAxisLeftTickSizeSliderInput}
      {displayAxisLeftTickPaddingSliderInput}
      {displayAxisLeftTickRotationSliderInput}
      {displayAxisLeftLegendTextInput}
      {displayAxisLeftLegendOffsetSliderInput}
      {displayAxisLeftLegendPositionSelectInput}
    </Stack>
  );

  return displayAxisLeftSection;
}

export { ChartAxisLeft };
