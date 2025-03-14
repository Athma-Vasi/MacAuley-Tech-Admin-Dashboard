import type React from "react";
import { useNavigate } from "react-router-dom";

import { globalAction } from "../../../context/globalProvider/actions";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../utils";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import { ResponsiveBarChart, ResponsiveLineChart } from "../../charts";
import DashboardMetricsLayout from "../DashboardMetricsLayout";
import { MONTHS } from "../constants";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../types";
import { returnChartTitleNavigateLinks, returnStatistics } from "../utils";
import type { RepairMetricsCards } from "./cards";
import type { RepairMetricsCharts } from "./chartsData";
import { REPAIR_METRICS_SUB_CATEGORY_DATA } from "./constants";
import type { RepairSubMetric } from "./types";

type RepairRUSProps = {
  calendarView: DashboardCalendarView;
  day: string;
  subMetric: RepairSubMetric;
  metricsView: DashboardMetricsView;
  month: string;
  repairMetricsCards: RepairMetricsCards;
  repairMetricsCharts: RepairMetricsCharts;
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

/** RUS: Revenue | Units Sold */
function RepairRUS({
  calendarView,
  repairMetricsCards,
  repairMetricsCharts,
  day,
  subMetric,
  metricsView,
  month,
  storeLocation,
  year,
}: RepairRUSProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const charts = calendarView === "Daily"
    ? repairMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? repairMetricsCharts.monthlyCharts
    : repairMetricsCharts.yearlyCharts;
  const { bar: barCharts, line: lineCharts } = charts;

  const statistics = returnStatistics(barCharts);

  const {
    barChartHeading,
    expandBarChartNavigateLink,
    expandLineChartNavigateLink,
    lineChartHeading,
  } = returnChartTitleNavigateLinks({
    calendarView,
    metricCategory: subMetric,
    metricsView,
    storeLocation,
    yAxisBarChartVariable: subMetric,
    yAxisLineChartVariable: subMetric,
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
              chartData: barCharts[subMetric],
              chartTitle: barChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandBarChartNavigateLink);
        },
      }}
    />
  );

  const overviewBarChart = (
    <ResponsiveBarChart
      barChartData={barCharts[subMetric]}
      hideControls
      indexBy={calendarView === "Daily"
        ? "Days"
        : calendarView === "Monthly"
        ? "Months"
        : "Years"}
      keys={REPAIR_METRICS_SUB_CATEGORY_DATA.map((obj) => obj.label)}
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
              chartData: lineCharts[subMetric],
              chartTitle: lineChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandLineChartNavigateLink);
        },
      }}
    />
  );

  const overviewLineChart = (
    <ResponsiveLineChart
      lineChartData={lineCharts[subMetric]}
      hideControls
      xFormat={(x) =>
        `${
          calendarView === "Daily"
            ? "Day"
            : calendarView === "Monthly"
            ? "Month"
            : "Year"
        } - ${x}`}
      yFormat={(y) => `${addCommaSeparator(y)} Repairs`}
      unitKind="number"
    />
  );

  const cards = calendarView === "Daily"
    ? repairMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? repairMetricsCards.monthlyCards
    : repairMetricsCards.yearlyCards;

  const repairMetricsOverview = (
    <DashboardMetricsLayout
      barChart={overviewBarChart}
      barChartHeading={barChartHeading}
      expandBarChartButton={expandBarChartButton}
      expandLineChartButton={expandLineChartButton}
      lineChart={overviewLineChart}
      lineChartHeading={lineChartHeading}
      overviewCards={cards}
      sectionHeading={`${storeLocation} ${calendarView} Overview Repairs`}
      statisticsMap={statistics}
    />
  );

  return repairMetricsOverview;
}

export { RepairRUS };
