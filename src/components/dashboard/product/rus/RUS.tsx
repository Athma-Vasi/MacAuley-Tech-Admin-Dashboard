import React from "react";
import { useNavigate } from "react-router-dom";

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
  ResponsivePieChart,
  ResponsiveRadialBarChart,
} from "../../../charts";
import { ChartUnitKind } from "../../../charts/types";
import { createChartTooltipElement } from "../../../charts/utils";
import { CHART_KIND_DATA } from "../../constants";
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
  consolidateCardsAndStatistics,
  createStatisticsElements,
  returnCardElementsForYAxisVariable,
} from "../../utilsTSX";
import {
  PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
  PRODUCT_METRICS_CALENDAR_Y_AXIS_DATA,
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
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [rusState, rusDispatch] = React.useReducer(rusReducer, initialRUSState);

  const {
    barLineRadialChartKind,
    barLineRadialChartYAxis,
    calendarChartYAxis,
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
    barLineRadialChartYAxis,
    metricCategory: productCategory,
    calendarView,
    metricsView,
    calendarChartYAxis,
    subMetric,
  });

  const { barLineRadialChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineRadialChartYAxis,
      calendarView,
      metricCategory: productCategory,
      storeLocation,
      calendarChartYAxis,
      subMetric,
    });

  const chartUnitKind = subMetric === "revenue"
    ? "CAD"
    : "Units" as ChartUnitKind;
  const commonPayload = {
    calendarView,
    chartUnitKind,
    day,
    month,
    year,
  };

  const expandPieChartButton = (
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
            action: globalAction.setExpandPieChartData,
            payload: {
              ...commonPayload,
              chartData: pieCharts,
              chartKind: "pie",
              chartTitle: pieChartHeading,
            },
          });

          globalDispatch({
            action: globalAction.setSelectedChartKind,
            payload: "pie",
          });

          navigate(expandPieChartNavigateLink);
        },
      }}
    />
  );

  const pieChart = (
    <ResponsivePieChart
      pieChartData={pieCharts}
      hideControls
      chartUnitKind={chartUnitKind}
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

  const barLineRadialChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setBarLineRadialChartKind,
        value: barLineRadialChartKind,
        defaultValue: "bar",
      }}
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
        data: PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setBarLineRadialChartYAxis,
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
        chartUnitKind={chartUnitKind}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind,
            kind: "bar",
          })}
      />
    )
    : barLineRadialChartKind === "line"
    ? (
      <ResponsiveLineChart
        chartUnitKind={chartUnitKind}
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
        yFormat={(y) => addCommaSeparator(y) + chartUnitKind}
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
            chartUnitKind,
            kind: "line",
          })}
      />
    )
    : (
      <ResponsiveRadialBarChart
        hideControls
        radialBarChartData={lineCharts[barLineRadialChartYAxis]}
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
    calendarChartYAxis,
    subMetric,
  );

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

  const calendarChartYAxisVariableSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRICS_CALENDAR_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setCalendarChartYAxis,
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
          chartUnitKind,
          kind: "calendar",
        })}
    />
  );

  const selectedCards = returnProductMetricsCards(
    productMetricsCards,
    calendarView,
    subMetric,
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElements = createStatisticsElements(
    calendarView,
    subMetric,
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    selectedCards,
    statisticsElements,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineRadialChartYAxis,
    PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <DashboardBarLineLayout
      barLineRadialChart={barLineRadialChart}
      barLineRadialChartHeading={barLineRadialChartHeading}
      barLineRadialChartKindSegmentedControl={barLineRadialChartKindSegmentedControl}
      barLineRadialChartYAxisSelectInput={barLineRadialChartYAxisSelectInput}
      barLineRadialChartYAxis={barLineRadialChartYAxis}
      calendarChart={calendarChart}
      calendarChartHeading={calendarChartHeading}
      calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
      calendarView={calendarView}
      cardsWithStatisticsElements={cardsWithStatisticsElements}
      expandBarLineRadialChartButton={expandBarLineRadialChartButton}
      expandCalendarChartButton={expandCalendarChartButton}
      expandPieChartButton={expandPieChartButton}
      overviewCards={overviewCards}
      pieChart={pieChart}
      pieChartHeading={pieChartHeading}
      sectionHeading={splitCamelCase(metricsView)}
      semanticLabel="TODO"
    />
  );
}

export { RUS };
