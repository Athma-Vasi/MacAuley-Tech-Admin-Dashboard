import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
} from "../../../charts";
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
import { type FinancialMetricsCards } from "../cards";
import {
  type FinancialMetricsCharts,
  returnCalendarViewFinancialCharts,
} from "../chartsData";
import {
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  PERT_SET,
} from "../constants";
import {
  FinancialCardsAndStatisticsKeyPERT,
  type FinancialMetricCategory,
} from "../types";
import { pertAction } from "./actions";
import { pertReducer } from "./reducers";
import { initialPERTState } from "./state";

type PERTProps = {
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
/** PERT = Profit | Expenses | Revenue | Transactions */
function PERT({
  calendarView,
  financialMetricsCards,
  financialMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  year,
}: PERTProps) {
  const { globalState: { themeObject: { primaryColor } }, globalDispatch } =
    useGlobalState();
  const navigate = useNavigate();

  const [pertState, pertDispatch] = React.useReducer(
    pertReducer,
    initialPERTState,
  );

  const {
    barChartYAxisVariable,
    lineChartYAxisVariable,
    pieChartYAxisVariable,
  } = pertState;

  const charts = returnCalendarViewFinancialCharts(
    calendarView,
    financialMetricsCharts,
  );

  const {
    bar: barCharts,
    line: lineCharts,
    pie: pieCharts,
  } = PERT_SET.has(metricCategory)
    ? (charts[metricCategory] as FinancialMetricsCharts["dailyCharts"][
      "expenses"
    ])
    : charts.profit;

  const {
    barChartHeading,
    expandBarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
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

  const pieChartYAxisVariableSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_PERT_PIE_Y_AXIS_DATA,
        name: "Y-Axis Pie",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setPieChartYAxisVariable,
        value: pieChartYAxisVariable,
      }}
    />
  );

  const expandPieChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: `Expand and customize ${pieChartHeading}`,
        kind: "expand",
        onClick: (
          _event:
            | React.MouseEvent<HTMLButtonElement>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          globalDispatch({
            action: globalAction.setCustomizeChartsPageData,
            payload: {
              chartKind: "pie",
              chartData: pieCharts[pieChartYAxisVariable],
              chartTitle: pieChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandPieChartNavigateLink);
        },
      }}
    />
  );

  const overviewPieChart = (
    <ResponsivePieChart
      pieChartData={pieCharts[pieChartYAxisVariable]}
      hideControls
      unitKind="number"
    />
  );

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
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarChartYAxisVariable,
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
      keys={FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA.map((obj) => obj.label)}
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
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis Line",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setLineChartYAxisVariable,
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
      yFormat={(y) => `${addCommaSeparator(y)} Financials`}
      unitKind="number"
    />
  );

  const cards = calendarView === "Daily"
    ? financialMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? financialMetricsCards.monthlyCards
    : financialMetricsCards.yearlyCards;

  const overviewCardsArr = PERT_SET.has(metricCategory)
    ? cards[metricCategory]
    : cards.profit;

  const overviewCards = overviewCardsArr.reduce((acc, card) => {
    const { heading = "Total" } = card;

    acc.set(heading as FinancialCardsAndStatisticsKeyPERT, card);

    return acc;
  }, new Map<FinancialCardsAndStatisticsKeyPERT, DashboardCardInfo>());

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "pert",
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateFinancialCardsAndStatistics(
    overviewCards,
    statisticsElementsMap,
  );

  return (
    <Stack>
      <DashboardBarLineLayout
        barChart={overviewBarChart}
        barChartHeading={barChartHeading}
        barChartYAxisSelectInput={barChartYAxisVariablesSelectInput}
        chartKind="bar"
        consolidatedCards={consolidatedCards}
        expandBarChartButton={expandBarChartButton}
        expandLineChartButton={expandLineChartButton}
        lineChart={overviewLineChart}
        lineChartHeading={lineChartHeading}
        lineChartYAxisSelectInput={lineChartYAxisVariablesSelectInput}
        sectionHeading={`${storeLocation} ${calendarView} Overview Financials`}
        semanticLabel={metricCategory}
      />
      {/* {financialMetricsOverview} */}
    </Stack>
  );
}

export default PERT;
