import {
  Card,
  Center,
  Flex,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { DashboardCalendarView } from "./types";

type DashboardBarLineLayoutProps = {
  barLineRadialChart: React.JSX.Element;
  barLineRadialChartHeading: string;
  barLineRadialChartKindSegmentedControl: React.JSX.Element;
  barLineRadialChartYAxisSelectInput: React.JSX.Element;
  barLineRadialChartYAxis: string;
  calendarChart?: React.JSX.Element | null;
  calendarChartHeading?: string;
  calendarChartYAxisSelectInput?: React.JSX.Element | null;
  calendarView: DashboardCalendarView;
  cardsWithStatisticsElements: React.JSX.Element;
  expandBarLineRadialChartButton: React.JSX.Element;
  expandCalendarChartButton?: React.JSX.Element | null;
  expandPieChartButton?: React.JSX.Element;
  overviewCards: React.JSX.Element;
  pieChart?: React.JSX.Element;
  pieChartHeading?: string;
  pieChartYAxisSelectInput?: React.JSX.Element;
  sectionHeading: string;
  semanticLabel?: string;
};

function DashboardBarLineLayout(
  {
    barLineRadialChart,
    barLineRadialChartHeading,
    barLineRadialChartKindSegmentedControl,
    barLineRadialChartYAxisSelectInput,
    barLineRadialChartYAxis,
    calendarChart,
    calendarChartHeading,
    calendarChartYAxisSelectInput,
    calendarView,
    cardsWithStatisticsElements,
    expandBarLineRadialChartButton,
    expandCalendarChartButton,
    expandPieChartButton,
    overviewCards,
    pieChart,
    pieChartHeading,
    pieChartYAxisSelectInput,
    sectionHeading,
    semanticLabel,
  }: DashboardBarLineLayoutProps,
) {
  const pieChartCard = (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="pie-chart-card"
    >
      <Stack w="100%" spacing="xl">
        <Group
          position={pieChartYAxisSelectInput ? "apart" : "right"}
          w="100%"
        >
          {pieChartYAxisSelectInput}
          {expandPieChartButton}
        </Group>

        <Text size={20} weight={500}>{pieChartHeading}</Text>
        <Center w="100%">
          {pieChart}
        </Center>
      </Stack>
    </Card>
  );

  const pieSectionMaybe = (
    <div className={`overview-${pieChart ? "with" : "without"}-pie`}>
      <Flex
        className={`overview-summary-${pieChart ? "with" : "without"}-pie`}
      >
        <Title order={5} size={20}>Summary</Title>
        <div
          className={`overview-cards-${pieChart ? "with" : "without"}-pie`}
        >
          {overviewCards}
        </div>
      </Flex>

      {pieChart && pieChartHeading && expandPieChartButton
        ? pieChartCard
        : null}
    </div>
  );

  const barLineSection = (
    <Card
      className="chart-card bar-line-chart-card"
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
    >
      <Stack w="100%" spacing="xl">
        <Group position="apart" w="100%" align="flex-end">
          {barLineRadialChartYAxisSelectInput}
          {barLineRadialChartKindSegmentedControl}
          {expandBarLineRadialChartButton}
        </Group>

        <div className="statistics-elements-container">
          {cardsWithStatisticsElements}
        </div>
        <Text size={20} weight={500}>{barLineRadialChartHeading}</Text>
        <Center w="100%">{barLineRadialChart}</Center>
      </Stack>
    </Card>
  );

  const calendarSection =
    calendarView === "Yearly" && calendarChart && calendarChartHeading
      ? (
        <Card
          className="chart-card calendar-chart-card"
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
        >
          <Stack w="100%" spacing="xl">
            <Group position="apart" w="100%">
              {calendarChartYAxisSelectInput}
              {expandCalendarChartButton}
            </Group>

            <Text size={20} weight={500}>{calendarChartHeading}</Text>
            <Center w="100%">{calendarChart}</Center>
          </Stack>
        </Card>
      )
      : null;

  const dashboardBarLineLayout = (
    <Stack
      align="flex-start"
      className="dashboard-bar-line-layout"
      w="100%"
      spacing="xl"
    >
      <Space h="md" />
      <Group
        w="100%"
        py="md"
        // style={{
        //   position: "sticky",
        //   top: windowWidth < MOBILE_BREAKPOINT
        //     ? DASHBOARD_HEADER_HEIGHT_MOBILE +
        //       METRICS_HEADER_HEIGHT_MOBILE
        //     : DASHBOARD_HEADER_HEIGHT +
        //       METRICS_HEADER_HEIGHT,
        //   backgroundColor,
        //   zIndex: 2,
        //   boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.1)",
        // }}
      >
        <Title order={5} size={24}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Group>

      {pieSectionMaybe}

      {barLineSection}

      {calendarSection}
    </Stack>
  );

  return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
