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
    // <Stack
    //   style={{
    //     border: "1px solid",
    //     borderColor: "#ccc",
    //     borderRadius: 4,
    //     padding: "1rem",
    //   }}
    // >
    //   <Group w="100%" position={chartTitlePosition} ref={chartRef}>
    //     <Title order={chartTitleSize} color={chartTitleColor}>
    //       {chartTitle}
    //     </Title>
    //   </Group>
    //   <ScrollArea styles={() => scrollBarStyle} offsetScrollbars>
    //     <Grid columns={1}>
    //       <Grid.Col span={1}>{chartControlsStack}</Grid.Col>
    //     </Grid>
    //   </ScrollArea>
    //   <Group w="100%" h="clamp(250px, 400px, 500px)">{responsiveChart}</Group>
    // </Stack>

    <Stack w="100%">
      {chartControlsStack}
      <Group
        w="100%"
        ref={chartRef}
        position="center"
        py="xl"
        style={{
          // width: "clamp(350px, 100%, 618px)",
          height: "clamp(250px, 400px, 500px)",
        }}
      >
        <Group w="100%" position={chartTitlePosition} px="xl">
          <Title order={chartTitleSize} color={chartTitleColor}>
            {chartTitle}
          </Title>
        </Group>
        {responsiveChart}
      </Group>
    </Stack>
  );
}

export default ChartAndControlsDisplay;
