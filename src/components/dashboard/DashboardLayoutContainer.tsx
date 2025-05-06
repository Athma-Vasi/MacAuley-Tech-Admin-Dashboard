import { Box, Title } from "@mantine/core";
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
  // barLineRadialChart: React.JSX.Element;
  // barLineRadialChartKindSegmentedControl: React.JSX.Element;
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
    // barLineRadialChart,
    // barLineRadialChartKindSegmentedControl,
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
  const { bgGradient } = returnThemeColors({
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
  // const isBarLineRadialChartSafe = chartsToYAxisKeysMap.bar.has(yAxisKey) ||
  //   chartsToYAxisKeysMap.line.has(yAxisKey) ||
  //   chartsToYAxisKeysMap.radial.has(yAxisKey);

  const pieChartCard = pieChart
    ? (
      <div className="chart-card pie">
        {pieChart}
      </div>
    )
    : null;

  const barChartCard = (
    <div className="chart-card bar">
      {barChart}
    </div>
  );

  const calendarChartCard = calendarChart
    ? (
      <div className="chart-card calendar">
        {calendarChart}
      </div>
    )
    : null;

  const lineChartCard = (
    <div className="chart-card line">
      {lineChart}
    </div>
  );

  const radialChartCard = (
    <div className="chart-card radial">
      {radialChart}
    </div>
  );

  const yAxisKeyChartHeadingTitle = (
    <div className="chart-titles">
      {yAxisKeyChartHeading?.split(" ").map((word, idx) => (
        <Title order={3} size={24} key={`${idx}-${word}-${calendarView}`}>
          {word}
        </Title>
      ))}
    </div>
  );

  const yAxisKeyControlsCard = (
    <div className="chart-controls-card">
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

  // const newGridLayout = isPieChartSafe
  //   ? (
  //     <div className="grid-section pie">
  //       {yAxisKeyChartHeadingTitle}
  //       {pieChartCard}
  //       {barChartCard}
  //       {lineChartCard}
  //       {radialChartCard}
  //       <div className="controls-stat-zero">
  //         {yAxisKeyControlsCard}
  //         {consolidatedCards[0]}
  //       </div>
  //       <div className="stat-one-two">
  //         {consolidatedCards[1]}
  //         {consolidatedCards[2]}
  //       </div>
  //       <div className="stat-three-four">
  //         {consolidatedCards[3]}
  //         {consolidatedCards[4]}
  //       </div>
  //     </div>
  //   )
  //   : (
  //     <div className="grid-section calendar">
  //       {yAxisKeyChartHeadingTitle}
  //       {yAxisKeyControlsCard}
  //       {calendarChartCard}
  //       {barChartCard}
  //       {lineChartCard}
  //       {radialChartCard}
  //       <div className="stat-zero">
  //         {consolidatedCards[0]}
  //       </div>
  //     </div>
  //   );

  const dashboardLayoutContainer = (
    <div
      className="dashboard-layout-container"
      key={`${yAxisKeyChartHeading}-${calendarView}`}
    >
      <Box bg={bgGradient} className="header">
        <Title order={3} size={28}>
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
