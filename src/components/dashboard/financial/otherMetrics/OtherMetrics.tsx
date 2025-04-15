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
  returnSelectedCalendarCharts,
  returnStatistics,
} from "../../utils";
import {
  consolidateCardsAndStatisticsModals,
  createFinancialStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
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
  FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP,
  FINANCIAL_OTHERS_Y_AXIS_DATA,
  FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
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
  otherMetricsOverviewCards: React.JSX.Element;
  storeLocation: AllStoreLocations;
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
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [otherMetricsState, otherMetricsDispatch] = React.useReducer(
    otherMetricsReducer,
    initialOtherMetricsState,
  );

  const {
    barLineRadialChartKind,
    yAxisKey,
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
    calendarView,
    metricCategory,
    metricsView,
    yAxisKey,
  });

  const { yAxisKeyChartHeading } = returnChartTitles(
    {
      calendarView,
      metricCategory,
      storeLocation,
      yAxisKey,
    },
  );

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_OTHERS_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: otherMetricsDispatch,
        validValueAction: otherMetricsAction.setYAxisKey,
        value: yAxisKey,
      }}
    />
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

  const barLineRadialUnit = yAxisKey === "averageOrderValue" ? "CAD" : "%";
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
    yAxisKey,
    yAxisKeyChartHeading,
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
                chartKind: "bar",
                chartData: barCharts[yAxisKey],
                chartUnitKind: barLineRadialUnit,
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
                chartKind: "line",
                chartData: lineCharts[yAxisKey],
                chartUnitKind: barLineRadialUnit,
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
                chartKind: "radial",
                chartData: lineCharts[yAxisKey],
                chartUnitKind: barLineRadialUnit,
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

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[yAxisKey]}
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
        radialBarChartData={lineCharts[yAxisKey]}
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
    yAxisKey,
    metricCategory,
  );

  const calendarUnit = yAxisKey === "averageOrderValue" ? "CAD" : "%";

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
              chartKind: "calendar",
              chartData: calendarChartData,
              chartUnitKind: calendarUnit,
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
          chartUnitKind: calendarUnit,
          kind: "calendar",
          yAxisKey,
        })}
    />
  );

  const selectedCards = returnFinancialMetricsCards(
    {
      calendarView,
      financialMetricsCards,
      financialYAxisKeyToCardsKeyMap: FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
      metricCategory,
      yAxisKey,
    },
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "otherMetrics",
    statisticsMap,
    storeLocation,
  );

  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Map<string, boolean>
  >(
    new Map([
      ["Net Profit Margin", false],
      ["Average Order Value", false],
      ["Conversion Rate", false],
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
    FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  const otherMetrics = (
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
      chartsToYAxisKeysMap={FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP}
    />
  );

  return otherMetrics;
}

export default OtherMetrics;
