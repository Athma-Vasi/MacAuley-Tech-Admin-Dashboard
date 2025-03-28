import {
  Accordion,
  Center,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

import { addCommaSeparator, splitCamelCase } from "../../utils";
import type { StatisticsObject } from "./utils";
import { type DashboardCardInfo, returnDashboardCardElement } from "./utilsTSX";

type DashboardMetricsLayoutProps<MetricObjKey extends string = string> = {
  barChart: React.JSX.Element;
  barChartHeading: string;
  barChartYAxisSelectInput?: React.JSX.Element;
  calendarChart?: React.JSX.Element;
  calendarChartHeading?: string;
  calendarChartYAxisSelectInput?: React.JSX.Element;
  expandBarChartButton: React.JSX.Element;
  expandCalendarChartButton?: React.JSX.Element;
  expandLineChartButton: React.JSX.Element;
  expandPieChartButton?: React.JSX.Element;
  isMoney?: boolean;
  lineChart: React.JSX.Element;
  lineChartHeading: string;
  lineChartYAxisSelectInput?: React.JSX.Element;
  overviewCards: DashboardCardInfo[];
  pieChart?: React.JSX.Element;
  pieChartHeading?: string;
  pieChartYAxisSelectInput?: React.JSX.Element;
  sectionHeading: string;
  semanticLabel?: string;
  statisticsMap?: Map<MetricObjKey, StatisticsObject>;
};

function DashboardMetricsLayout({
  barChart,
  barChartHeading,
  barChartYAxisSelectInput,
  calendarChart,
  calendarChartHeading,
  calendarChartYAxisSelectInput,
  expandBarChartButton,
  expandCalendarChartButton,
  expandLineChartButton,
  expandPieChartButton,
  isMoney = false,
  lineChart,
  lineChartHeading,
  lineChartYAxisSelectInput,
  overviewCards,
  pieChart,
  pieChartHeading,
  pieChartYAxisSelectInput,
  sectionHeading,
  semanticLabel = "customers",
  statisticsMap,
}: DashboardMetricsLayoutProps) {
  const cardWidth = 350;

  const displayHeading = (
    <Divider
      variant="dashed"
      labelPosition="left"
      size="md"
      label={<Title order={3}>{sectionHeading}</Title>}
    />
  );

  // info cards section
  const createdCards = overviewCards.map((overviewCard, idx) => (
    <Group key={`${idx}-${overviewCard.value}`} w={cardWidth}>
      {returnDashboardCardElement(overviewCard)}
    </Group>
  ));

  const displayCards = (
    <Stack>
      <Title order={4}>Summary</Title>
      <Group w="100%">
        {createdCards}
      </Group>
    </Stack>
  );

  // bar chart section

  const expandBarChartButtonWithTooltip = (
    <Tooltip label="Expand and Customize Bar Chart">
      <Group>{expandBarChartButton}</Group>
    </Tooltip>
  );

  const barChartSection = (
    <Stack align="center">
      <Title order={4}>Bar Chart</Title>
      <Group w="100%" position="center" align="flex-end">
        {barChartYAxisSelectInput
          ? <Group w={200}>{barChartYAxisSelectInput}</Group>
          : null}
        {expandBarChartButtonWithTooltip}
      </Group>
      <Group w="100%" position="center">
        <Text size="lg" weight={500}>
          {barChartHeading}
        </Text>
      </Group>
      <Group w="100%" position="center">
        {barChart}
      </Group>
    </Stack>
  );

  // calendar chart section

  const expandCalendarChartButtonWithTooltip = (
    <Tooltip label="Expand and Customize Calendar Chart">
      <Group>{expandCalendarChartButton}</Group>
    </Tooltip>
  );

  const calendarChartSection = calendarChart
    ? (
      <Stack align="center">
        <Title order={4}>Calendar Chart</Title>
        <Group w="100%" position="center" align="flex-end">
          <Group w={200}>{calendarChartYAxisSelectInput}</Group>
          {expandCalendarChartButtonWithTooltip}
        </Group>
        <Group w="100%" position="center">
          <Text size="lg" weight={500}>
            {calendarChartHeading}
          </Text>
        </Group>
        <Group w="100%" position="center">
          {calendarChart}
        </Group>
      </Stack>
    )
    : null;

  // line chart section

  const expandLineChartButtonWithTooltip = (
    <Tooltip label="Expand and Customize Line Chart">
      <Group>{expandLineChartButton}</Group>
    </Tooltip>
  );

  const lineChartSection = (
    <Stack align="center">
      <Title order={4}>Line Chart</Title>
      <Group w="100%" position="center" align="flex-end">
        {lineChartYAxisSelectInput
          ? <Group w={200}>{lineChartYAxisSelectInput}</Group>
          : null}
        {expandLineChartButtonWithTooltip}
      </Group>
      <Group w="100%" position="center">
        <Text size="lg" weight={500}>
          {lineChartHeading}
        </Text>
      </Group>
      <Group w="100%" position="center">
        {lineChart}
      </Group>
    </Stack>
  );

  // pie chart section

  const expandPieChartButtonWithTooltip = (
    <Tooltip label="Expand and Customize Pie Chart">
      <Group>{expandPieChartButton}</Group>
    </Tooltip>
  );

  const pieChartHeadingSection = pieChartYAxisSelectInput
    ? (
      <Flex direction="column">
        <Group w="100%" position="apart">
          <Group w={200}>{pieChartYAxisSelectInput}</Group>
          {expandPieChartButtonWithTooltip}
        </Group>
        <Group w="100%" position="center">
          <Text size="lg" weight={500}>
            {pieChartHeading}
          </Text>
        </Group>
      </Flex>
    )
    : (
      <Flex direction="column">
        <Group w="100%" position="apart">
          <Text size="lg" weight={500}>
            {pieChartHeading}
          </Text>
          {expandPieChartButton}
        </Group>
      </Flex>
    );

  const displayPieChartSection = pieChart
    ? (
      <Stack align="center">
        <Title order={4}>Pie Chart</Title>
        {pieChartHeadingSection}
        <Group position="center">{pieChart}</Group>
      </Stack>
    )
    : null;

  // statistics section
  const createdStatisticsAccordions = statisticsMap
    ? Array.from(statisticsMap).map(([key, statisticsObject], idx) => {
      const {
        mean,
        interquartileRange,
        max,
        median,
        min,
        mode,
        standardDeviation,
      } = statisticsObject;

      const unitSymbol =
        isMoney || key === "Revenue" || key === "Average Order Value"
          ? "$"
          : "";

      const statisticsAccordion = (
        <Accordion
          w={350}
          key={`${idx}-${min}-${max}-${median}-${mode}-${mean}-${interquartileRange}-${standardDeviation}`}
        >
          <Accordion.Item value={key}>
            <Accordion.Control>
              <Text weight={500} size="md">
                {`${key} ${
                  splitCamelCase(
                    semanticLabel,
                  )
                }`}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Flex direction="column" rowGap="xs">
                <Text>
                  {`Min: ${unitSymbol} ${
                    addCommaSeparator(
                      min.value.toFixed(2),
                    )
                  }`}
                </Text>
                <Text>{`Occurred: ${min.occurred}`}</Text>

                <Text>
                  {`Max: ${unitSymbol} ${
                    addCommaSeparator(
                      max.value.toFixed(2),
                    )
                  }`}
                </Text>
                <Text>{`Occurred: ${max.occurred}`}</Text>

                <Text>
                  {`Median: ${unitSymbol} ${
                    addCommaSeparator(
                      median.toFixed(2),
                    )
                  }`}
                </Text>

                <Text>
                  {`Mode: ${unitSymbol} ${
                    addCommaSeparator(
                      mode.toFixed(2),
                    )
                  }`}
                </Text>

                <Text>
                  {`Arithmetic Mean: ${unitSymbol} ${
                    addCommaSeparator(
                      mean.toFixed(2),
                    )
                  }`}
                </Text>

                <Text>
                  {`Interquartile Range: ${unitSymbol} ${
                    addCommaSeparator(
                      interquartileRange.toFixed(2),
                    )
                  }`}
                </Text>

                <Text>
                  {`Standard Deviation: ${unitSymbol} ${
                    addCommaSeparator(
                      standardDeviation.toFixed(2),
                    )
                  }`}
                </Text>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      return statisticsAccordion;
    })
    : null;

  const displayStatisticsSection = (
    <Stack w="100%">
      <Group w="100%">
        <Title order={4}>Statistics</Title>
      </Group>
      <Group w="100%" align="baseline">
        {createdStatisticsAccordions}
      </Group>
    </Stack>
  );

  const displayDashboardMetricsLayout = (
    <Stack w="100%" spacing="xl">
      {displayHeading}
      {displayCards}
      {displayStatisticsSection}
      {displayPieChartSection}
      {barChartSection}
      {lineChartSection}
      {calendarChartSection}
    </Stack>
  );

  return displayDashboardMetricsLayout;
}

export default DashboardMetricsLayout;
