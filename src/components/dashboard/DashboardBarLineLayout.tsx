import { Card, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import {
  APP_HEADER_HEIGHT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useWindowSize } from "../../hooks/useWindowSize";
import { returnThemeColors } from "../../utils";
import { DashboardCalendarView } from "./types";

type DashboardBarLineLayoutProps = {
  barLineChart: React.JSX.Element;
  barLineChartHeading: string;
  barLineChartKindSegmentedControl: React.JSX.Element;
  barLineChartYAxisSelectInput: React.JSX.Element;
  barLineChartYAxisVariable: string;
  calendarChart?: React.JSX.Element | null;
  calendarChartHeading?: string;
  calendarChartYAxisSelectInput?: React.JSX.Element | null;
  calendarView: DashboardCalendarView;
  cardsWithStatisticsElements: React.JSX.Element;
  expandBarLineChartButton: React.JSX.Element;
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
    barLineChart,
    barLineChartHeading,
    barLineChartKindSegmentedControl,
    barLineChartYAxisSelectInput,
    barLineChartYAxisVariable,
    calendarChart,
    calendarChartHeading,
    calendarChartYAxisSelectInput,
    calendarView,
    cardsWithStatisticsElements,
    expandBarLineChartButton,
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
  const { windowHeight, windowWidth } = useWindowSize();
  const { globalState: { themeObject } } = useGlobalState();

  const { backgroundColor, grayBorderShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const overviewCardsSection = overviewCards
    ? (
      <Group>
        {overviewCards}
      </Group>
    )
    : null;

  const barLineSection = (
    <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
      <Stack px="md">
        <Group position="apart" w="100%">
          {barLineChartYAxisSelectInput}
        </Group>

        <Card
          className="bar-line-chart"
          padding="lg"
          radius="md"
          withBorder
        >
          <Text size={20} weight={500}>{barLineChartHeading}</Text>
          {barLineChart}
        </Card>
      </Stack>
    </Card>
  );

  const pieSection = pieChart && pieChartHeading &&
      expandPieChartButton
    ? (
      <Card shadow="sm" padding="lg" radius="md" w="100%" withBorder>
        <Stack px="md">
          <Group position="apart" w="100%">
            {pieChartYAxisSelectInput}
          </Group>

          <Card
            className="pie-chart"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text size={20} weight={500}>{pieChartHeading}</Text>
            {pieChart}
          </Card>
        </Stack>
      </Card>
    )
    : null;

  const calendarSection =
    calendarView === "Yearly" && calendarChart && calendarChartHeading
      ? (
        <Stack
          w="100%"
          px="md"
          style={{ borderBottom: `3px solid ${grayBorderShade}` }}
        >
          <Group position="left">
            <Text size="md" weight={500}>{calendarChartHeading}</Text>
          </Group>
          <Group
            w="100%"
            position={calendarChartYAxisSelectInput ? "center" : "right"}
          >
            {calendarChartYAxisSelectInput}
            {expandCalendarChartButton}
          </Group>
          <Group w="100%" position="center" align="center">
            {calendarChart}
          </Group>
        </Stack>
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
