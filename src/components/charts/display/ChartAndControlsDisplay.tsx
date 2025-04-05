import { Card, Group, Stack, Title, TitleOrder } from "@mantine/core";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { NivoChartTitlePosition } from "../types";

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
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

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

  return (
    <div className="chart-and-controls">
      <Card
        shadow="md"
        className="chart-controls"
        style={{ background: bgGradient, borderRadius: "0px 0px 0.5em 0.5em" }}
        px={0}
      >
        <Title order={2}>Chart Controls</Title>
        {chartControlsStack}
      </Card>

      <Group
        className="chart-container"
        ref={chartRef}
      >
        <Stack w="100%" align={chartTitlePosition} px="xl">
          <Title order={chartTitleSize} color={chartTitleColor}>
            {chartTitle}
          </Title>
        </Stack>
        <div className="chart-display">{responsiveChart}</div>
      </Group>
    </div>
  );
}

export default ChartAndControlsDisplay;
