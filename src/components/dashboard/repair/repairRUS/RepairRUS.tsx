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
import type { RepairMetricCategory } from "../types";
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
  repairCategory: RepairMetricCategory;
  repairMetricsCards: RepairMetricsCards;
  repairMetricsCharts: RepairMetricsCharts;
  repairOverviewCards: {
    repairRevenueOverviewCard: React.JSX.Element;
    repairUnitsOverviewCard: React.JSX.Element;
  };
  storeLocation: BusinessMetricStoreLocation;
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
    repairCategory,
    repairMetricsCards,
    repairMetricsCharts,
    repairOverviewCards,
    storeLocation,
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
    barLineRadialChartKind,
    barLineRadialChartYAxis,
    calendarChartYAxis,
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
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks({
    barLineRadialChartYAxis,
    calendarView,
    metricCategory: repairCategory,
    metricsView,
    calendarChartYAxis,
  });

  const { barLineRadialChartHeading, calendarChartHeading } = returnChartTitles(
    {
      barLineRadialChartYAxis,
      calendarView,
      metricCategory: repairCategory,
      storeLocation,
      calendarChartYAxis,
    },
  );

  const barLineRadialChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setBarLineRadialChartKind,
        value: barLineRadialChartKind,
        defaultValue: "bar",
      }}
    />
  );

  const barLineRadialChartUnit = barLineRadialChartYAxis === "revenue"
    ? "CAD"
    : "Units";
  const barChartIndexBy = calendarView === "Daily"
    ? "Days"
    : calendarView === "Monthly"
    ? "Months"
    : "Years";
  const barChartKeys = REPAIR_METRICS_SUB_CATEGORY_DATA.map((obj) => obj.label);
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
                chartData: barCharts[barLineRadialChartYAxis],
                chartKind: "bar",
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialChartUnit,
                indexBy: barChartIndexBy,
                keys: barChartKeys,
              },
            });

            globalDispatch({
              action: globalAction.setSelectedChartKind,
              payload: "bar",
            });
          }

          if (barLineRadialChartKind === "line") {
            globalDispatch({
              action: globalAction.setExpandLineChartData,
              payload: {
                ...commonPayload,
                chartData: lineCharts[barLineRadialChartYAxis],
                chartKind: "line",
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialChartUnit,
              },
            });

            globalDispatch({
              action: globalAction.setSelectedChartKind,
              payload: "line",
            });
          }

          if (barLineRadialChartKind === "radial") {
            globalDispatch({
              action: globalAction.setExpandRadialBarChartData,
              payload: {
                ...commonPayload,
                chartData: lineCharts[barLineRadialChartYAxis],
                chartKind: "radial",
                chartTitle: barLineRadialChartHeading,
                chartUnitKind: barLineRadialChartUnit,
              },
            });

            globalDispatch({
              action: globalAction.setSelectedChartKind,
              payload: "radial",
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
        data: REPAIR_METRICS_SUB_CATEGORY_DATA,
        name: "Y-Axis",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setBarLineRadialChartYAxis,
        value: barLineRadialChartYAxis,
      }}
    />
  );

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[barLineRadialChartYAxis]}
        hideControls
        indexBy={barChartIndexBy}
        keys={barChartKeys}
        chartUnitKind={barLineRadialChartUnit}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind: barLineRadialChartUnit,
            kind: "bar",
          })}
      />
    )
    : barLineRadialChartKind === "line"
    ? (
      <ResponsiveLineChart
        chartUnitKind={barLineRadialChartUnit}
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
        yFormat={(y) => addCommaSeparator(y) + barLineRadialChartUnit}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            calendarView,
            chartUnitKind: barLineRadialChartUnit,
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
            chartUnitKind: barLineRadialChartUnit,
            kind: "radial",
          })}
      />
    );

  const calendarChartData = returnSelectedRepairCalendarCharts(
    calendarChartsData,
    calendarChartYAxis,
  );

  const calendarUnitKind = calendarChartYAxis === "revenue" ? "CAD" : "Units";

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
              chartData: calendarChartData,
              chartKind: "calendar",
              chartTitle: calendarChartHeading,
              chartUnitKind: calendarUnitKind,
            },
          });

          globalDispatch({
            action: globalAction.setSelectedChartKind,
            payload: "calendar",
          });

          navigate(expandCalendarChartNavigateLink);
        },
      }}
    />
  );

  const calendarChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_SUB_CATEGORY_DATA,
        name: "Y-Axis",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setCalendarChartYAxis,
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
          chartUnitKind: calendarUnitKind,
          kind: "calendar",
        })}
    />
  );

  const selectedCards = returnRepairMetricsCards(
    repairMetricsCards,
    calendarView,
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    barLineRadialChartYAxis,
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
    </Stack>
  );
}

export { RepairRUS };
