import { ColorInput, Group, Stack, Text, Title } from "@mantine/core";

import type { SetPageInErrorPayload } from "../../../types";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { SLIDER_TOOLTIP_COLOR, STICKY_STYLE } from "../constants";
import { NIVO_SUNBURST_ARC_LABEL_DATA } from "../responsiveSunburstChart/constants";
import type { NivoArcLabel } from "../types";
import { ChartsAndGraphsControlsStacker } from "../utils";

type ChartArcLabelAction = {
  setArcLabel: "setArcLabel";
  setArcLabelsRadiusOffset: "setArcLabelsRadiusOffset";
  setArcLabelsSkipAngle: "setArcLabelsSkipAngle";
  setArcLabelsTextColor: "setArcLabelsTextColor";
  setEnableArcLabels: "setEnableArcLabels";
  setPageInError: "setPageInError";
};

type ChartArcLabelDispatch =
  | {
    action: ChartArcLabelAction["setArcLabel"];
    payload: NivoArcLabel;
  }
  | {
    action:
      | ChartArcLabelAction["setArcLabelsRadiusOffset"]
      | ChartArcLabelAction["setArcLabelsSkipAngle"];

    payload: number;
  }
  | {
    action: ChartArcLabelAction["setArcLabelsTextColor"];
    payload: string;
  }
  | {
    action: ChartArcLabelAction["setEnableArcLabels"];
    payload: boolean;
  }
  | {
    action: ChartArcLabelAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

type ChartArcLabelProps = {
  arcLabel: NivoArcLabel; // default: 'formattedValue'
  arcLabelsRadiusOffset: number; // 0 - 2 default: 0.5 step: 0.05
  arcLabelsSkipAngle: number; // 0 - 45 default: 0 step: 1
  arcLabelsTextColor: string; // default: 'gray'
  borderColor: string;
  enableArcLabels: boolean; // default: false
  initialChartState: Record<string, any>;
  parentChartAction: ChartArcLabelAction;
  parentChartDispatch: React.Dispatch<ChartArcLabelDispatch>;
  sectionHeadersBgColor: string;
  textColor: string;
  width: number;
};

function ChartArcLabel(props: ChartArcLabelProps) {
  const {
    arcLabel,
    arcLabelsRadiusOffset,
    arcLabelsSkipAngle,
    arcLabelsTextColor,
    borderColor,
    enableArcLabels,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
    sectionHeadersBgColor,
    textColor,
    width,
  } = props;

  const enableArcLabelsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableArcLabels,
        invalidValueAction: parentChartAction.setPageInError,
        name: "enableArcLabels",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableArcLabels,
        value: enableArcLabels,
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

  const arcLabelsSkipAngleSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} °</Text>
        ),
        max: 45,
        min: 0,
        name: "arcLabelsSkipAngle",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setArcLabelsSkipAngle,
        value: arcLabelsSkipAngle,
      }}
    />
  );

  const arcLabelsTextColorInput = (
    <ColorInput
      aria-label="arc labels text color"
      color={arcLabelsTextColor}
      disabled={!enableArcLabels}
      onChange={(color: string) => {
        parentChartDispatch({
          action: parentChartAction.setArcLabelsTextColor,
          payload: color,
        });
      }}
      value={arcLabelsTextColor}
      w={width}
    />
  );

  const displayArcLabelsHeading = (
    <Group
      bg={sectionHeadersBgColor}
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Arc Labels
      </Title>
    </Group>
  );

  const displayEnableArcLabelsSwitchInput = (
    <Group w="100%" style={{ borderBottom: borderColor }}>
      {enableArcLabelsSwitchInput}
    </Group>
  );

  const displayArcLabelSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={arcLabelSelectInput}
      isInputDisabled={!enableArcLabels}
      label="Arc Label"
      value={arcLabel}
    />
  );

  const displayArcLabelsRadiusOffsetSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={arcLabelsRadiusOffsetSliderInput}
      isInputDisabled={!enableArcLabels}
      label="Arc Labels Radius Offset"
      value={arcLabelsRadiusOffset}
    />
  );

  const displayArcLabelsSkipAngleSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={arcLabelsSkipAngleSliderInput}
      isInputDisabled={!enableArcLabels}
      label="Arc Labels Skip Angle"
      symbol="°"
      value={arcLabelsSkipAngle}
    />
  );

  const displayArcLabelsTextColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={arcLabelsTextColorInput}
      isInputDisabled={!enableArcLabels}
      label="Arc Labels Text Color"
      value={arcLabelsTextColor}
    />
  );

  const displayArcLabelsSection = (
    <Stack w="100%">
      {displayArcLabelsHeading}
      {displayEnableArcLabelsSwitchInput}
      {displayArcLabelSelectInput}
      {displayArcLabelsRadiusOffsetSliderInput}
      {displayArcLabelsSkipAngleSliderInput}
      {displayArcLabelsTextColorInput}
    </Stack>
  );

  return displayArcLabelsSection;
}

export { ChartArcLabel };
