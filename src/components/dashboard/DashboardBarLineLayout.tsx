import { Card, Center, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import {
  APP_HEADER_HEIGHT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
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
  overviewCards?: React.JSX.Element;
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
  const { globalState: { themeObject } } = useGlobalState();

  const { backgroundColor, grayBorderShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const overviewCardsSection = overviewCards && calendarView === "Daily"
    ? (
      <Stack align="flex-start" w="100%">
        <Title order={3}>Summary</Title>
        <Group w="100%">
          {overviewCards}
        </Group>
      </Stack>
    )
    : null;

  const barLineSection = (
    <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
      <Stack px="md">
        <Group position="apart" w="100%">
          {barLineRadialChartYAxisSelectInput}
          {barLineRadialChartKindSegmentedControl}
          {expandBarLineRadialChartButton}
        </Group>

        <Group w="100%" align="baseline" py="md">
          {cardsWithStatisticsElements}
        </Group>

        <Text size={20} weight={500}>{barLineRadialChartHeading}</Text>
        <Center>{barLineRadialChart}</Center>
      </Stack>
    </Card>
  );

  const pieSection = pieChart && pieChartHeading &&
      expandPieChartButton
    ? (
      <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
        <Stack px="md">
          <Group
            position={pieChartYAxisSelectInput ? "apart" : "right"}
            w="100%"
          >
            {pieChartYAxisSelectInput}
            {expandPieChartButton}
          </Group>

          <Text size={20} weight={500}>{pieChartHeading}</Text>
          <Center>
            {pieChart}
          </Center>
        </Stack>
      </Card>
    )
    : null;

  const calendarSection =
    calendarView === "Yearly" && calendarChart && calendarChartHeading
      ? (
        <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
          <Stack px="md">
            <Group position="apart" w="100%">
              {calendarChartYAxisSelectInput}
              {expandCalendarChartButton}
            </Group>

            <Text size={20} weight={500}>{calendarChartHeading}</Text>
            <Center>
              {calendarChart}
            </Center>
          </Stack>
        </Card>
      )
      : null;

  const dashboardBarLineLayout = (
    <Stack align="flex-start" w="100%" className="dashboard-content">
      <Group
        w="100%"
        py="md"
        style={{
          position: "sticky",
          top: APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT +
            METRICS_HEADER_HEIGHT,
          backgroundColor,
          zIndex: 2,
          boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title order={3}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Group>

      {overviewCardsSection}

      {pieSection}

      {barLineSection}

      {calendarSection}
    </Stack>
  );

  return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
