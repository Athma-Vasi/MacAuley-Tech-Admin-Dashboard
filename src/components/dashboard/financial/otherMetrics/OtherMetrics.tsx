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

  const barChart = (
    <ResponsiveBarChart
      barChartData={barCharts[yAxisKey]}
      chartUnitKind={barLineRadialUnit}
      hideControls
      indexBy={barChartIndexBy}
      keys={barChartKeys}
      onClick={() => {
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

        navigate(expandBarChartNavigateLink);
      }}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind: barLineRadialUnit,
          kind: "bar",
        })}
    />
  );

  const lineChart = (
    <ResponsiveLineChart
      chartUnitKind={barLineRadialUnit}
      lineChartData={lineCharts[yAxisKey]}
      hideControls
      onClick={() => {
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

        navigate(expandLineChartNavigateLink);
      }}
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
            chartKind: "radial",
            chartData: lineCharts[yAxisKey],
            chartUnitKind: barLineRadialUnit,
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

  const calendarChart = (
    <ResponsiveCalendarChart
      calendarChartData={calendarChartData}
      hideControls
      from={`${year}-01-01`}
      to={`${year}-12-31`}
      onClick={() => {
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
      }}
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
      barChart={barChart}
      calendarChart={calendarChart}
      calendarView={calendarView}
      chartsToYAxisKeysMap={FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP}
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

  return otherMetrics;
}

export default OtherMetrics;
