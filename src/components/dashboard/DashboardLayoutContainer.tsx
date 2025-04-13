import { Box, Space, Title } from "@mantine/core";
import React from "react";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useWindowSize } from "../../hooks/useWindowSize";
import { returnThemeColors } from "../../utils";
import {
  ChartsToYAxisKeysMap,
  DashboardCalendarView,
  FinancialYAxisKey,
} from "./types";

type DashboardLayoutContainerProps = {
  barLineRadialChart: React.JSX.Element;
  barLineRadialChartKindSegmentedControl: React.JSX.Element;
  calendarChart?: React.JSX.Element | null;
  calendarView: DashboardCalendarView;
  cardsWithStatisticsElements: React.JSX.Element[];
  chartsToYAxisKeysMap?: ChartsToYAxisKeysMap;
  expandBarLineRadialChartButton: React.JSX.Element;
  expandCalendarChartButton?: React.JSX.Element | null;
  expandPieChartButton?: React.JSX.Element;
  pieChart?: React.JSX.Element;
  sectionHeading: string;
  semanticLabel?: string;
  statisticsModals: React.JSX.Element[];
  yAxisKey: string;
  yAxisKeyChartHeading: string;
  yAxisKeySelectInput: React.JSX.Element;
};

function DashboardLayoutContainer(
  {
    barLineRadialChart,
    barLineRadialChartKindSegmentedControl,
    calendarChart,
    calendarView,
    cardsWithStatisticsElements,
    chartsToYAxisKeysMap,
    expandBarLineRadialChartButton,
    expandCalendarChartButton,
    expandPieChartButton,
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
  const { windowWidth } = useWindowSize();

  const isPieChartSafe = chartsToYAxisKeysMap?.pie.has(
    yAxisKey as FinancialYAxisKey,
  );
  const isCalendarChartSafe = chartsToYAxisKeysMap?.calendar.has(
    yAxisKey as FinancialYAxisKey,
  );
  const isBarLineRadialChartSafe =
    chartsToYAxisKeysMap?.bar.has(yAxisKey as FinancialYAxisKey) ||
    chartsToYAxisKeysMap?.line.has(yAxisKey as FinancialYAxisKey) ||
    chartsToYAxisKeysMap?.radial.has(yAxisKey as FinancialYAxisKey);

  const pieChartWithButton = (
    <div className="chart-card pie">
      {expandPieChartButton}
      {pieChart}
    </div>
  );

  const calendarChartWithButton = (
    <div className="chart-card calendar">
      {expandCalendarChartButton}
      {calendarChart}
    </div>
  );
  const barLineRadialChartWithButton = (
    <div className="chart-card bar-line-radial">
      {expandBarLineRadialChartButton}
      {barLineRadialChart}
    </div>
  );

  const yAxisKeyChartHeadingTitle = (
    <div className="chart-titles">
      {yAxisKeyChartHeading?.split(" ").map((word) => (
        <Title order={3} size={24}>{word}</Title>
      ))}
    </div>
  );

  const yAxisKeyControlsCard = (
    <div className="chart-controls-card">
      {yAxisKeySelectInput}
      {isBarLineRadialChartSafe ? barLineRadialChartKindSegmentedControl : null}
    </div>
  );

  const newGridLayout = (
    <div className="grid-section">
      {yAxisKeyChartHeadingTitle}
      {yAxisKeyControlsCard}
      {barLineRadialChartWithButton}
      {isPieChartSafe ? pieChartWithButton : null}
      {isCalendarChartSafe ? calendarChartWithButton : null}
      {cardsWithStatisticsElements}
    </div>
  );

  // const pieChartSectionMaybe =
  //   chartsToYAxisKeysMap?.["pie"]?.has(yAxisKey as FinancialYAxisKey)
  //     ? (
  //       <section className="chart-section">
  //         <div className="chart-titles">
  //           {pieChartHeading
  //             ? pieChartHeading.split(" ").map((word) => (
  //               <Title order={4} size={24}>{word}</Title>
  //             ))
  //             : null}
  //         </div>

  //         <div className="chart-controls-card">
  //           {pieChartYAxisSelectInput}
  //           <div className="footer">{expandPieChartButton}</div>
  //         </div>

  //         <div className="chart-card">
  //           {pieChart}
  //         </div>
  //       </section>
  //     )
  //     : null;

  // const barLineRadialChartTitle = (
  //   <div className="chart-titles">
  //     {barLineRadialChartHeading
  //       ? barLineRadialChartHeading.split(" ").map((word) => (
  //         <Title order={3} size={24}>{word}</Title>
  //       ))
  //       : null}
  //   </div>
  // );

  // const barLineRadialChartControlsCard = (
  //   <div className="chart-controls-card">
  //     {barLineRadialChartYAxisSelectInput}
  //     <div className="footer">
  //       {expandBarLineRadialChartButton}
  //       {barLineRadialChartKindSegmentedControl}
  //     </div>
  //   </div>
  // );

  // const barLineRadialChartCard = (
  //   <div className="chart-card">
  //     {barLineRadialChart}
  //   </div>
  // );

  // const barLineRadialSection = windowWidth < 1024
  //   ? (
  //     <div className="chart-section-container">
  //       <section className="chart-section-blr">
  //         {barLineRadialChartTitle}
  //         {barLineRadialChartControlsCard}
  //         {barLineRadialChartCard}
  //       </section>
  //       <div className="mobile-air">{cardsWithStatisticsElements}</div>
  //     </div>
  //   )
  //   : (
  //     <div className="chart-section-container">
  //       <section className="chart-section-blr">
  //         {barLineRadialChartTitle}
  //         {barLineRadialChartControlsCard}
  //         {barLineRadialChartCard}
  //         {cardsWithStatisticsElements}
  //       </section>
  //     </div>
  //   );

  // const calendarChartTitle = (
  //   <div className="chart-titles">
  //     {calendarChartHeading
  //       ? calendarChartHeading.split(" ").map((word, idx) => (
  //         <Title order={3} size={24} key={`${idx}-${word}`}>{word}</Title>
  //       ))
  //       : null}
  //   </div>
  // );

  // const calendarChartControlsCard = (
  //   <div className="chart-controls-card">
  //     {calendarChartYAxisSelectInput}
  //     <div className="footer">{expandCalendarChartButton}</div>
  //   </div>
  // );

  // const calendarChartCard = (
  //   <div className="chart-card">
  //     {calendarChart}
  //   </div>
  // );

  // const calendarSection = (
  //   <div className="chart-section-container">
  //     <section className="chart-section">
  //       {calendarChartTitle}
  //       {calendarChartControlsCard}
  //       {calendarChartCard}
  //     </section>
  //   </div>
  // );

  const dashboardLayoutContainer = (
    <div
      className="dashboard-layout-container"
      key={`${yAxisKeyChartHeading}-${calendarView}`}
    >
      <Space h="xl" />
      <Box bg={bgGradient} className="header">
        <Title order={3} size={28}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Box>
      {statisticsModals}
      {newGridLayout}
    </div>
  );

  const testingContainer = <div></div>;

  return dashboardLayoutContainer;
}

export default DashboardLayoutContainer;
