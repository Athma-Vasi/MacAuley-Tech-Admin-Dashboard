import { Stack } from "@mantine/core";
import React from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { COLORS_SWATCHES } from "../../../../constants";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import {
  addCommaSeparator,
  createSafeErrorResult,
  returnStatisticsSafe,
  returnThemeColors,
} from "../../../../utils";
import { AccessibleSelectInput } from "../../../accessibleInputs/AccessibleSelectInput";
import {
  ResponsiveBarChart,
  ResponsiveCalendarChart,
  ResponsiveLineChart,
  ResponsivePieChart,
  ResponsiveRadialBarChart,
} from "../../../charts";
import { ChartUnitKind } from "../../../charts/types";
import { createChartTooltipElement } from "../../../charts/utils";
import DashboardBarLineLayout from "../../DashboardLayoutContainer";
import { FinancialMetricsPieChartsKey } from "../../financial/chartsData";
import {
  AllStoreLocations,
  DashboardCalendarView,
  DashboardMetricsView,
  Year,
} from "../../types";
import {
  createExpandChartNavigateLinks,
  returnChartTitles,
  returnSelectedCalendarCharts,
} from "../../utils";
import {
  consolidateCardsAndStatisticsModals,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
} from "../../utilsTSX";
import { CustomerMetricsCards, returnCustomerMetricsCardsMap } from "../cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP,
  CUSTOMER_NEW_RETURNING_Y_AXIS_DATA,
  CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "../constants";
import { CustomerMetricsCategory } from "../types";
import { newAction } from "./actions";
import { newReducer } from "./reducers";
import { initialNewState } from "./state";

type NewProps = {
  calendarChartsData: {
    currentYear: CustomerMetricsCalendarCharts | null;
    previousYear: CustomerMetricsCalendarCharts | null;
  };
  calendarView: DashboardCalendarView;
  customerMetricsCards: CustomerMetricsCards;
  customerMetricsCharts: CustomerMetricsCharts;
  day: string;
  metricCategory: CustomerMetricsCategory;
  metricsView: DashboardMetricsView;
  month: string;
  newOverviewCards: React.JSX.Element;
  storeLocation: AllStoreLocations;
  year: Year;
};

function New(
  {
    calendarChartsData,
    calendarView,
    customerMetricsCards,
    customerMetricsCharts,
    day,
    metricCategory,
    metricsView,
    month,
    newOverviewCards,
    storeLocation,
    year,
  }: NewProps,
) {
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [newState, newDispatch] = React.useReducer(
    newReducer,
    initialNewState,
  );
  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Map<string, boolean>
  >(
    new Map([
      ["Total New", false],
      ["Sales", false],
      ["Sales Online", false],
      ["Sales In-Store", false],
      ["Repair", false],
    ]),
  );

  const {
    yAxisKey,
  } = newState;

  const charts = returnCalendarViewCustomerCharts(
    calendarView,
    customerMetricsCharts,
  );

  const {
    new: { bar: barCharts, line: lineCharts, pie: pieCharts },
  } = charts;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks(
    {
      calendarView,
      metricCategory,
      metricsView,
      yAxisKey,
    },
  );

  const { yAxisKeyChartHeading } = returnChartTitles({
    calendarView,
    metricCategory,
    storeLocation,
    subMetric: "Customers",
    yAxisKey,
  });

  const chartUnitKind = "" as ChartUnitKind;
  const commonPayload = {
    calendarView,
    chartUnitKind,
    day,
    month,
    year,
    yAxisKey,
    yAxisKeyChartHeading,
  };

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: newDispatch,
        validValueAction: newAction.setYAxisKey,
        value: yAxisKey,
      }}
    />
  );

  const pieChart = (
    <ResponsivePieChart
      chartUnitKind={chartUnitKind}
      hideControls
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandPieChartData,
          payload: {
            ...commonPayload,
            chartData: pieCharts[yAxisKey as FinancialMetricsPieChartsKey],
            chartKind: "pie",
            chartUnitKind,
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "pie",
        });

        navigate(expandPieChartNavigateLink);
      }}
      pieChartData={pieCharts[yAxisKey as FinancialMetricsPieChartsKey]}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind,
          day,
          kind: "pie",
          month,
          year,
        })}
    />
  );

  const barChartIndexBy = calendarView === "Daily"
    ? "Days"
    : calendarView === "Monthly"
    ? "Months"
    : "Years";
  const barChartKeys = CUSTOMER_NEW_RETURNING_Y_AXIS_DATA.map((obj) =>
    obj.label
  );

  const barChart = (
    <ResponsiveBarChart
      barChartData={barCharts[yAxisKey]}
      chartUnitKind={chartUnitKind}
      hideControls
      indexBy={barChartIndexBy}
      keys={barChartKeys}
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandBarChartData,
          payload: {
            ...commonPayload,
            chartData: barCharts[yAxisKey],
            chartKind: "bar",
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
        createChartTooltipElement({ arg, chartUnitKind, kind: "bar" })}
    />
  );

  const lineChart = (
    <ResponsiveLineChart
      chartUnitKind={chartUnitKind}
      hideControls
      lineChartData={lineCharts[yAxisKey]}
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandLineChartData,
          payload: {
            ...commonPayload,
            chartData: lineCharts[yAxisKey],
            chartKind: "line",
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
      yFormat={(y) => addCommaSeparator(y) + chartUnitKind}
      tooltip={(arg) =>
        createChartTooltipElement({ arg, chartUnitKind, kind: "line" })}
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
          chartUnitKind,
          kind: "radial",
        })}
    />
  );

  const calendarChartData = returnSelectedCalendarCharts(
    calendarChartsData,
    yAxisKey,
    metricCategory,
  );

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
            chartData: calendarChartData,
            chartKind: "calendar",
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
          chartUnitKind,
          kind: "calendar",
          yAxisKey,
        })}
    />
  );

  const statisticsMapResult = returnStatisticsSafe(barCharts);
  if (statisticsMapResult.err) {
    showBoundary(statisticsMapResult);
    return null;
  }
  if (statisticsMapResult.val.none) {
    showBoundary(
      createSafeErrorResult(
        "No statistics data available for the selected metric category.",
      ),
    );
    return null;
  }

  const cardsMap = returnCustomerMetricsCardsMap(
    {
      calendarView,
      customerMetricsCards,
      customerYAxisKeyToCardsKeyMap: CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
      yAxisKey,
    },
  );

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    metricCategory,
    statisticsMapResult.val.val,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatisticsModals({
    modalsOpenedState,
    selectedCards: cardsMap.get(metricCategory) ?? new Map(),
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
    CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <Stack>
      <DashboardBarLineLayout
        barChart={barChart}
        calendarChart={calendarChart}
        calendarView={calendarView}
        chartsToYAxisKeysMap={CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP}
        consolidatedCards={cardsWithStatisticsElements}
        lineChart={lineChart}
        pieChart={pieChart}
        radialChart={radialChart}
        sectionHeading="New Customers"
        semanticLabel="TODO"
        statisticsModals={statisticsModals}
        yAxisKey={yAxisKey}
        yAxisKeyChartHeading={yAxisKeyChartHeading}
        yAxisKeySelectInput={yAxisKeySelectInput}
      />
    </Stack>
  );
}

export default New;
