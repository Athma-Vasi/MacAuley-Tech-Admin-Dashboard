import { Card, Title } from "@mantine/core";
import React from "react";
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
  }: DashboardLayoutContainerProps,
) {
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
    <Card className="chart-controls-card">
      {pieChartYAxisSelectInput}
      {expandPieChartButton}
    </Card>
  );

  const pieChartCard = (
    <Card className="chart-card">
      <Card.Section>{pieChart}</Card.Section>
    </Card>
  );

  const pieChartSectionMaybe = (
    <section className="pie-chart-section">
      {pieChartTitle}
      {pieChartControlsCard}
      {pieChartCard}
    </section>
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
    <Card className="chart-controls-card">
      {barLineRadialChartYAxisSelectInput}
      {barLineRadialChartKindSegmentedControl}
      {expandBarLineRadialChartButton}
    </Card>
  );

  const barLineRadialChartCard = (
    <Card className="chart-card">
      <Card.Section>{barLineRadialChart}</Card.Section>
    </Card>
  );

  const barLineRadialSection = (
    <section className="bar-line-radial-chart-section">
      {barLineRadialChartTitle}
      {barLineRadialChartControlsCard}
      {cardsWithStatisticsElements}
      {barLineRadialChartCard}
    </section>
  );

  const calendarChartTitle = (
    <div className="chart-titles">
      {calendarChartHeading
        ? calendarChartHeading.split(" ").map((word) => (
          <Title order={3} size={24}>{word}</Title>
        ))
        : null}
    </div>
  );

  const calendarChartControlsCard = (
    <Card className="chart-controls-card">
      {calendarChartYAxisSelectInput}
      {expandCalendarChartButton}
    </Card>
  );

  const calendarChartCard = (
    <Card className="chart-card">
      <Card.Section>{calendarChart}</Card.Section>
    </Card>
  );

  const calendarSection = (
    <section className="calendar-chart-section">
      {calendarChartTitle}
      {calendarChartControlsCard}
      {calendarChartCard}
    </section>
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
    <div className="dashboard-layout-container">
      <div className="header">
        <Title order={3} size={28}>
          {calendarView}{"  "}{sectionHeading}
        </Title>
      </div>

      {pieChartSectionMaybe}

      {barLineRadialSection}

      {calendarSection}
    </div>
  );

  return dashboardLayoutContainer;
}

export default DashboardLayoutContainer;
