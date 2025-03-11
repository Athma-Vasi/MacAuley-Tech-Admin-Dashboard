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
  setAxisRightLegend: "setAxisRightLegend";
  setAxisRightLegendOffset: "setAxisRightLegendOffset";
  setAxisRightLegendPosition: "setAxisRightLegendPosition";
  setAxisRightTickPadding: "setAxisRightTickPadding";
  setAxisRightTickRotation: "setAxisRightTickRotation";
  setAxisRightTickSize: "setAxisRightTickSize";
  setEnableAxisRight: "setEnableAxisRight";
  setPageInError: "setPageInError";
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
    action: ChartAxisAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

type ChartAxisRightProps = {
  axisRightLegend: string; // default: ''
  axisRightLegendOffset: number; // -60px - 60px default: 0 step: 1
  axisRightLegendPosition: NivoAxisLegendPosition; // default: middle
  axisRightTickPadding: number; // 0px - 20px default: 5 step: 1
  axisRightTickRotation: number; // -90° - 90° default: 0 step: 1
  axisRightTickSize: number; // 0px - 20px default: 5 step: 1
  borderColor: string;
  enableAxisRight: boolean; // default: false ? null
  initialChartState: Record<string, any>;
  parentChartAction: ChartAxisAction;
  parentChartDispatch: React.Dispatch<ChartAxisDispatch>;
  sectionHeadersBgColor: string;
  stepperPages: StepperPage[];
  textColor: string;
  width: number;
};

function ChartAxisRight(props: ChartAxisRightProps) {
  const {
    axisRightLegend,
    axisRightLegendOffset,
    axisRightLegendPosition,
    axisRightTickPadding,
    axisRightTickRotation,
    axisRightTickSize,
    borderColor,
    enableAxisRight,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
    sectionHeadersBgColor,
    stepperPages,
    textColor,
    width,
  } = props;

  const enableAxisRightSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableAxisRight,
        invalidValueAction: parentChartAction.setPageInError,
        name: "enableAxisRight",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableAxisRight,
        value: enableAxisRight,
      }}
    />
  );

  const axisRightTickSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisRightTickSize",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickSize,
        value: axisRightTickSize,
      }}
    />
  );

  const axisRightTickPaddingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 20,
        min: 0,
        name: "axisRightTickPadding",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 5,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickPadding,
        value: axisRightTickPadding,
      }}
    />
  );

  const axisRightTickRotationSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 90,
        min: -90,
        name: "axisRightTickRotation",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisRightTickRotation,
        value: axisRightTickRotation,
      }}
    />
  );

  const axisRightLegendTextInput = (
    <AccessibleTextInput
      attributes={{
        invalidValueAction: parentChartAction.setPageInError,
        name: "axisRightLegend",
        parentDispatch: parentChartDispatch,
        stepperPages,
        validValueAction: parentChartAction.setAxisRightLegend,
        value: axisRightLegend,
      }}
    />
  );

  const axisRightLegendOffsetSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 90,
        min: -90,
        name: "axisRightLegendOffset",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setAxisRightLegendOffset,
        value: axisRightLegendOffset,
      }}
    />
  );

  const axisRightLegendPositionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: BAR_CHART_AXIS_LEGEND_POSITION_SELECT_DATA,
        description: "Define the position of the right axis legend",
        disabled: !enableAxisRight || !axisRightLegend,
        name: "axisRightLegendPosition",
        onChange: (event: ChangeEvent<HTMLSelectElement>) => {
          parentChartDispatch({
            action: parentChartAction.setAxisRightLegendPosition,
            payload: event.currentTarget.value as NivoAxisLegendPosition,
          });
        },
        validValueAction: parentChartAction.setAxisRightLegendPosition,
        value: axisRightLegendPosition,
      }}
    />
  );

  const displayAxisRightHeading = (
    <Group
      bg={sectionHeadersBgColor}
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Axis Right
      </Title>
    </Group>
  );

  const displayToggleAxisRightSwitchInput = (
    <Group w="100%" style={{ borderRight: borderColor }}>
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
      value={axisRightLegend}
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
      {displayToggleAxisRightSwitchInput}
      {displayAxisRightTickSizeSliderInput}
      {displayAxisRightTickPaddingSliderInput}
      {displayAxisRightTickRotationSliderInput}
      {displayAxisRightLegendTextInput}
      {displayAxisRightLegendOffsetSliderInput}
      {displayAxisRightLegendPositionSelectInput}
    </Stack>
  );

  return displayAxisRightSection;
}

export { ChartAxisRight };
