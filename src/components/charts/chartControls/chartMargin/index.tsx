import { Group, Stack, Text, Title } from "@mantine/core";
import { COLORS_SWATCHES } from "../../../../constants";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../../utils";
import { AccessibleSliderInput } from "../../../accessibleInputs/AccessibleSliderInput";
import { SLIDER_TOOLTIP_COLOR } from "../../constants";
import ChartsAndGraphsControlsStacker from "../../display/ChartsAndControlsStacker";
import { createChartHeaderStyles } from "../../utils";

type ChartMarginAction = {
  setMarginTop: "setMarginTop";
  setMarginRight: "setMarginRight";
  setMarginBottom: "setMarginBottom";
  setMarginLeft: "setMarginLeft";
};

type ChartMarginDispatch = {
  action:
    | ChartMarginAction["setMarginTop"]
    | ChartMarginAction["setMarginRight"]
    | ChartMarginAction["setMarginBottom"]
    | ChartMarginAction["setMarginLeft"];

  payload: number;
};

type ChartMarginProps = {
  initialChartState: Record<string, any>;
  marginBottom: number; // 0px - 200px default: 60 step: 1
  marginLeft: number; // 0px - 200px default: 60 step: 1
  marginRight: number; // 0px - 200px default: 60 step: 1
  marginTop: number; // 0px - 200px default: 60 step: 1
  parentChartAction: ChartMarginAction;
  parentChartDispatch: React.Dispatch<ChartMarginDispatch>;
};

function ChartMargin(props: ChartMarginProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    initialChartState,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    parentChartAction,
    parentChartDispatch,
  } = props;

  const marginTopSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "margin-top",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 60,
        step: 1,
        validValueAction: parentChartAction.setMarginTop,
        value: marginTop,
      }}
    />
  );

  const marginRightSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "margin-right",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 60,
        step: 1,
        validValueAction: parentChartAction.setMarginRight,
        value: marginRight,
      }}
    />
  );

  const marginBottomSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "margin-bottom",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 60,
        step: 1,
        validValueAction: parentChartAction.setMarginBottom,
        value: marginBottom,
      }}
    />
  );

  const marginLeftSliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "margin-left",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 60,
        step: 1,
        validValueAction: parentChartAction.setMarginLeft,
        value: marginLeft,
      }}
    />
  );

  const displayMarginHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5}>
        Margin
      </Title>
    </Group>
  );

  const displayMarginTopSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={marginTopSliderInput}
      label="Margin top"
      symbol="px"
      value={marginTop}
    />
  );

  const displayMarginRightSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={marginRightSliderInput}
      label="Margin right"
      symbol="px"
      value={marginRight}
    />
  );

  const displayMarginBottomSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={marginBottomSliderInput}
      label="Margin bottom"
      symbol="px"
      value={marginBottom}
    />
  );

  const displayMarginLeftSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={marginLeftSliderInput}
      label="Margin left"
      symbol="px"
      value={marginLeft}
    />
  );

  const displayMarginSection = (
    <Stack w="100%">
      {displayMarginHeading}
      <Group w="100%" align="baseline" px="md">
        {displayMarginTopSliderInput}
        {displayMarginRightSliderInput}
        {displayMarginBottomSliderInput}
        {displayMarginLeftSliderInput}
      </Group>
    </Stack>
  );

  return displayMarginSection;
}

export { ChartMargin };
