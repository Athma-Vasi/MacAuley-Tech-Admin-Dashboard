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
import type { ProductMetricsCards } from "../../product/cards";
import type { ProductMetricsCharts } from "../../product/chartsData";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import { returnChartTitleNavigateLinks, returnStatistics } from "../../utils";
import { PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA } from "../constants";
import type { ProductSubMetric } from "../types";
import { rusAction } from "./actions";
import { rusReducer } from "./reducers";
import { initialRUSState } from "./state";

type RUSProps = {
  borderColor: string;
  calendarView: DashboardCalendarView;
  chartHeight: number;
  chartWidth: number;
  day: string;
  subMetric: ProductSubMetric;
  metricsView: DashboardMetricsView;
  month: string;
  productMetricsCards: ProductMetricsCards;
  productMetricsCharts: ProductMetricsCharts;
  storeLocation: BusinessMetricStoreLocation;
  width: number;
  year: Year;
};

/** RUS: Revenue | Units Sold */
function RUS({
  borderColor,
  calendarView,
  chartHeight,
  chartWidth,
  productMetricsCards,
  productMetricsCharts,
  day,
  subMetric,
  metricsView,
  month,
  storeLocation,
  width,
  year,
}: RUSProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [rusState, rusDispatch] = React.useReducer(rusReducer, initialRUSState);

  const { barChartYAxisVariable, lineChartYAxisVariable } = rusState;

  const charts = calendarView === "Daily"
    ? productMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? productMetricsCharts.monthlyCharts
    : productMetricsCharts.yearlyCharts;
  const {
    bar: barCharts,
    line: lineCharts,
    pie: pieCharts,
  } = subMetric === "revenue" ? charts.revenue : charts.unitsSold;

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
    metricCategory: subMetric,
    metricsView,
    storeLocation,
    yAxisBarChartVariable: barChartYAxisVariable,
    yAxisLineChartVariable: lineChartYAxisVariable,
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
        data: PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA as any,
        name: "Y-Axis Bar",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setBarChartYAxisVariable,
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
      keys={PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA.map((obj) => obj.label)}
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
        data: PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA as any,
        name: "Y-Axis Line",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setLineChartYAxisVariable,
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
      yFormat={(y) => `${addCommaSeparator(y)} Products`}
      unitKind="number"
    />
  );

  const cards = calendarView === "Daily"
    ? productMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? productMetricsCards.monthlyCards
    : productMetricsCards.yearlyCards;
  const overviewCards = subMetric === "revenue"
    ? cards.revenue
    : cards.unitsSold;

  const productMetricsOverview = (
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
      sectionHeading={`${storeLocation} ${calendarView} Overview Products`}
      statisticsMap={statistics}
      width={width}
    />
  );

  return productMetricsOverview;
}

export { RUS };
