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
  type CustomerMetricsCards,
  returnCalendarViewCustomerCards,
} from "../cards";
import {
  type CustomerMetricsCharts,
  type CustomerMetricsChurnRetentionChartsKey,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
} from "../constants";
import type { CustomerMetricsCategory } from "../types";
import { churnRetentionAction } from "./actions";
import { churnRetentionReducer } from "./reducers";
import { initialChurnRetentionState } from "./state";

type ChurnRetentionProps = {
  borderColor: string;
  calendarView: DashboardCalendarView;
  chartHeight: number;
  chartWidth: number;
  customerMetricsCards: CustomerMetricsCards;
  customerMetricsCharts: CustomerMetricsCharts;
  day: string;
  metricCategory: CustomerMetricsCategory;
  metricsView: DashboardMetricsView;
  month: string;
  storeLocation: BusinessMetricStoreLocation;
  width: number;
  year: Year;
};

function ChurnRetention({
  borderColor,
  calendarView,
  chartHeight,
  chartWidth,
  customerMetricsCards,
  customerMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  width,
  year,
}: ChurnRetentionProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [churnRetentionState, churnRetentionDispatch] = React.useReducer(
    churnRetentionReducer,
    initialChurnRetentionState,
  );

  const {
    churnRetentionBarChartYAxisVariable,
    churnRetentionLineChartYAxisVariable,
  } = churnRetentionState;

  const charts = returnCalendarViewCustomerCharts(
    calendarView,
    customerMetricsCharts,
  );
  const {
    churnRetention: { bar: barCharts, line: lineCharts, pie: pieCharts },
  } = charts;

  const statistics = returnStatistics<CustomerMetricsChurnRetentionChartsKey>(
    barCharts,
  );

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
    yAxisBarChartVariable: churnRetentionBarChartYAxisVariable,
    yAxisLineChartVariable: churnRetentionLineChartYAxisVariable,
    year,
    day,
    month,
    months: MONTHS,
  });

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
              chartData: pieCharts,
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
      pieChartData={pieCharts}
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
              chartData: barCharts[churnRetentionBarChartYAxisVariable],
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
        data: CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA as any,
        name: "Y-Axis Bar",
        parentDispatch: churnRetentionDispatch,
        validValueAction:
          churnRetentionAction.setChurnRetentionBarChartYAxisVariable,
        value: churnRetentionBarChartYAxisVariable,
      }}
    />
  );

  const overviewBarChart = (
    <ResponsiveBarChart
      chartHeight={chartHeight}
      chartWidth={chartWidth}
      barChartData={barCharts[churnRetentionBarChartYAxisVariable]}
      hideControls
      indexBy={calendarView === "Daily"
        ? "Days"
        : calendarView === "Monthly"
        ? "Months"
        : "Years"}
      keys={CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA.map((obj) => obj.label)}
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
              chartData: lineCharts[churnRetentionLineChartYAxisVariable],
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
        data: CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA as any,
        name: "Y-Axis Line",
        parentDispatch: churnRetentionDispatch,
        validValueAction:
          churnRetentionAction.setChurnRetentionLineChartYAxisVariable,
        value: churnRetentionLineChartYAxisVariable,
      }}
    />
  );

  const overviewLineChart = (
    <ResponsiveLineChart
      chartHeight={chartHeight}
      chartWidth={chartWidth}
      lineChartData={lineCharts[churnRetentionLineChartYAxisVariable]}
      hideControls
      xFormat={(x) =>
        `${
          calendarView === "Daily"
            ? "Day"
            : calendarView === "Monthly"
            ? "Month"
            : "Year"
        } - ${x}`}
      yFormat={(y) => `${addCommaSeparator(y)} Customers`}
      unitKind="number"
    />
  );

  const cards = returnCalendarViewCustomerCards(
    calendarView,
    customerMetricsCards,
  );
  const overviewCards = metricCategory === "new" ? cards.new : cards.returning;

  const customerMetricsOverview = (
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
      sectionHeading={`${storeLocation} ${calendarView} Overview Customers`}
      statisticsMap={statistics}
      width={width}
    />
  );

  return customerMetricsOverview;
}

export { ChurnRetention };
