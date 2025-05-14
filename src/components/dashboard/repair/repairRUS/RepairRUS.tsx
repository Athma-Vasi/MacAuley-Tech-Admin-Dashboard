import React from "react";
import { useNavigate } from "react-router-dom";

import { COLORS_SWATCHES } from "../../../../constants";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import {
  addCommaSeparator,
  returnThemeColors,
  splitCamelCase,
} from "../../../../utils";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsiveRadialBarChart,
} from "../../../charts";
import { createChartTooltipElement } from "../../../charts/utils";
import DashboardBarLineLayout from "../../DashboardLayoutContainer";
import type {
  AllStoreLocations,
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
  consolidateCardsAndStatisticsModals,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
} from "../../utilsTSX";
import { type RepairMetricsCards, returnRepairMetricsCards } from "../cards";
import {
  RepairMetricCalendarCharts,
  type RepairMetricsCharts,
  returnCalendarViewRepairCharts,
  returnSelectedRepairCalendarCharts,
} from "../chartsData";
import {
  REPAIR_CHARTS_TO_Y_AXIS_KEYS_MAP,
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
  repairOverviewCards: React.JSX.Element;
  storeLocation: AllStoreLocations;
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
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();
  const [repairRUSState, repairRUSDispatch] = React.useReducer(
    repairRUSReducer,
    initialRepairRUSState,
  );
  const {
    yAxisKey,
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
    calendarView,
    metricCategory: repairCategory,
    metricsView,
    yAxisKey,
  });

  const { yAxisKeyChartHeading } = returnChartTitles(
    {
      calendarView,
      metricCategory: repairCategory,
      storeLocation,
      yAxisKey,
    },
  );

  const barLineRadialChartUnit = yAxisKey === "revenue" ? "CAD" : "Units";
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
    yAxisKey,
    yAxisKeyChartHeading,
    year,
  };

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_SUB_CATEGORY_DATA,
        name: "Y-Axis",
        parentDispatch: repairRUSDispatch,
        validValueAction: repairRUSAction.setYAxisKey,
        value: yAxisKey,
      }}
    />
  );

  const barChart = (
    <ResponsiveBarChart
      barChartData={barCharts[yAxisKey]}
      hideControls
      indexBy={barChartIndexBy}
      keys={barChartKeys}
      chartUnitKind={barLineRadialChartUnit}
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandBarChartData,
          payload: {
            ...commonPayload,
            chartData: barCharts[yAxisKey],
            chartKind: "bar",
            chartUnitKind: barLineRadialChartUnit,
            indexBy: barChartIndexBy,
            keys: barChartKeys,
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "bar",
        });

        navigate(expandBarChartNavigateLink);
      }}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind: barLineRadialChartUnit,
          kind: "bar",
        })}
    />
  );

  const lineChart = (
    <ResponsiveLineChart
      chartUnitKind={barLineRadialChartUnit}
      lineChartData={lineCharts[yAxisKey]}
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
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandLineChartData,
          payload: {
            ...commonPayload,
            chartData: lineCharts[yAxisKey],
            chartKind: "line",
            chartUnitKind: barLineRadialChartUnit,
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "line",
        });

        navigate(expandLineChartNavigateLink);
      }}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          calendarView,
          chartUnitKind: barLineRadialChartUnit,
          kind: "line",
        })}
    />
  );

  const radialChart = (
    <ResponsiveRadialBarChart
      radialBarChartData={lineCharts[yAxisKey]}
      hideControls
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandRadialBarChartData,
          payload: {
            ...commonPayload,
            chartData: lineCharts[yAxisKey],
            chartKind: "radial",
            chartUnitKind: barLineRadialChartUnit,
          },
        });
        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "radial",
        });
        navigate(expandRadialBarChartNavigateLink);
      }}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          calendarView,
          chartUnitKind: barLineRadialChartUnit,
          kind: "radial",
        })}
    />
  );

  const calendarChartData = returnSelectedRepairCalendarCharts(
    calendarChartsData,
    yAxisKey,
  );

  const calendarUnitKind = yAxisKey === "revenue" ? "CAD" : "Units";

  const calendarChart = (
    <ResponsiveCalendarChart
      calendarChartData={calendarChartData}
      hideControls
      from={`${year}-01-01`}
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandCalendarChartData,
          payload: {
            ...commonPayload,
            chartData: calendarChartData,
            chartKind: "calendar",
            chartUnitKind: calendarUnitKind,
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "calendar",
        });

        navigate(expandCalendarChartNavigateLink);
      }}
      to={`${year}-12-31`}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind: calendarUnitKind,
          kind: "calendar",
          yAxisKey,
        })}
    />
  );

  const selectedCards = returnRepairMetricsCards(
    {
      calendarView,
      repairMetricsCards,
      repairYAxisKeyToCardsKeyMap: REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP,
      yAxisKey,
    },
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    yAxisKey,
    statisticsMap,
    storeLocation,
  );

  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Map<string, boolean>
  >(
    new Map([
      ["Revenue", false],
      ["Units Repaired", false],
    ]),
  );

  const consolidatedCards = consolidateCardsAndStatisticsModals({
    modalsOpenedState,
    selectedCards,
    setModalsOpenedState,
  });

  const { themeColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const statisticsModals = returnStatisticsModals(
    {
      modalsOpenedState,
      setModalsOpenedState,
      statisticsElementsMap,
      themeColorShade,
    },
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    yAxisKey,
    REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <DashboardBarLineLayout
      barChart={barChart}
      calendarChart={calendarChart}
      calendarView={calendarView}
      chartsToYAxisKeysMap={REPAIR_CHARTS_TO_Y_AXIS_KEYS_MAP}
      consolidatedCards={cardsWithStatisticsElements}
      lineChart={lineChart}
      radialChart={radialChart}
      sectionHeading={splitCamelCase(metricsView)}
      semanticLabel="TODO"
      statisticsModals={statisticsModals}
      yAxisKey={yAxisKey}
      yAxisKeyChartHeading={yAxisKeyChartHeading}
      yAxisKeySelectInput={yAxisKeySelectInput}
    />
  );
}

export { RepairRUS };
