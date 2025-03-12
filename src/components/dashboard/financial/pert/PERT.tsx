import React from "react";
import { useNavigate } from "react-router-dom";

import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks";
import { addCommaSeparator } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
} from "../../../charts";
import DashboardMetricsLayout from "../../DashboardMetricsLayout";
import { MONTHS } from "../../constants";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import { returnChartTitleNavigateLinks, returnStatistics } from "../../utils";
import {
  type FinancialMetricsCards,
  returnCalendarViewFinancialCards,
} from "../cards";
import {
  type FinancialMetricsCharts,
  returnCalendarViewFinancialCharts,
} from "../chartsData";
import {
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  PERT_SET,
} from "../constants";
import type { FinancialMetricCategory } from "../types";
import { pertAction } from "./actions";
import { pertReducer } from "./reducers";
import { initialPERTState } from "./state";

type PERTProps = {
  borderColor: string;
  calendarView: DashboardCalendarView;
  chartHeight: number;
  chartWidth: number;
  financialMetricsCards: FinancialMetricsCards;
  financialMetricsCharts: FinancialMetricsCharts;
  day: string;
  metricCategory: FinancialMetricCategory;
  metricsView: DashboardMetricsView;
  month: string;
  storeLocation: BusinessMetricStoreLocation;
  width: number;
  year: Year;
};
/** PERT = Profit | Expenses | Revenue | Transactions */
function PERT({
  borderColor,
  calendarView,
  chartHeight,
  chartWidth,
  financialMetricsCards,
  financialMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  width,
  year,
}: PERTProps) {
  const { globalDispatch } = useGlobalState();
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
    ]) // cast to avoid TS error
    : charts.profit;

  console.group("PERT");
  console.log({ pertState });
  console.log({ charts });
  console.log({ barCharts });
  console.log({ lineCharts });
  console.log({ pieCharts });
  console.groupEnd();

  const statistics = returnStatistics(barCharts);

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
        data: FINANCIAL_PERT_PIE_Y_AXIS_DATA as any,
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
      chartHeight={chartHeight}
      chartWidth={chartWidth}
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
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA as any,
        name: "Y-Axis Bar",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarChartYAxisVariable,
        value: barChartYAxisVariable,
      }}
    />
  );

  const overviewBarChart = (
    <ResponsiveBarChart
      chartHeight={chartHeight}
      chartWidth={chartWidth}
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
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA as any,
        name: "Y-Axis Line",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setLineChartYAxisVariable,
        value: lineChartYAxisVariable,
      }}
    />
  );

  const overviewLineChart = (
    <ResponsiveLineChart
      chartHeight={chartHeight}
      chartWidth={chartWidth}
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

  const cards = returnCalendarViewFinancialCards(
    calendarView,
    financialMetricsCards,
  );
  const overviewCards = PERT_SET.has(metricCategory)
    ? cards[metricCategory]
    : cards.profit;

  const financialMetricsOverview = (
    <DashboardMetricsLayout
      barChart={overviewBarChart}
      barChartHeading={barChartHeading}
      barChartYAxisSelectInput={barChartYAxisVariablesSelectInput}
      borderColor={borderColor}
      expandBarChartButton={expandBarChartButton}
      expandLineChartButton={expandLineChartButton}
      expandPieChartButton={expandPieChartButton}
      lineChart={overviewLineChart}
      lineChartHeading={lineChartHeading}
      lineChartYAxisSelectInput={lineChartYAxisVariablesSelectInput}
      overviewCards={overviewCards}
      pieChart={overviewPieChart}
      pieChartHeading={pieChartHeading}
      pieChartYAxisSelectInput={pieChartYAxisVariableSelectInput}
      sectionHeading={`${storeLocation} ${calendarView} Overview Financials`}
      semanticLabel={metricCategory}
      statisticsMap={statistics}
      width={width}
    />
  );

  return financialMetricsOverview;
}

export default PERT;
