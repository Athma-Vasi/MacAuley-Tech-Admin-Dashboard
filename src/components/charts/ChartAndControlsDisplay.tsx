import {
  Grid,
  Group,
  ScrollArea,
  Stack,
  Title,
  TitleOrder,
} from "@mantine/core";
import { NivoChartTitlePosition } from "./types";

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

export default ChartAndControlsDisplay;
