import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { CustomizeChartsPageData } from "../../../../context/globalProvider/types";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import { ResponsiveBarChart, ResponsiveLineChart } from "../../../charts";
import { CHART_KIND_DATA } from "../../constants";
import DashboardBarLineLayout from "../../DashboardBarLineLayout";
import type {
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import { returnStatistics } from "../../utils";
import {
  consolidateFinancialCardsAndStatistics,
  createFinancialStatisticsElements,
  DashboardCardInfo,
} from "../../utilsTSX";
import type { FinancialMetricsCards } from "../cards";
import type {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
} from "../chartsData";
import {
  FINANCIAL_OTHERS_Y_AXIS_DATA,
  MONEY_SYMBOL_CATEGORIES,
} from "../constants";
import { pertAction } from "../pert/actions";
import type {
  FinancialCardsAndStatisticsKeyOtherMetrics,
  FinancialMetricCategory,
} from "../types";
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
  storeLocation,
  year,
}: OtherMetricsProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [otherMetricsState, otherMetricsDispatch] = React.useReducer(
    otherMetricsReducer,
    initialOtherMetricsState,
  );

  const { barLineChartYAxisVariable, barLineChartKind } = otherMetricsState;

  const charts = calendarView === "Daily"
    ? financialMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? financialMetricsCharts.monthlyCharts
    : financialMetricsCharts.yearlyCharts;
  const {
    otherMetrics: { bar: barCharts, line: lineCharts },
  } = charts;

  const barLineChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: otherMetricsDispatch,
        validValueAction: pertAction.setBarLineChartKind,
        value: barLineChartKind,
        defaultValue: "bar",
      }}
    />
  );

  // const {
  //   barChartHeading,
  //   expandBarChartNavigateLink,
  //   expandLineChartNavigateLink,
  //   lineChartHeading,
  //   pieChartHeading,
  // } = returnChartTitleNavigateLinks({
  //   calendarView,
  //   metricCategory,
  //   metricsView,
  //   storeLocation,
  //   yAxisBarChartVariable: barLineChartYAxisVariable,
  //   yAxisLineChartVariable: lineChartYAxisVariable,
  //   year,
  //   day,
  //   month,
  //   months: MONTHS,
  // });

  const expandBarLineChartButton = (
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
            action: globalAction.setCustomizeChartsPageData,
            payload: {
              chartKind: barLineChartKind,
              chartData: barCharts[barLineChartYAxisVariable],
              chartTitle: "TODO",
              chartUnitKind: "number",
            } as CustomizeChartsPageData,
          });

          // navigate(expandBarChartNavigateLink);
        },
      }}
    />
  );

  const barLineChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setBarLineChartYAxisVariable,
        value: barLineChartYAxisVariable,
      }}
    />
  );

  const barLineChart = barLineChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[barLineChartYAxisVariable]}
        hideControls
        indexBy={calendarView === "Daily"
          ? "Days"
          : calendarView === "Monthly"
          ? "Months"
          : "Years"}
        keys={FINANCIAL_OTHERS_Y_AXIS_DATA.map((obj) => obj.label)}
        unitKind="number"
      />
    )
    : (
      <ResponsiveLineChart
        lineChartData={lineCharts[barLineChartYAxisVariable]}
        hideControls
        xFormat={(x) =>
          `${
            calendarView === "Daily"
              ? "Day"
              : calendarView === "Monthly"
              ? "Month"
              : "Year"
          } - ${x}`}
        yFormat={(y) =>
          `${MONEY_SYMBOL_CATEGORIES.has(metricCategory) ? "CAD" : ""} ${
            addCommaSeparator(y)
          }`}
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
      barLineChart={barLineChart}
      barLineChartHeading={"TODO"}
      barLineChartKindSegmentedControl={barLineChartKindSegmentedControl}
      barLineChartYAxisSelectInput={barLineChartYAxisVariablesSelectInput}
      barLineChartYAxisVariable={barLineChartYAxisVariable}
      calendarChartsData={calendarChartsData}
      consolidatedCards={consolidatedCards}
      expandBarLineChartButton={expandBarLineChartButton}
      sectionHeading="TODO"
      semanticLabel="TODO"
    />
  );

  // const financialMetricsOverview = (
  //   <DashboardMetricsLayout
  //     barChart={overviewBarChart}
  //     barChartHeading={barChartHeading}
  //     barChartYAxisSelectInput={barLineChartYAxisVariablesSelectInput}
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
