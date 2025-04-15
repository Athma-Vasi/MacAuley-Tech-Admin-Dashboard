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
    barLineRadialChartKind,
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

  const expandBarLineRadialChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText:
          `Expand and customize ${barLineRadialChartKind} chart`,
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
          }

          if (barLineRadialChartKind === "line") {
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
          }

          if (barLineRadialChartKind === "radial") {
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

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[yAxisKey]}
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
        radialBarChartData={lineCharts[yAxisKey]}
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
    yAxisKey,
  );

  const calendarUnitKind = yAxisKey === "revenue" ? "CAD" : "Units";

  const expandCalendarChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Expand and customize calendar chart",
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
        },
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
      barLineRadialChart={barLineRadialChart}
      barLineRadialChartKindSegmentedControl={barLineRadialChartKindSegmentedControl}
      calendarChart={calendarChart}
      calendarView={calendarView}
      consolidatedCards={cardsWithStatisticsElements}
      expandBarLineRadialChartButton={expandBarLineRadialChartButton}
      expandCalendarChartButton={expandCalendarChartButton}
      sectionHeading={splitCamelCase(metricsView)}
      semanticLabel="TODO"
      statisticsModals={statisticsModals}
      yAxisKey={yAxisKey}
      yAxisKeyChartHeading={yAxisKeyChartHeading}
      yAxisKeySelectInput={yAxisKeySelectInput}
      chartsToYAxisKeysMap={REPAIR_CHARTS_TO_Y_AXIS_KEYS_MAP}
    />
  );
}

export { RepairRUS };
