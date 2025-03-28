import { Group, Stack, Title, TitleOrder } from "@mantine/core";
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
    // <Stack w="100%">
    //   <Title order={2}>Chart Controls</Title>
    //   <Group h="38%">{chartControlsStack}</Group>
    //   <Group
    //     w="100%"
    //     ref={chartRef}
    //     position="center"
    //     py="xl"
    //     style={{
    //       // width: "clamp(350px, 100%, 618px)",
    //       height: "clamp(250px, 400px, 500px)",
    //     }}
    //   >
    //     <Group w="100%" position={chartTitlePosition} px="xl">
    //       <Title order={chartTitleSize} color={chartTitleColor}>
    //         {chartTitle}
    //       </Title>
    //     </Group>
    //     {responsiveChart}
    //   </Group>
    // </Stack>
    <div className="chart-and-controls">
      <div className="chart-controls">
        <Title order={2}>Chart Controls</Title>
        {chartControlsStack}
      </div>

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
