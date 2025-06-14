import {
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  TitleOrder,
  Tooltip,
} from "@mantine/core";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  COLORS_SWATCHES,
  INPUT_WIDTH,
  SCREENSHOT_IMAGE_TYPE_DATA,
} from "../../../../constants";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { ScreenshotImageType } from "../../../../types";
import { captureScreenshot, returnThemeColors } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import { AccessibleSliderInput } from "../../../accessibleInputs/AccessibleSliderInput";
import { AccessibleTextInput } from "../../../accessibleInputs/AccessibleTextInput";
import {
  CHART_CONTROLS_TEXT_INPUT_HEIGHT,
  NIVO_CHART_TITLE_POSITION_DATA,
  SLIDER_TOOLTIP_COLOR,
} from "../../constants";
import ChartsAndGraphsControlsStacker from "../../display/ChartsAndControlsStacker";
import { NivoChartTitlePosition } from "../../types";
import { createChartHeaderStyles } from "../../utils";

type ChartOptionsAction = {
  setChartTitle: "setChartTitle";
  setChartTitleColor: "setChartTitleColor";
  setChartTitlePosition: "setChartTitlePosition";
  setChartTitleSize: "setChartTitleSize";
  setIsError: "setIsError";
  setScreenshotFilename: "setScreenshotFilename";
  setScreenshotImageQuality: "setScreenshotImageQuality";
  setScreenshotImageType: "setScreenshotImageType";
};

type ChartOptionsDispatch =
  | {
    action:
      | ChartOptionsAction["setChartTitle"]
      | ChartOptionsAction["setChartTitleColor"]
      | ChartOptionsAction["setScreenshotFilename"];

    payload: string;
  }
  | {
    action: ChartOptionsAction["setScreenshotImageQuality"];
    payload: number;
  }
  | {
    action: ChartOptionsAction["setScreenshotImageType"];
    payload: ScreenshotImageType;
  }
  | {
    action: ChartOptionsAction["setChartTitlePosition"];
    payload: NivoChartTitlePosition;
  }
  | {
    action: ChartOptionsAction["setChartTitleSize"];
    payload: TitleOrder;
  }
  | {
    action: ChartOptionsAction["setIsError"];
    payload: boolean;
  };

type ChartOptionsProps = {
  chartRef: React.RefObject<null>;
  chartTitle: string;
  chartTitleColor: string; // default: #ffffff
  chartTitlePosition: NivoChartTitlePosition; // default: center
  chartTitleSize: TitleOrder; // 1 - 6 px default: 3 step: 1
  initialChartState: Record<string, any>;
  isError: boolean;
  parentChartAction: ChartOptionsAction;
  parentChartDispatch: React.Dispatch<ChartOptionsDispatch>;
  screenshotFilename: string;
  screenshotImageQuality: number; // 0 - 1 default: 1 step: 0.05
  screenshotImageType: ScreenshotImageType;
};

function ChartOptions(props: ChartOptionsProps) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    chartRef,
    chartTitle,
    chartTitleColor,
    chartTitlePosition,
    chartTitleSize,
    initialChartState,
    isError,
    parentChartAction,
    parentChartDispatch,
    screenshotFilename,
    screenshotImageQuality,
    screenshotImageType,
  } = props;

  useEffect(() => {
    if (screenshotFilename.length === 0) {
      parentChartDispatch({
        action: parentChartAction.setScreenshotFilename,
        payload: uuidv4(),
      });
    }
  }, [
    parentChartAction.setScreenshotFilename,
    parentChartDispatch,
    screenshotFilename.length,
  ]);

  const chartTitleTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
      align={"flex-end"}
      w="100%"
    >
      <Group w="100%" position="left" p="md">
        <Text>{chartTitle}</Text>
      </Group>
      <AccessibleTextInput
        attributes={{
          hideLabel: true,
          invalidValueAction: parentChartAction.setIsError,
          name: "chartTitle",
          parentDispatch: parentChartDispatch,
          placeholder: "Chart title",
          validValueAction: parentChartAction.setChartTitle,
          value: chartTitle,
        }}
      />
    </Flex>
  );

  const chartTitleColorInput = (
    <ColorInput
      aria-label="Chart title color"
      color={chartTitleColor}
      onChange={(color: string) => {
        parentChartDispatch({
          action: parentChartAction.setChartTitleColor,
          payload: color,
        });
      }}
      value={chartTitleColor}
      w={INPUT_WIDTH}
    />
  );

  const chartTitleSizeSliderInput = (
    <AccessibleSliderInput<
      ChartOptionsAction["setChartTitleSize"],
      TitleOrder
    >
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value} px</Text>
        ),
        max: 6,
        min: 1,
        name: "chartTitleSize",
        parentDispatch: parentChartDispatch,
        defaultValue: 3,
        step: 1,
        validValueAction: parentChartAction.setChartTitleSize,
        value: chartTitleSize,
      }}
    />
  );

  const chartTitlePositionSelectInput = (
    <AccessibleSelectInput<
      ChartOptionsAction["setChartTitlePosition"],
      NivoChartTitlePosition
    >
      attributes={{
        data: NIVO_CHART_TITLE_POSITION_DATA,
        description: "Define chart title position",
        hideLabel: true,
        name: "chartTitlePosition",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setChartTitlePosition,
        value: chartTitlePosition,
      }}
    />
  );

  const screenshotFilenameTextInput = (
    <Flex
      h={CHART_CONTROLS_TEXT_INPUT_HEIGHT}
      direction="column"
      justify="space-between"
      align={"flex-end"}
      w="100%"
    >
      <Group w="100%" position="left" p="md">
        <Text>{screenshotFilename}</Text>
      </Group>
      <AccessibleTextInput
        attributes={{
          hideLabel: true,
          invalidValueAction: parentChartAction.setIsError,
          name: "screenshotFilename",
          parentDispatch: parentChartDispatch,
          placeholder: "Screenshot filename",
          validValueAction: parentChartAction.setScreenshotFilename,
          value: screenshotFilename,
        }}
      />
    </Flex>
  );

  const screenshotImageTypeSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: SCREENSHOT_IMAGE_TYPE_DATA,
        description: "Define screenshot image type.",
        hideLabel: true,
        name: "screenshotImageType",
        parentDispatch: parentChartDispatch,
        validValueAction: parentChartAction.setScreenshotImageType,
        value: screenshotImageType,
      }}
    />
  );

  const screenshotImageQualitySliderInput = (
    <AccessibleSliderInput
      attributes={{
        label: (value) => (
          <Text style={{ color: SLIDER_TOOLTIP_COLOR }}>{value}</Text>
        ),
        max: 1,
        min: 0,
        name: "screenshotImageQuality",
        parentDispatch: parentChartDispatch,
        defaultValue: 1,
        step: 0.1,
        validValueAction: parentChartAction.setScreenshotImageQuality,
        value: screenshotImageQuality,
      }}
    />
  );

  const screenshotDownloadButton = (
    <AccessibleButton
      attributes={{
        disabled: isError,
        kind: "download",
        name: "screenshotDownload",
        onClick: async () => {
          await captureScreenshot({
            chartRef,
            screenshotFilename,
            screenshotImageQuality,
            screenshotImageType,
          });
        },
      }}
    />
  );

  const displayOptionsHeading = (
    <Group
      style={createChartHeaderStyles(bgGradient)}
      w="100%"
    >
      <Title order={5}>
        Options
      </Title>
    </Group>
  );

  const displayChartTitleTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={chartTitleTextInput}
      label="Chart title"
      value=""
    />
  );

  const displayChartTitleColorInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={chartTitleColorInput}
      label="Chart title color"
      value={chartTitleColor}
    />
  );

  const displayChartTitleSizeSliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={chartTitleSizeSliderInput}
      label="Chart title size"
      value={chartTitleSize}
    />
  );

  const displayChartTitlePositionSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={chartTitlePositionSelectInput}
      label="Chart title position"
      value={chartTitlePosition}
    />
  );

  const displayScreenshotFilenameTextInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={screenshotFilenameTextInput}
      label="Screenshot filename"
      value=""
    />
  );

  const displayScreenshotImageTypeSelectInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={screenshotImageTypeSelectInput}
      label="Screenshot image type"
      value={screenshotImageType}
    />
  );

  const displayScreenshotImageQualitySliderInput = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      isInputDisabled={screenshotImageType === "image/png"}
      input={screenshotImageQualitySliderInput}
      label="Screenshot image quality"
      value={screenshotImageQuality}
    />
  );

  const displayDownloadScreenshotButton = (
    <Tooltip label="Download screenshot image">
      <Group>{screenshotDownloadButton}</Group>
    </Tooltip>
  );

  const displayDownloadScreenshot = (
    <ChartsAndGraphsControlsStacker
      initialChartState={initialChartState}
      input={displayDownloadScreenshotButton}
      label="Download screenshot"
      value=""
    />
  );

  const displayOptionsSection = (
    <Stack w="100%">
      {displayOptionsHeading}
      <Group w="100%" align="baseline" px="md">
        {displayChartTitleTextInput}
        {displayChartTitleColorInput}
        {displayChartTitleSizeSliderInput}
        {displayChartTitlePositionSelectInput}
        {displayScreenshotFilenameTextInput}
        {displayScreenshotImageTypeSelectInput}
        {displayScreenshotImageQualitySliderInput}
        {displayDownloadScreenshot}
      </Group>
    </Stack>
  );

  return displayOptionsSection;
}

export { ChartOptions };
