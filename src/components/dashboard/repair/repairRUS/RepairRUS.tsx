import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { CustomizeChartsPageData } from "../../../../context/globalProvider/types";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator, splitCamelCase } from "../../../../utils";
import { AccessibleButton } from "../../../accessibleInputs/AccessibleButton";
import { AccessibleSegmentedControl } from "../../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
} from "../../../charts";
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
  returnStatistics,
} from "../../utils";
import {
  consolidateCardsAndStatistics,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
} from "../../utilsTSX";
import { type RepairMetricsCards, returnRepairMetricsCards } from "../cards";
import {
  RepairMetricCalendarCharts,
  type RepairMetricsCharts,
  returnCalendarViewRepairCharts,
  returnSelectedRepairCalendarCharts,
} from "../chartsData";
import {
  REPAIR_METRICS_SUB_CATEGORY_DATA,
  REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "../constants";
import type { RepairSubMetric } from "../types";
import { repairRUSAction } from "./actions";
import { repairRUSReducer } from "./reducers";
import { initialRepairRUSState } from "./state";

type RepairRUSProps = {
  calendarChartsData: {
    currentYear: RepairMetricCalendarCharts | null;
    previousYear: RepairMetricCalendarCharts | null;
  };
  calendarView: DashboardCalendarView;
  day: string;
  metricsView: DashboardMetricsView;
  month: string;
  repairMetricsCards: RepairMetricsCards;
  repairMetricsCharts: RepairMetricsCharts;
  repairOverviewCards: {
    repairRevenueOverviewCard: React.JSX.Element;
    repairUnitsOverviewCard: React.JSX.Element;
  };
  storeLocation: BusinessMetricStoreLocation;
  subMetric: RepairSubMetric;
  year: Year;
};

/** RUS: Revenue | Units Sold */
function RepairRUS(
  {
    calendarChartsData,
    calendarView,
    day,
    metricsView,
    month,
    repairMetricsCards,
    repairMetricsCharts,
    repairOverviewCards,
    storeLocation,
    subMetric,
    year,
  }: RepairRUSProps,
) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();
  const [repairRUSState, repairRUSDispatch] = React.useReducer(
    repairRUSReducer,
    initialRepairRUSState,
  );
  const {
    barLineChartKind,
    barLineChartYAxisVariable,
    calendarChartYAxisVariable,
  } = repairRUSState;

  const charts = returnCalendarViewRepairCharts(
    calendarView,
    repairMetricsCharts,
  );
  const { bar: barCharts, line: lineCharts } = charts;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
  } = createExpandChartNavigateLinks(metricsView, calendarView, subMetric);

  const { barLineChartHeading, calendarChartHeading } = returnChartTitles({
    barLineChartYAxisVariable,
    calendarView,
    metricCategory: subMetric,
    storeLocation,
    calendarChartYAxisVariable,
  });

  const barLineChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setBarLineChartKind,
        value: barLineChartKind,
        defaultValue: "bar",
      }}
    />
  );

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
              chartData: barLineChartKind === "bar"
                ? barCharts[subMetric]
                : lineCharts[subMetric],
              chartTitle: barLineChartHeading,
              chartUnitKind: "number",
            } as CustomizeChartsPageData,
          });

          navigate(
            barLineChartKind === "bar"
              ? expandBarChartNavigateLink
              : expandLineChartNavigateLink,
          );
        },
      }}
    />
  );

  const barLineChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_SUB_CATEGORY_DATA,
        name: "Y-Axis Bar",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setBarLineChartYAxisVariable,
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
        keys={REPAIR_METRICS_SUB_CATEGORY_DATA.map((obj) => obj.label)}
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
          `${addCommaSeparator(y)} ${
            subMetric === "revenue" ? "CAD" : "Units"
          }`}
        unitKind="number"
      />
    );

  const calendarChartData = returnSelectedRepairCalendarCharts(
    calendarChartsData,
    calendarChartYAxisVariable,
  );

  const expandCalendarChartButton = calendarView === "Yearly"
    ? (
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
                chartKind: "calendar",
                chartData: calendarChartData,
                chartTitle: calendarChartHeading,
                chartUnitKind: "number",
              } as CustomizeChartsPageData,
            });

            navigate(expandCalendarChartNavigateLink);
          },
        }}
      />
    )
    : null;

  const calendarChartYAxisVariableSelectInput = calendarView === "Yearly"
    ? (
      <AccessibleSelectInput
        attributes={{
          data: REPAIR_METRICS_SUB_CATEGORY_DATA,
          name: "Y-Axis Pie",
          parentDispatch: repairRUSDispatch,
          validValueAction: repairRUSAction.setCalendarChartYAxisVariable,
          value: calendarChartYAxisVariable,
        }}
      />
    )
    : null;

  const calendarChart = calendarView === "Yearly"
    ? (
      <ResponsiveCalendarChart
        calendarChartData={calendarChartData}
        hideControls
        from={`${year}-01-01`}
        to={`${year}-12-31`}
      />
    )
    : null;

  const selectedCards = returnRepairMetricsCards(
    repairMetricsCards,
    calendarView,
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    subMetric,
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    selectedCards,
    statisticsElementsMap,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineChartYAxisVariable,
    REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  const overviewCards = (
    <>
      {repairOverviewCards.repairRevenueOverviewCard}
      {repairOverviewCards.repairUnitsOverviewCard}
    </>
  );

  return (
    <Stack>
      <DashboardBarLineLayout
        barLineChart={barLineChart}
        barLineChartHeading={barLineChartHeading}
        barLineChartKindSegmentedControl={barLineChartKindSegmentedControl}
        barLineChartYAxisSelectInput={barLineChartYAxisVariablesSelectInput}
        barLineChartYAxisVariable={barLineChartYAxisVariable}
        calendarChart={calendarChart}
        calendarChartHeading={calendarChartHeading}
        calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
        calendarView={calendarView}
        cardsWithStatisticsElements={cardsWithStatisticsElements}
        expandBarLineChartButton={expandBarLineChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        overviewCards={overviewCards}
        sectionHeading={splitCamelCase(metricsView)}
        semanticLabel="TODO"
      />
    </Stack>
  );
}

export { RepairRUS };
