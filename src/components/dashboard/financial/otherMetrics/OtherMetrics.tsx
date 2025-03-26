import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator, splitCamelCase } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsiveRadialBarChart,
} from "../../../charts";
import { createChartTooltipElement } from "../../../charts/utils";
import { CHART_KIND_DATA } from "../../constants";
import DashboardBarLineLayout from "../../DashboardBarLineLayout";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import {
  createExpandChartNavigateLinks,
  returnChartTitles,
  returnSelectedCalendarCharts,
  returnStatistics,
} from "../../utils";
import {
  consolidateCardsAndStatistics,
  createFinancialStatisticsElements,
  returnCardElementsForYAxisVariable,
} from "../../utilsTSX";
import {
  type FinancialMetricsCards,
  returnFinancialMetricsCards,
} from "../cards";
import {
  type FinancialMetricsCalendarCharts,
  type FinancialMetricsCharts,
} from "../chartsData";
import {
  FINANCIAL_OTHERS_Y_AXIS_DATA,
  FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  MONEY_SYMBOL_CATEGORIES,
} from "../constants";
import type { FinancialMetricCategory } from "../types";
import { otherMetricsAction } from "./actions";
import { otherMetricsReducer } from "./reducers";
import { initialOtherMetricsState } from "./state";

type OtherMetricsProps = {
  calendarChartsData: {
    currentYear: FinancialMetricsCalendarCharts | null;
    previousYear: FinancialMetricsCalendarCharts | null;
  };
  calendarView: DashboardCalendarView;
  financialMetricsCards: FinancialMetricsCards;
  financialMetricsCharts: FinancialMetricsCharts;
  day: string;
  metricCategory: FinancialMetricCategory;
  metricsView: DashboardMetricsView;
  month: string;
  otherMetricsOverviewCards: {
    averageOrderValue: React.JSX.Element;
    conversionRate: React.JSX.Element;
    netProfitMargin: React.JSX.Element;
  };
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

function OtherMetrics({
  calendarChartsData,
  calendarView,
  financialMetricsCards,
  financialMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  otherMetricsOverviewCards,
  storeLocation,
  year,
}: OtherMetricsProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [otherMetricsState, otherMetricsDispatch] = React.useReducer(
    otherMetricsReducer,
    initialOtherMetricsState,
  );

  const {
    barLineRadialChartYAxis,
    barLineRadialChartKind,
    calendarChartYAxis,
  } = otherMetricsState;

  const charts = calendarView === "Daily"
    ? financialMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? financialMetricsCharts.monthlyCharts
    : financialMetricsCharts.yearlyCharts;
  const {
    otherMetrics: { bar: barCharts, line: lineCharts },
  } = charts;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks({
    barLineRadialChartYAxis,
    calendarChartYAxis,
    calendarView,
    metricCategory,
    metricsView,
  });

  const { barLineRadialChartHeading, calendarChartHeading } = returnChartTitles(
    {
      barLineRadialChartYAxis,
      calendarView,
      metricCategory,
      storeLocation,
      calendarChartYAxis,
    },
  );

  const barLineRadialChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setBarLineRadialChartKind,
        value: barLineRadialChartKind,
        defaultValue: "bar",
      }}
    />
  );

  const barLineRadialUnit = barLineRadialChartYAxis === "averageOrderValue"
    ? "CAD"
    : "%";
  const barChartIndexBy = calendarView === "Daily"
    ? "Days"
    : calendarView === "Monthly"
    ? "Months"
    : "Years";
  const barChartKeys = FINANCIAL_OTHERS_Y_AXIS_DATA.map((obj) => obj.label);
  const commonPayload = {
    calendarView,
    day,
    month,
    year,
  };

  const expandBarLineRadialChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Expand and customize chart",
        kind: "expand",
        onClick: (
          _event:
            | React.MouseEvent<HTMLButtonElement>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          if (barLineRadialChartKind === "bar") {
            globalDispatch({
              action: globalAction.setExpandBarChartData,
              payload: {
                ...commonPayload,
                chartKind: "bar",
                chartData: barCharts[barLineRadialChartYAxis],
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialUnit,
                indexBy: barChartIndexBy,
                keys: barChartKeys,
              },
            });
          }

          if (barLineRadialChartKind === "line") {
            globalDispatch({
              action: globalAction.setExpandLineChartData,
              payload: {
                ...commonPayload,
                chartKind: "line",
                chartData: lineCharts[barLineRadialChartYAxis],
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialUnit,
              },
            });
          }

          if (barLineRadialChartKind === "radial") {
            globalDispatch({
              action: globalAction.setExpandRadialBarChartData,
              payload: {
                ...commonPayload,
                chartKind: "radial",
                chartData: lineCharts[barLineRadialChartYAxis],
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialUnit,
              },
            });
          }

          navigate(
            barLineRadialChartKind === "bar"
              ? expandBarChartNavigateLink
              : barLineRadialChartKind === "line"
              ? expandLineChartNavigateLink
              : expandRadialBarChartNavigateLink,
          );
        },
      }}
    />
  );

  const barLineRadialChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setBarLineRadialChartYAxis,
        value: barLineRadialChartYAxis,
      }}
    />
  );

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[barLineRadialChartYAxis]}
        chartUnitKind={barLineRadialUnit}
        hideControls
        indexBy={barChartIndexBy}
        keys={barChartKeys}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind: barLineRadialUnit,
            kind: "bar",
          })}
      />
    )
    : barLineRadialChartKind === "line"
    ? (
      <ResponsiveLineChart
        chartUnitKind={barLineRadialUnit}
        lineChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
        xFormat={(x) =>
          `${
            calendarView === "Daily"
              ? "Day - "
              : calendarView === "Yearly"
              ? "Year - "
              : ""
          }${x}`}
        yFormat={(y) => addCommaSeparator(y) + barLineRadialUnit}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            calendarView,
            chartUnitKind: barLineRadialUnit,
            kind: "line",
          })}
      />
    )
    : (
      <ResponsiveRadialBarChart
        radialBarChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind: barLineRadialUnit,
            kind: "radial",
          })}
      />
    );

  const calendarChartData = returnSelectedCalendarCharts(
    calendarChartsData,
    calendarChartYAxis,
    metricCategory,
  );

  const calendarUnit = calendarChartYAxis === "averageOrderValue" ? "CAD" : "%";

  const expandCalendarChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Expand and customize chart",
        kind: "expand",
        onClick: (
          _event:
            | React.MouseEvent<HTMLButtonElement>
            | React.PointerEvent<HTMLButtonElement>,
        ) => {
          globalDispatch({
            action: globalAction.setExpandCalendarChartData,
            payload: {
              ...commonPayload,
              calendarChartYAxis,
              chartKind: "calendar",
              chartData: calendarChartData,
              chartTitle: calendarChartHeading,
              chartUnitKind: calendarUnit,
            },
          });

          navigate(expandCalendarChartNavigateLink);
        },
      }}
    />
  );

  const calendarChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setCalendarChartYAxis,
        value: calendarChartYAxis,
      }}
    />
  );

  const calendarChart = (
    <ResponsiveCalendarChart
      calendarChartData={calendarChartData}
      hideControls
      from={`${year}-01-01`}
      to={`${year}-12-31`}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          calendarChartYAxis,
          chartUnitKind: calendarUnit,
          kind: "calendar",
        })}
    />
  );

  const selectedCards = returnFinancialMetricsCards(
    financialMetricsCards,
    calendarView,
    metricCategory,
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "otherMetrics",
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    selectedCards,
    statisticsElementsMap,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineRadialChartYAxis,
    FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  const overviewCards = (
    <>
      {otherMetricsOverviewCards.netProfitMargin}
      {otherMetricsOverviewCards.averageOrderValue}
      {otherMetricsOverviewCards.conversionRate}
    </>
  );

  const otherMetrics = (
    <DashboardBarLineLayout
      barLineRadialChart={barLineRadialChart}
      barLineRadialChartHeading={barLineRadialChartHeading}
      barLineRadialChartKindSegmentedControl={barLineRadialChartKindSegmentedControl}
      barLineRadialChartYAxisSelectInput={barLineRadialChartYAxisSelectInput}
      barLineRadialChartYAxis={barLineRadialChartYAxis}
      calendarChart={calendarChart}
      calendarChartHeading={calendarChartHeading}
      calendarChartYAxisSelectInput={calendarChartYAxisSelectInput}
      calendarView={calendarView}
      cardsWithStatisticsElements={cardsWithStatisticsElements}
      expandBarLineRadialChartButton={expandBarLineRadialChartButton}
      expandCalendarChartButton={expandCalendarChartButton}
      overviewCards={overviewCards}
      sectionHeading={splitCamelCase(metricsView)}
      semanticLabel="TODO"
    />
  );

  return (
    <Stack>
      {otherMetrics}
    </Stack>
  );
}

export default OtherMetrics;
