import { Box, Card, Stack, Title, TitleOrder } from "@mantine/core";
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
    <Box className="chart-controls-container">
      <Card bg={bgGradient} className="controls-container" shadow="md" px={0}>
        <Title order={2} pl="md">Chart Controls</Title>
        {chartControlsStack}
      </Card>

      <Box
        className="chart-container"
        ref={chartRef}
      >
        <Stack w="100%" align={chartTitlePosition} p="xl">
          <Title order={chartTitleSize} color={chartTitleColor}>
            {chartTitle}
          </Title>
        </Stack>
        {responsiveChart}
      </Box>
    </Box>
  );
}

export default ChartAndControlsDisplay;
