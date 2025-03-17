import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import { ResponsiveBarChart, ResponsiveLineChart } from "../../../charts";
import { MONTHS } from "../../constants";
import DashboardBarLineLayout from "../../DashboardBarLineLayout";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import { returnChartTitleNavigateLinks, returnStatistics } from "../../utils";
import {
  consolidateFinancialCardsAndStatistics,
  createFinancialStatisticsElements,
  DashboardCardInfo,
} from "../../utilsTSX";
import type { FinancialMetricsCards } from "../cards";
import type { FinancialMetricsCharts } from "../chartsData";
import { FINANCIAL_OTHERS_Y_AXIS_DATA } from "../constants";
import type {
  FinancialCardsAndStatisticsKeyOtherMetrics,
  FinancialMetricCategory,
} from "../types";
import { otherMetricsAction } from "./actions";
import { otherMetricsReducer } from "./reducers";
import { initialOtherMetricsState } from "./state";

type OtherMetricsProps = {
  calendarView: DashboardCalendarView;
  financialMetricsCards: FinancialMetricsCards;
  financialMetricsCharts: FinancialMetricsCharts;
  day: string;
  metricCategory: FinancialMetricCategory;
  metricsView: DashboardMetricsView;
  month: string;
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

function OtherMetrics({
  calendarView,
  financialMetricsCards,
  financialMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  year,
}: OtherMetricsProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [otherMetricsState, otherMetricsDispatch] = React.useReducer(
    otherMetricsReducer,
    initialOtherMetricsState,
  );

  const { barChartYAxisVariable, lineChartYAxisVariable } = otherMetricsState;

  const charts = calendarView === "Daily"
    ? financialMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? financialMetricsCharts.monthlyCharts
    : financialMetricsCharts.yearlyCharts;
  const {
    otherMetrics: { bar: barCharts, line: lineCharts },
  } = charts;

  const {
    barChartHeading,
    expandBarChartNavigateLink,
    expandLineChartNavigateLink,
    lineChartHeading,
    pieChartHeading,
  } = returnChartTitleNavigateLinks({
    calendarView,
    metricCategory,
    metricsView,
    storeLocation,
    yAxisBarChartVariable: barChartYAxisVariable,
    yAxisLineChartVariable: lineChartYAxisVariable,
    year,
    day,
    month,
    months: MONTHS,
  });

  const expandBarChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: `Expand and customize ${barChartHeading}`,
        kind: "expand",
        onClick: (
          _event:
            | React.MouseEvent<HTMLButtonElement>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          globalDispatch({
            action: globalAction.setCustomizeChartsPageData,
            payload: {
              chartKind: "bar",
              chartData: barCharts[barChartYAxisVariable],
              chartTitle: barChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandBarChartNavigateLink);
        },
      }}
    />
  );

  const barChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setBarChartYAxisVariable,
        value: barChartYAxisVariable,
      }}
    />
  );

  const overviewBarChart = (
    <ResponsiveBarChart
      barChartData={barCharts[barChartYAxisVariable]}
      hideControls
      indexBy={calendarView === "Daily"
        ? "Days"
        : calendarView === "Monthly"
        ? "Months"
        : "Years"}
      keys={FINANCIAL_OTHERS_Y_AXIS_DATA.map((obj) => obj.label)}
      unitKind="number"
    />
  );

  const expandLineChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: `Expand and customize ${lineChartHeading}`,
        kind: "expand",
        onClick: (
          _event:
            | React.MouseEvent<HTMLButtonElement>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          globalDispatch({
            action: globalAction.setCustomizeChartsPageData,
            payload: {
              chartKind: "line",
              chartData: lineCharts[lineChartYAxisVariable],
              chartTitle: lineChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandLineChartNavigateLink);
        },
      }}
    />
  );

  const lineChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis Line",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setLineChartYAxisVariable,
        value: lineChartYAxisVariable,
      }}
    />
  );

  const overviewLineChart = (
    <ResponsiveLineChart
      lineChartData={lineCharts[lineChartYAxisVariable]}
      hideControls
      xFormat={(x) =>
        `${
          calendarView === "Daily"
            ? "Day"
            : calendarView === "Monthly"
            ? "Month"
            : "Year"
        } - ${x}`}
      yFormat={(y) => addCommaSeparator(y)}
      unitKind="number"
    />
  );

  const cards = calendarView === "Daily"
    ? financialMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? financialMetricsCards.monthlyCards
    : financialMetricsCards.yearlyCards;
  const overviewCardsArr = cards.otherMetrics;

  const overviewCards = overviewCardsArr.reduce((acc, card) => {
    const { heading = "Total" } = card;

    acc.set(heading as FinancialCardsAndStatisticsKeyOtherMetrics, card);

    return acc;
  }, new Map<FinancialCardsAndStatisticsKeyOtherMetrics, DashboardCardInfo>());

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "otherMetrics",
    statisticsMap,
    storeLocation,
  );

  console.log({ metricCategory });

  const consolidatedCards = consolidateFinancialCardsAndStatistics(
    overviewCards,
    statisticsElementsMap,
  );

  const otherMetrics = (
    <DashboardBarLineLayout
      barChart={overviewBarChart}
      barChartHeading={barChartHeading}
      barChartYAxisSelectInput={barChartYAxisVariablesSelectInput}
      barChartYAxisVariable={barChartYAxisVariable}
      consolidatedCards={consolidatedCards}
      expandBarChartButton={expandBarChartButton}
      expandLineChartButton={expandLineChartButton}
      lineChart={overviewLineChart}
      lineChartHeading={lineChartHeading}
      lineChartYAxisSelectInput={lineChartYAxisVariablesSelectInput}
      lineChartYAxisVariable={lineChartYAxisVariable}
      sectionHeading={`${storeLocation} ${calendarView} Overview Financials`}
      semanticLabel={metricCategory}
    />
  );

  // const financialMetricsOverview = (
  //   <DashboardMetricsLayout
  //     barChart={overviewBarChart}
  //     barChartHeading={barChartHeading}
  //     barChartYAxisSelectInput={barChartYAxisVariablesSelectInput}
  //     expandBarChartButton={expandBarChartButton}
  //     expandLineChartButton={expandLineChartButton}
  //     lineChart={overviewLineChart}
  //     lineChartHeading={lineChartHeading}
  //     lineChartYAxisSelectInput={lineChartYAxisVariablesSelectInput}
  //     overviewCards={overviewCards}
  //     pieChartHeading={pieChartHeading}
  //     sectionHeading={`${storeLocation} ${calendarView} Overview Financials`}
  //     statisticsMap={statistics}
  //   />
  // );

  return (
    <Stack>
      {otherMetrics}
    </Stack>
  );
}

export default OtherMetrics;
