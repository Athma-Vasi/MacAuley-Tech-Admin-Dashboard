import {
  Divider,
  Grid,
  Group,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
  TitleOrder,
} from "@mantine/core";

import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import {
  returnThemeColors,
  splitCamelCase,
  splitWordIntoUpperCasedSentence,
} from "../../utils";
import { NivoChartTitlePosition } from "./types";

type ChartsAndGraphsControlsStackerProps = {
  initialChartState?: Record<string, any>;
  input: React.JSX.Element;
  isInputDisabled?: boolean;
  label: string;
  symbol?: string;
  value: string | number | boolean;
};

function ChartsAndGraphsControlsStacker({
  initialChartState = {},
  input,
  isInputDisabled = false,
  label,
  symbol = "",
  value,
}: ChartsAndGraphsControlsStackerProps): React.JSX.Element {
  const {
    globalState: { themeObject },
  } = useGlobalState();

  const {
    appThemeColors: { borderColor },
    generalColors: { grayColorShade },
  } = returnThemeColors({
    themeObject,
    colorsSwatches: COLORS_SWATCHES,
  });

  const defaultValue = Object.entries(initialChartState).find(
    ([key]) =>
      splitCamelCase(key).toLowerCase() ===
        splitCamelCase(label).toLowerCase(),
  )?.[1] ?? "";

  const displayDefaultValue = defaultValue === "" ? null : (
    <Text
      weight={300}
      color={isInputDisabled
        ? grayColorShade
        : defaultValue === value
        ? grayColorShade
        : ""}
    >
      Default: {splitWordIntoUpperCasedSentence(
        splitCamelCase(defaultValue.toString()),
      )} {symbol}
    </Text>
  );

  const displayTopSection = (
    <Group w="100%" position="apart">
      <Text weight={500} color={isInputDisabled ? grayColorShade : ""}>
        {splitWordIntoUpperCasedSentence(label)}
      </Text>

      {displayDefaultValue}
    </Group>
  );

  const displayBottomSection = (
    <Stack>
      <Group position="apart">
        <Text
          aria-live="polite"
          color={isInputDisabled ? grayColorShade : ""}
          style={value === "" ? {} : {
            border: borderColor,
            borderRadius: 4,
            padding: "0.5rem 0.75rem",
            width: "fit-content",
          }}
        >
          {splitWordIntoUpperCasedSentence(splitCamelCase(value.toString()))}
          {" "}
          {symbol}
        </Text>
        <Group pb="xs">{input}</Group>
      </Group>
    </Stack>
  );

  return (
    <Stack style={{ borderBottom: borderColor }} py="md">
      {displayTopSection}
      {displayBottomSection}
    </Stack>
  );
}

type ChartAndControlsDisplayProps = {
  chartControlsStack: React.JSX.Element;
  chartRef: React.RefObject<null>;
  chartTitle: string;
  chartTitleColor: string;
  chartTitlePosition: NivoChartTitlePosition;
  chartTitleSize: TitleOrder;
  height?: number;
  responsiveChart: React.JSX.Element;
  scrollBarStyle: Record<string, any>;
};

function ChartAndControlsDisplay(
  props: ChartAndControlsDisplayProps,
): React.JSX.Element {
  const {
    chartControlsStack,
    chartRef,
    chartTitle,
    chartTitleColor,
    chartTitlePosition,
    chartTitleSize,
    responsiveChart,
    scrollBarStyle,
  } = props;

  // const displayChartControls = (
  //   <ScrollArea styles={() => scrollBarStyle} offsetScrollbars>
  //     <Grid columns={1} >
  //       <Grid.Col span={1}>{chartControlsStack}</Grid.Col>
  //     </Grid>
  //   </ScrollArea>
  // );

  // const displayChartTitle = (
  //   <Group w="100%" position={chartTitlePosition}>
  //     <Title order={chartTitleSize} color={chartTitleColor}>
  //       {chartTitle}
  //     </Title>
  //   </Group>
  // );

  // const displayChartAndControls = (
  //   <Grid columns={width < 1192 ? 1 : 15} w="100%" h="70vh">
  //     <Grid.Col span={width < 1192 ? 1 : 5} h={width < 1192 ? "38vh" : "70vh"}>
  //       {displayChartControls}
  //     </Grid.Col>

  //     <Grid.Col span={1}>
  //       {width < 1192 ? <Space h="md" /> : <Space w="md" />}
  //       <Divider
  //         orientation={width < 1192 ? "horizontal" : "vertical"}
  //         size="sm"
  //         w="100%"
  //         h="100%"
  //       />
  //     </Grid.Col>

  //     <Grid.Col span={width < 1192 ? 1 : 9} h="70vh" ref={chartRef} p="xl">
  //       {displayChartTitle}
  //       {responsiveChart}
  //     </Grid.Col>
  //   </Grid>
  // );

  // return displayChartAndControls;

  return (
    <Stack
      style={{
        border: "1px solid",
        borderColor: "#ccc",
        borderRadius: 4,
        padding: "1rem",
      }}
    >
      <Group w="100%" position={chartTitlePosition} ref={chartRef}>
        <Title order={chartTitleSize} color={chartTitleColor}>
          {chartTitle}
        </Title>
      </Group>
      <ScrollArea styles={() => scrollBarStyle} offsetScrollbars>
        <Grid columns={1}>
          <Grid.Col span={1}>{chartControlsStack}</Grid.Col>
        </Grid>
      </ScrollArea>
      {responsiveChart}
    </Stack>
  );
}

export { ChartAndControlsDisplay, ChartsAndGraphsControlsStacker };
