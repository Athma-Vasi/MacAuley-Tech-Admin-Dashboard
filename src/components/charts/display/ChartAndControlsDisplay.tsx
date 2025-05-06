import { Box, Card, Group, Stack, Title, TitleOrder } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
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
  const navigate = useNavigate();
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

  const backButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Go back",
        kind: "previous",
        label: "Back",
        onClick: () => {
          navigate(-1);
        },
      }}
    />
  );

  return (
    <Box className="chart-controls-container" pos="relative">
      <Card bg={bgGradient} className="controls-container" shadow="xs" px={0}>
        <Title order={2} pl="md" py="xs">Chart Controls</Title>
        {chartControlsStack}
      </Card>

      <Group w="100%" position="right" pr="xl" pt="md">
        {backButton}
      </Group>

      <Box
        className="chart-container"
        ref={chartRef}
      >
        <Stack w="100%" align={chartTitlePosition}>
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
