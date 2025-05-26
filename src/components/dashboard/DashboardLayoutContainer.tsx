import { Box, Group, Text, Title } from "@mantine/core";
import React from "react";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { ChartsToYAxisKeysMap, DashboardCalendarView } from "./types";

type DashboardLayoutContainerProps = {
  barChart: React.JSX.Element;
  lineChart: React.JSX.Element;
  pieChart?: React.JSX.Element;
  radialChart: React.JSX.Element;
  calendarChart?: React.JSX.Element;
  calendarView: DashboardCalendarView;
  consolidatedCards: React.JSX.Element[];
  chartsToYAxisKeysMap: ChartsToYAxisKeysMap;
  sectionHeading: string;
  semanticLabel?: string;
  statisticsModals: React.JSX.Element[];
  yAxisKey: string;
  yAxisKeyChartHeading: string;
  yAxisKeySelectInput: React.JSX.Element;
};

function DashboardLayoutContainer(
  {
    calendarChart,
    calendarView,
    radialChart,
    barChart,
    lineChart,
    consolidatedCards,
    chartsToYAxisKeysMap,
    pieChart,
    sectionHeading,
    semanticLabel,
    statisticsModals,
    yAxisKey,
    yAxisKeyChartHeading,
    yAxisKeySelectInput,
  }: DashboardLayoutContainerProps,
) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient, grayBorderShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const isPieChartSafe = pieChart && chartsToYAxisKeysMap.pie.has(
    yAxisKey,
  );
  const isCalendarChartSafe = calendarChart &&
    chartsToYAxisKeysMap.calendar.has(
      yAxisKey,
    );

  const pieChartCard = pieChart
    ? (
      <div
        className="chart-card pie"
        style={{ border: `1px solid ${grayBorderShade}` }}
      >
        {pieChart}
      </div>
    )
    : null;

  const barChartCard = (
    <div
      className="chart-card bar"
      style={{ border: `1px solid ${grayBorderShade}` }}
    >
      {barChart}
    </div>
  );

  const calendarChartCard = calendarChart
    ? (
      <div
        className="chart-card calendar"
        style={{ border: `1px solid ${grayBorderShade}` }}
      >
        {calendarChart}
      </div>
    )
    : null;

  const lineChartCard = (
    <div
      className="chart-card line"
      style={{ border: `1px solid ${grayBorderShade}` }}
    >
      {lineChart}
    </div>
  );

  const radialChartCard = (
    <div
      className="chart-card radial"
      style={{ border: `1px solid ${grayBorderShade}` }}
    >
      {radialChart}
    </div>
  );

  const yAxisKeyChartHeadingTitle = (
    <div
      className="chart-titles"
      data-testid="chart-titles"
    >
      {yAxisKeyChartHeading?.split(" ").map((word, idx) => (
        <Title order={5} size={24} key={`${idx}-${word}-${calendarView}`}>
          {word}
        </Title>
      ))}
    </div>
  );

  const yAxisKeyControlsCard = (
    <div
      className="chart-controls-card"
      data-testid="chart-controls-card"
      style={{ border: `1px solid ${grayBorderShade}` }}
    >
      <Group w="100%" position="left">
        <Text size={24} weight={500}>Data Mapping</Text>
      </Group>
      {yAxisKeySelectInput}
    </div>
  );

  const newGridLayout = (
    <div
      className={`grid-section ${
        isPieChartSafe ? "pie" : isCalendarChartSafe ? "calendar" : ""
      }`}
    >
      {yAxisKeyChartHeadingTitle}
      {yAxisKeyControlsCard}
      {isPieChartSafe ? pieChartCard : null}
      {isCalendarChartSafe ? calendarChartCard : null}
      {barChartCard}
      {lineChartCard}
      {radialChartCard}
      {consolidatedCards}
    </div>
  );

  const dashboardLayoutContainer = (
    <div
      className="dashboard-layout-container"
      key={`${yAxisKeyChartHeading}-${calendarView}`}
    >
      <Box bg={bgGradient} className="header">
        <Title
          order={3}
          size={28}
          data-testid={`dashboard-${calendarView}-${sectionHeading}`}
        >
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Box>
      {statisticsModals}
      {newGridLayout}
    </div>
  );

  return dashboardLayoutContainer;
}

export default DashboardLayoutContainer;
