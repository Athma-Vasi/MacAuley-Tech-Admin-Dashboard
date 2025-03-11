import { ColorInput, Group, Stack, Text, Title } from "@mantine/core";

import type { SetPageInErrorPayload } from "../../../types";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../accessibleInputs/AccessibleSliderInput";
import { AccessibleSwitchInput } from "../../accessibleInputs/AccessibleSwitchInput";
import {
  NIVO_LEGEND_ANCHOR_DATA,
  NIVO_LEGEND_DIRECTION_DATA,
  NIVO_LEGEND_ITEM_DIRECTION_DATA,
  NIVO_LEGEND_SYMBOL_SHAPE_DATA,
  SLIDER_TOOLTIP_COLOR,
  STICKY_STYLE,
} from "../constants";
import type {
  NivoLegendAnchor,
  NivoLegendDirection,
  NivoLegendItemDirection,
  NivoLegendSymbolShape,
} from "../types";
import { ChartsAndGraphsControlsStacker } from "../utils";

type ChartLegendAction = {
  setEnableLegend: "setEnableLegend";
  setEnableLegendJustify: "setEnableLegendJustify";
  setLegendAnchor: "setLegendAnchor";
  setLegendDirection: "setLegendDirection";
  setLegendItemBackground: "setLegendItemBackground";
  setLegendItemDirection: "setLegendItemDirection";
  setLegendItemHeight: "setLegendItemHeight";
  setLegendItemOpacity: "setLegendItemOpacity";
  setLegendItemTextColor: "setLegendItemTextColor";
  setLegendItemWidth: "setLegendItemWidth";
  setLegendItemsSpacing: "setLegendItemsSpacing";
  setLegendSymbolBorderColor: "setLegendSymbolBorderColor";
  setLegendSymbolBorderWidth: "setLegendSymbolBorderWidth";
  setLegendSymbolShape: "setLegendSymbolShape";
  setLegendSymbolSize: "setLegendSymbolSize";
  setLegendSymbolSpacing: "setLegendSymbolSpacing";
  setLegendTranslateX: "setLegendTranslateX";
  setLegendTranslateY: "setLegendTranslateY";
  setPageInError: "setPageInError";
};

type ChartLegendDispatch =
  | {
    action:
      | ChartLegendAction["setEnableLegend"]
      | ChartLegendAction["setEnableLegendJustify"];

    payload: boolean;
  }
  | {
    action:
      | ChartLegendAction["setLegendItemBackground"]
      | ChartLegendAction["setLegendItemTextColor"]
      | ChartLegendAction["setLegendSymbolBorderColor"];

    payload: string;
  }
  | {
    action:
      | ChartLegendAction["setLegendItemHeight"]
      | ChartLegendAction["setLegendItemOpacity"]
      | ChartLegendAction["setLegendItemWidth"]
      | ChartLegendAction["setLegendItemsSpacing"]
      | ChartLegendAction["setLegendSymbolBorderWidth"]
      | ChartLegendAction["setLegendSymbolSize"]
      | ChartLegendAction["setLegendSymbolSpacing"]
      | ChartLegendAction["setLegendTranslateX"]
      | ChartLegendAction["setLegendTranslateY"];

    payload: number;
  }
  | {
    action: ChartLegendAction["setLegendAnchor"];
    payload: NivoLegendAnchor;
  }
  | {
    action: ChartLegendAction["setLegendDirection"];
    payload: NivoLegendDirection;
  }
  | {
    action: ChartLegendAction["setLegendItemDirection"];
    payload: NivoLegendItemDirection;
  }
  | {
    action: ChartLegendAction["setLegendSymbolShape"];
    payload: NivoLegendSymbolShape;
  }
  | {
    action: ChartLegendAction["setPageInError"];
    payload: SetPageInErrorPayload;
  };

type ChartLegendProps = {
  borderColor: string;
  enableLegend: boolean; // default: false
  enableLegendJustify: boolean; // default: false
  grayColorShade: string;
  initialChartState: Record<string, any>;
  legendAnchor: NivoLegendAnchor; // default: bottom-right
  legendDirection: NivoLegendDirection; // default: column
  legendItemBackground: string; // default: 'rgba(255, 255, 255, 0)'
  legendItemDirection: NivoLegendItemDirection; // default: left-to-right
  legendItemHeight: number; // 10px - 200px default: 20 step: 1
  legendItemOpacity: number; // 0 - 1 default: 1 step: 0.05
  legendItemTextColor: string; // default: '#FFF'
  legendItemWidth: number; // 10px - 200px default: 60 step: 1
  legendItemsSpacing: number; // 0px - 60px default: 2 step: 1
  legendSymbolBorderColor: string; // default: '#FFF'
  legendSymbolBorderWidth: number; // 0px - 10px default: 1 step: 1
  legendSymbolShape: NivoLegendSymbolShape; // default: circle
  legendSymbolSize: number; // 2px - 60px default: 12 step: 1
  legendSymbolSpacing: number; // 0px - 60px default: 8 step: 1
  legendTranslateX: number; // -200px - 200px default: 0 step: 1
  legendTranslateY: number; // -200px - 200px default: 0 step: 1
  parentChartAction: ChartLegendAction;
  parentChartDispatch: React.Dispatch<ChartLegendDispatch>;
  sectionHeadersBgColor: string;
  textColor: string;
  width: number;
};

function ChartLegend(props: ChartLegendProps) {
  const {
    borderColor,
    enableLegend,
    enableLegendJustify,
    grayColorShade,
    initialChartState,
    legendAnchor,
    legendDirection,
    legendItemBackground,
    legendItemDirection,
    legendItemHeight,
    legendItemOpacity,
    legendItemTextColor,
    legendItemWidth,
    legendItemsSpacing,
    legendSymbolBorderColor,
    legendSymbolBorderWidth,
    legendSymbolShape,
    legendSymbolSize,
    legendSymbolSpacing,
    legendTranslateX,
    legendTranslateY,
    parentChartAction,
    parentChartDispatch,
    sectionHeadersBgColor,
    textColor,
    width,
  } = props;

  /**
   * const enableArcLabelsSwitchInput = (
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
   */

  const enableLegendSwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableLegend,
        invalidValueAction: parentChartAction.setPageInError,
        name: "enableLegend",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableLegend,
        value: enableLegend,
      }}
    />
  );

  const legendAnchorSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LEGEND_ANCHOR_DATA,
        description: "Define legend anchor",
        disabled: !enableLegend,
        name: "legendAnchor",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setLegendAnchor,
        value: legendAnchor,
      }}
    />
  );

  const legendDirectionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LEGEND_DIRECTION_DATA,
        description: "Define legend direction",
        disabled: !enableLegend,
        name: "legendDirection",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setLegendDirection,
        value: legendDirection,
      }}
    />
  );

  const legendItemBackgroundColorInput = (
    <ColorInput
      aria-label="Legend item background color"
      color={legendItemBackground}
      disabled={!enableLegend}
      onChange={(color: string) => {
        parentChartDispatch({
          action: parentChartAction.setLegendItemBackground,
          payload: color,
        });
      }}
      value={legendItemBackground}
    />
  );

  const legendItemTextColorInput = (
    <ColorInput
      aria-label="Legend item text color"
      color={legendItemTextColor}
      disabled={!enableLegend}
      onChange={(color: string) => {
        parentChartDispatch({
          action: parentChartAction.setLegendItemTextColor,
          payload: color,
        });
      }}
      value={legendItemTextColor}
    />
  );

  const enableLegendJustifySwitchInput = (
    <AccessibleSwitchInput
      attributes={{
        checked: enableLegendJustify,
        invalidValueAction: parentChartAction.setPageInError,
        name: "enableLegendJustify",
        offLabel: "Off",
        onLabel: "On",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setEnableLegendJustify,
        value: enableLegendJustify,
      }}
    />
  );

  const legendTranslateXSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: -200,
        name: "legendTranslateX",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setLegendTranslateX,
        value: legendTranslateX,
      }}
    />
  );

  const legendTranslateYSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: -200,
        name: "legendTranslateY",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 0,
        step: 1,
        validValueAction: parentChartAction.setLegendTranslateY,
        value: legendTranslateY,
      }}
    />
  );

  const legendItemWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "legendItemWidth",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 100,
        step: 1,
        validValueAction: parentChartAction.setLegendItemWidth,
        value: legendItemWidth,
      }}
    />
  );

  const legendItemHeightSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "legendItemHeight",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 12,
        step: 1,
        validValueAction: parentChartAction.setLegendItemHeight,
        value: legendItemHeight,
      }}
    />
  );

  const legendItemsSpacingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 200,
        min: 0,
        name: "legendItemsSpacing",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 10,
        step: 1,
        validValueAction: parentChartAction.setLegendItemsSpacing,
        value: legendItemsSpacing,
      }}
    />
  );

  const legendItemDirectionSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LEGEND_ITEM_DIRECTION_DATA,
        description: "Define legend item direction.",
        disabled: !enableLegend,
        name: "legendItemDirection",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setLegendItemDirection,
        value: legendItemDirection,
      }}
    />
  );

  const legendItemOpacitySliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 1,
        min: 0,
        name: "legendItemOpacity",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 1,
        step: 0.1,
        validValueAction: parentChartAction.setLegendItemOpacity,
        value: legendItemOpacity,
      }}
    />
  );

  const legendSymbolSizeSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 60,
        min: 2,
        name: "legendSymbolSize",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 12,
        step: 1,
        validValueAction: parentChartAction.setLegendSymbolSize,
        value: legendSymbolSize,
      }}
    />
  );

  const legendSymbolBorderColorInput = (
    <ColorInput
      aria-label="Legend symbol border color"
      color={legendSymbolBorderColor}
      disabled={!enableLegend}
      onChange={(color: string) => {
        parentChartDispatch({
          action: parentChartAction.setLegendSymbolBorderColor,
          payload: color,
        });
      }}
      value={legendSymbolBorderColor}
    />
  );

  const legendSymbolBorderWidthSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 10,
        min: 0,
        name: "legendSymbolBorderWidth",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 1,
        step: 1,
        validValueAction: parentChartAction.setLegendSymbolBorderWidth,
        value: legendSymbolBorderWidth,
      }}
    />
  );

  const legendSymbolShapeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: NIVO_LEGEND_SYMBOL_SHAPE_DATA,
        description: "Define legend symbol shape.",
        disabled: !enableLegend,
        name: "legendSymbolShape",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setLegendSymbolShape,
        value: legendSymbolShape,
      }}
    />
  );

  const legendSymbolSpacingSliderInput = (
    <AccessibleSliderInput
      attributes={{
        disabled: !enableLegend,
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 60,
        min: 0,
        name: "legendSymbolSpacing",
        parentDispatch: parentChartDispatch,
        sliderDefaultValue: 8,
        step: 1,
        validValueAction: parentChartAction.setLegendSymbolSpacing,
        value: legendSymbolSpacing,
      }}
    />
  );

  const displayLegendHeading = (
    <Group
      bg={sectionHeadersBgColor}
      style={STICKY_STYLE}
      w="100%"
    >
      <Title order={5} color={textColor}>
        Legend
      </Title>
    </Group>
  );

  const displayToggleLegendSwitchInput = (
    <Group w="100%" style={{ borderBottom: borderColor }}>
      {enableLegendSwitchInput}
    </Group>
  );

  const displayLegendAnchorSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendAnchorSelectInput}
      isInputDisabled={!enableLegend}
      label="Legend anchor"
      // prevents display of camelCased or snake_cased value
      value={NIVO_LEGEND_ANCHOR_DATA.find(({ value }) => value === legendAnchor)
        ?.label ?? legendAnchor}
    />
  );

  const displayLegendDirectionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendDirectionSelectInput}
      isInputDisabled={!enableLegend}
      label="Legend direction"
      value={legendDirection}
    />
  );

  const displayToggleLegendJustifySwitchInput = (
    <Group w="100%" style={{ borderBottom: borderColor }}>
      {enableLegendJustifySwitchInput}
    </Group>
  );

  const displayLegendTranslateXSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendTranslateXSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend translate X"
      symbol="px"
      value={legendTranslateX}
    />
  );

  const displayLegendTranslateYSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendTranslateYSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend translate Y"
      symbol="px"
      value={legendTranslateY}
    />
  );

  const displayLegendItemWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemWidthSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend item width"
      symbol="px"
      value={legendItemWidth}
    />
  );

  const displayLegendItemHeightSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemHeightSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend item height"
      symbol="px"
      value={legendItemHeight}
    />
  );

  const displayLegendItemsSpacingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemsSpacingSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend items spacing"
      symbol="px"
      value={legendItemsSpacing}
    />
  );

  const displayLegendItemDirectionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemDirectionSelectInput}
      isInputDisabled={!enableLegend}
      label="Legend item direction"
      // prevents display of camelCased or snake_cased value
      value={NIVO_LEGEND_ITEM_DIRECTION_DATA.find(
        ({ value }) => value === legendItemDirection,
      )?.label ?? legendItemDirection}
    />
  );

  const displayLegendItemOpacitySliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemOpacitySliderInput}
      isInputDisabled={!enableLegend}
      label="Legend item opacity"
      value={legendItemOpacity}
    />
  );

  const displayLegendItemBackgroundColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemBackgroundColorInput}
      isInputDisabled={!enableLegend}
      label="Legend item background"
      value={legendItemBackground}
    />
  );

  const displayLegendItemTextColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendItemTextColorInput}
      isInputDisabled={!enableLegend}
      label="Legend item text color"
      value={legendItemTextColor}
    />
  );

  const displayLegendSymbolSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendSymbolSizeSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend symbol size"
      symbol="px"
      value={legendSymbolSize}
    />
  );

  const displayLegendSymbolBorderColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendSymbolBorderColorInput}
      isInputDisabled={!enableLegend}
      label="Legend symbol border color"
      value={legendSymbolBorderColor}
    />
  );

  const displayLegendSymbolBorderWidthSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendSymbolBorderWidthSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend symbol border width"
      symbol="px"
      value={legendSymbolBorderWidth}
    />
  );

  const displayLegendSymbolShapeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendSymbolShapeSelectInput}
      isInputDisabled={!enableLegend}
      label="Legend symbol shape"
      // prevents display of camelCased or snake_cased value
      value={NIVO_LEGEND_SYMBOL_SHAPE_DATA.find(
        ({ value }) => value === legendSymbolShape,
      )?.label ?? legendSymbolShape}
    />
  );

  const displayLegendSymbolSpacingSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={legendSymbolSpacingSliderInput}
      isInputDisabled={!enableLegend}
      label="Legend symbol spacing"
      symbol="px"
      value={legendSymbolSpacing}
    />
  );

  const displayLegendSection = (
    <Stack w="100%">
      {displayLegendHeading}
      {displayToggleLegendSwitchInput}
      {displayLegendAnchorSelectInput}
      {displayLegendDirectionSelectInput}
      {displayToggleLegendJustifySwitchInput}
      {displayLegendTranslateXSliderInput}
      {displayLegendTranslateYSliderInput}
      {displayLegendItemWidthSliderInput}
      {displayLegendItemHeightSliderInput}
      {displayLegendItemsSpacingSliderInput}
      {displayLegendItemBackgroundColorInput}
      {displayLegendItemTextColorInput}
      {displayLegendItemDirectionSelectInput}
      {displayLegendItemOpacitySliderInput}
      {displayLegendSymbolSizeSliderInput}
      {displayLegendSymbolBorderColorInput}
      {displayLegendSymbolBorderWidthSliderInput}
      {displayLegendSymbolShapeSelectInput}
      {displayLegendSymbolSpacingSliderInput}
    </Stack>
  );

  return displayLegendSection;
}

export { ChartLegend };
