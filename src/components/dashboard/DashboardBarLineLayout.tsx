import { Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { DashboardCalendarView } from "./types";

type DashboardBarLineLayoutProps = {
  barLineChart: React.JSX.Element;
  barLineChartHeading: string;
  barLineChartYAxisSelectInput: React.JSX.Element;
  barLineChartKindSegmentedControl: React.JSX.Element;
  barLineChartYAxisVariable: string;
  calendarChart?: React.JSX.Element | null;
  calendarView: DashboardCalendarView;
  calendarChartHeading?: string;
  calendarChartYAxisSelectInput?: React.JSX.Element | null;
  cardsWithStatisticsElements: React.JSX.Element;
  expandBarLineChartButton: React.JSX.Element;
  expandCalendarChartButton?: React.JSX.Element | null;
  expandPieChartButton?: React.JSX.Element;
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
    calendarView,
    calendarChartHeading,
    calendarChartYAxisSelectInput,
    cardsWithStatisticsElements,
    expandBarLineChartButton,
    expandCalendarChartButton,
    expandPieChartButton,
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

  const barLineSection = (
    <Stack
      w="100%"
      p="md"
      style={{ borderBottom: `3px solid ${grayBorderShade}` }}
    >
      <Group position="left">
        <Text size="md" weight={500}>{barLineChartHeading}</Text>
      </Group>

      <Group
        w="100%"
        position="center"
      >
        {barLineChartYAxisSelectInput}
        {barLineChartKindSegmentedControl}
        {expandBarLineChartButton}
      </Group>

      <Group
        w="100%"
        position="apart"
        align="center"
      >
        <Stack>{cardsWithStatisticsElements}</Stack>
        {barLineChart}
      </Group>
    </Stack>
  );

  const pieSection = pieChart && pieChartHeading &&
      expandPieChartButton
    ? (
      <Stack
        w="100%"
        px="md"
        style={{ borderBottom: `3px solid ${grayBorderShade}` }}
      >
        <Group position="left">
          <Text size="md" weight={500}>{pieChartHeading}</Text>
        </Group>
        <Group
          w="100%"
          position={pieChartYAxisSelectInput ? "center" : "right"}
        >
          {pieChartYAxisSelectInput}
          {expandPieChartButton}
        </Group>
        <Group w="100%" position="center" align="center">
          {pieChart}
        </Group>
      </Stack>
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

  console.log("sectionHeading", sectionHeading);

  const dashboardBarLineLayout = (
    <Stack align="flex-start" w="100%">
      <Group
        w="100%"
        py="md"
        style={{
          position: "sticky",
          top: sectionHeading === "Financials" ? 160 : 185,
          backgroundColor,
          zIndex: 2,
          boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title order={3}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Group>

      {pieSection}

      {barLineSection}

      {calendarSection}
    </Stack>
  );

  return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
