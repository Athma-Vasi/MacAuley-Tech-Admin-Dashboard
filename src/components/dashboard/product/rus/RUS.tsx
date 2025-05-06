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
  ResponsivePieChart,
  ResponsiveRadialBarChart,
} from "../../../charts";
import { ChartUnitKind } from "../../../charts/types";
import { createChartTooltipElement } from "../../../charts/utils";
import DashboardBarLineLayout from "../../DashboardLayoutContainer";
import {
  type ProductMetricsCards,
  returnProductMetricsCards,
} from "../../product/cards";
import type {
  ProductMetricsCalendarCharts,
  ProductMetricsCharts,
} from "../../product/chartsData";
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
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
} from "../../utilsTSX";
import {
  PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  PRODUCT_CHARTS_TO_Y_AXIS_KEYS_MAP,
  PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
} from "../constants";
import type { ProductMetricCategory, ProductSubMetric } from "../types";
import { rusAction } from "./actions";
import { rusReducer } from "./reducers";
import { initialRUSState } from "./state";

type RUSProps = {
  calendarChartsData: {
    currentYear: ProductMetricsCalendarCharts | null;
    previousYear: ProductMetricsCalendarCharts | null;
  };
  calendarView: DashboardCalendarView;
  day: string;
  subMetric: ProductSubMetric;
  metricsView: DashboardMetricsView;
  month: string;
  overviewCards: React.JSX.Element;
  productCategory: ProductMetricCategory;
  productMetricsCards: ProductMetricsCards;
  productMetricsCharts: ProductMetricsCharts;
  storeLocation: AllStoreLocations;
  year: Year;
};

/** RUS: Revenue | Units Sold */
function RUS(
  {
    calendarChartsData,
    calendarView,
    day,
    metricsView,
    month,
    overviewCards,
    productCategory,
    productMetricsCards,
    productMetricsCharts,
    storeLocation,
    subMetric,
    year,
  }: RUSProps,
) {
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [rusState, rusDispatch] = React.useReducer(rusReducer, initialRUSState);

  const {
    barLineRadialChartKind,
    yAxisKey,
  } = rusState;

  const charts = calendarView === "Daily"
    ? productMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? productMetricsCharts.monthlyCharts
    : productMetricsCharts.yearlyCharts;

  const {
    bar: barCharts,
    line: lineCharts,
    pie: pieCharts,
  } = subMetric === "revenue" ? charts.revenue : charts.unitsSold;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks({
    metricCategory: productCategory,
    calendarView,
    metricsView,
    subMetric,
    yAxisKey,
  });

  const { yAxisKeyChartHeading } = returnChartTitles({
    calendarView,
    metricCategory: productCategory,
    storeLocation,
    subMetric,
    yAxisKey,
  });

  const chartUnitKind = subMetric === "revenue"
    ? "CAD"
    : "Units" as ChartUnitKind;
  const commonPayload = {
    calendarView,
    chartUnitKind,
    day,
    month,
    yAxisKey,
    yAxisKeyChartHeading,
    year,
  };

  const pieChart = (
    <ResponsivePieChart
      pieChartData={pieCharts}
      hideControls
      chartUnitKind={chartUnitKind}
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandPieChartData,
          payload: {
            ...commonPayload,
            chartData: pieCharts,
            chartKind: "pie",
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "pie",
        });

        navigate(expandPieChartNavigateLink);
      }}
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
  const barChartKeys = PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA.map((obj) =>
    obj.label
  );

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setYAxisKey,
        value: yAxisKey,
      }}
    />
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
        createChartTooltipElement({
          arg,
          chartUnitKind,
          kind: "bar",
        })}
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
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind,
          kind: "line",
        })}
      xFormat={(x) =>
        `${
          calendarView === "Daily"
            ? "Day - "
            : calendarView === "Yearly"
            ? "Year - "
            : ""
        }${x}`}
      yFormat={(y) => addCommaSeparator(y) + chartUnitKind}
    />
  );

  const radialChart = (
    <ResponsiveRadialBarChart
      hideControls
      radialBarChartData={lineCharts[yAxisKey]}
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
    subMetric,
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

  const selectedCards = returnProductMetricsCards(
    {
      calendarView,
      productMetricsCards,
      productYAxisKeyToCardsKeyMap: PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
      subMetric,
      yAxisKey,
    },
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    subMetric,
    statisticsMap,
    storeLocation,
  );

  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Map<string, boolean>
  >(
    new Map([
      ["Total", false],
      ["In-Store", false],
      ["Online", false],
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
    PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <DashboardBarLineLayout
      barChart={barChart}
      calendarChart={calendarChart}
      calendarView={calendarView}
      chartsToYAxisKeysMap={PRODUCT_CHARTS_TO_Y_AXIS_KEYS_MAP}
      consolidatedCards={cardsWithStatisticsElements}
      lineChart={lineChart}
      pieChart={pieChart}
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

export { RUS };
