import { ColorInput, Group, Stack, Text, Title } from "@mantine/core";

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import { SLIDER_TOOLTIP_COLOR } from "../constants";
import ChartsAndGraphsControlsStacker from "../display/ChartsAndControlsStacker";
import { NIVO_SUNBURST_ARC_LABEL_DATA } from "../responsiveSunburstChart/constants";
import type { NivoArcLabel } from "../types";
import { createChartHeaderStyles } from "../utils";

type ChartArcLabelAction = {
  setArcLabel: "setArcLabel";
  setArcLabelsRadiusOffset: "setArcLabelsRadiusOffset";
  setArcLabelsSkipAngle: "setArcLabelsSkipAngle";
  setArcLabelsTextColor: "setArcLabelsTextColor";
  setEnableArcLabels: "setEnableArcLabels";
  setIsError: "setIsError";
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
    action: ChartArcLabelAction["setIsError"];
    payload: boolean;
  };

type ChartArcLabelProps = {
  arcLabel: NivoArcLabel; // default: 'formattedValue'
  arcLabelsRadiusOffset: number; // 0 - 2 default: 0.5 step: 0.05
  arcLabelsSkipAngle: number; // 0 - 45 default: 0 step: 1
  arcLabelsTextColor: string; // default: 'gray'
  enableArcLabels: boolean; // default: false
  initialChartState: Record<string, any>;
  parentChartAction: ChartArcLabelAction;
  parentChartDispatch: React.Dispatch<ChartArcLabelDispatch>;
};

function ChartArcLabel(props: ChartArcLabelProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    arcLabel,
    arcLabelsRadiusOffset,
    arcLabelsSkipAngle,
    arcLabelsTextColor,
    enableArcLabels,
    initialChartState,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const enableArcLabelsSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableArcLabels,
        invalidValueAction: parentChartAction.setIsError,
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
    />
  );

  const displayArcLabelsHeading = (
    <Group
      style={createChartHeaderStyles(backgroundColor)}
      w="100%"
    >
      <Title order={5}>
        Arc Labels
      </Title>
    </Group>
  );

  const displayEnableArcLabelsSwitchInput = (
    <Group w="100%">
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
      <Group w="100%" align="baseline">
        {displayEnableArcLabelsSwitchInput}
        {displayArcLabelSelectInput}
        {displayArcLabelsRadiusOffsetSliderInput}
        {displayArcLabelsSkipAngleSliderInput}
        {displayArcLabelsTextColorInput}
      </Group>
    </Stack>
  );

  return displayArcLabelsSection;
}

export { ChartArcLabel };
