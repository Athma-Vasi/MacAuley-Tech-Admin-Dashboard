import { Box, Space, Title } from "@mantine/core";
import React from "react";
import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useWindowSize } from "../../hooks/useWindowSize";
import { returnThemeColors } from "../../utils";
import { DashboardCalendarView } from "./types";

type DashboardLayoutContainerProps = {
  barLineRadialChart: React.JSX.Element;
  barLineRadialChartHeading: string;
  barLineRadialChartKindSegmentedControl: React.JSX.Element;
  barLineRadialChartYAxisSelectInput: React.JSX.Element;
  barLineRadialChartYAxis: string;
  calendarChart?: React.JSX.Element | null;
  calendarChartHeading?: string;
  calendarChartYAxisSelectInput?: React.JSX.Element | null;
  calendarView: DashboardCalendarView;
  cardsWithStatisticsElements: React.JSX.Element[];
  expandBarLineRadialChartButton: React.JSX.Element;
  expandCalendarChartButton?: React.JSX.Element | null;
  expandPieChartButton?: React.JSX.Element;
  overviewCards: React.JSX.Element;
  pieChart?: React.JSX.Element;
  pieChartHeading?: string;
  pieChartYAxisSelectInput?: React.JSX.Element;
  sectionHeading: string;
  semanticLabel?: string;
  statisticsModals?: React.JSX.Element[];
};

function DashboardLayoutContainer(
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
    statisticsModals,
  }: DashboardLayoutContainerProps,
) {
  const { globalState: { themeObject } } = useGlobalState();
  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });
  const { windowWidth } = useWindowSize();

  const pieChartTitle = (
    <div className="chart-titles">
      {pieChartHeading
        ? pieChartHeading.split(" ").map((word) => (
          <Title order={4} size={24}>{word}</Title>
        ))
        : null}
    </div>
  );

  const pieChartControlsCard = (
    <div className="chart-controls-card">
      {pieChartYAxisSelectInput}
      <div className="footer">{expandPieChartButton}</div>
    </div>
  );

  const pieChartCard = (
    <div className="chart-card">
      {pieChart}
    </div>
  );

  const pieChartSectionMaybe = (
    <div className="chart-section-container">
      <section className="chart-section">
        {pieChartTitle}
        {pieChartControlsCard}
        {pieChartCard}
      </section>
    </div>
  );

  // const pieSectionMaybe = (
  //   <div
  //     className={`overview-${
  //       pieChart === null || pieChart === undefined ? "without" : "with"
  //     }-pie`}
  //   >
  //     <div
  //       className={`overview-summary-${pieChart ? "with" : "without"}-pie`}
  //     >
  //       <Title order={5} size={20}>Summary</Title>
  //       <div
  //         className={`overview-cards-${pieChart ? "with" : "without"}-pie`}
  //       >
  //         {overviewCards}
  //       </div>
  //     </div>

  //     {pieChart && pieChartHeading && expandPieChartButton
  //       ? pieChartCard
  //       : null}
  //   </div>
  // );

  // const barLineSection = (
  //   <Card
  //     className="chart-card bar-line-chart-card"
  //     shadow="sm"
  //     padding="md"
  //     radius="md"
  //     withBorder
  //   >
  //     <Stack w="100%" spacing="xl">
  //       <Group position="apart" w="100%" align="flex-end">
  //         {barLineRadialChartYAxisSelectInput}
  //         {barLineRadialChartKindSegmentedControl}
  //         {expandBarLineRadialChartButton}
  //       </Group>

  //       <div className="statistics-elements-container">
  //         {cardsWithStatisticsElements}
  //       </div>
  //       <Text size={20} weight={500}>{barLineRadialChartHeading}</Text>
  //       <Center w="100%">{barLineRadialChart}</Center>
  //     </Stack>
  //   </Card>
  // );

  const barLineRadialChartTitle = (
    <div className="chart-titles">
      {barLineRadialChartHeading
        ? barLineRadialChartHeading.split(" ").map((word) => (
          <Title order={3} size={24}>{word}</Title>
        ))
        : null}
    </div>
  );

  const barLineRadialChartControlsCard = (
    <div className="chart-controls-card">
      {barLineRadialChartYAxisSelectInput}
      <div className="footer">
        {barLineRadialChartKindSegmentedControl}
        {expandBarLineRadialChartButton}
      </div>
    </div>
  );

  const barLineRadialChartCard = (
    <div className="chart-card">
      {barLineRadialChart}
    </div>
  );

  const barLineRadialSection = windowWidth < 1024
    ? (
      <div className="chart-section-container">
        <section className="chart-section-blr">
          {barLineRadialChartTitle}
          {barLineRadialChartControlsCard}
          {barLineRadialChartCard}
        </section>
        <div className="mobile-air">{cardsWithStatisticsElements}</div>
      </div>
    )
    : (
      <div className="chart-section-container">
        <section className="chart-section-blr">
          {barLineRadialChartTitle}
          {barLineRadialChartControlsCard}
          {barLineRadialChartCard}
          {cardsWithStatisticsElements}
        </section>
      </div>
    );

  const calendarChartTitle = (
    <div className="chart-titles">
      {calendarChartHeading
        ? calendarChartHeading.split(" ").map((word, idx) => (
          <Title order={3} size={24} key={`${idx}-${word}`}>{word}</Title>
        ))
        : null}
    </div>
  );

  const calendarChartControlsCard = (
    <div className="chart-controls-card">
      {calendarChartYAxisSelectInput}
      <div className="footer">{expandCalendarChartButton}</div>
    </div>
  );

  const calendarChartCard = (
    <div className="chart-card">
      {calendarChart}
    </div>
  );

  const calendarSection = (
    <div className="chart-section-container">
      <section className="chart-section">
        {calendarChartTitle}
        {calendarChartControlsCard}
        {calendarChartCard}
      </section>
    </div>
  );

  // const calendarSection =
  //   calendarView === "Yearly" && calendarChart && calendarChartHeading
  //     ? (
  //       <Card
  //         className="chart-card calendar-chart-card"
  //         shadow="sm"
  //         padding="md"
  //         radius="md"
  //         withBorder
  //       >
  //         <Stack w="100%" spacing="xl">
  //           <Group position="apart" w="100%">
  //             {calendarChartYAxisSelectInput}
  //             {expandCalendarChartButton}
  //           </Group>

  //           <Text size={20} weight={500}>{calendarChartHeading}</Text>
  //           <Center w="100%">{calendarChart}</Center>
  //         </Stack>
  //       </Card>
  //     )
  //     : null;

  const dashboardLayoutContainer = (
    <div
      className="dashboard-layout-container"
      key={`${barLineRadialChartHeading}-${calendarView}`}
    >
      <Space h="xl" />
      <Box bg={bgGradient} className="header">
        <Title order={3} size={28}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </Box>

      <Space h="xl" />
      {pieChartSectionMaybe}

      <Space h="xl" />
      <Space h="xl" />
      {statisticsModals}
      {barLineRadialSection}

      <Space h="xl" />
      {calendarSection}
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </div>
  );

  return dashboardLayoutContainer;
}

export default DashboardLayoutContainer;
