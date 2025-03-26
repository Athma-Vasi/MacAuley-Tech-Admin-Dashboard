import { Stack } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator } from "../../../../utils";
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
import DashboardBarLineLayout from "../../DashboardBarLineLayout";
import {
  BusinessMetricStoreLocation,
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
import { CustomerMetricsCards, returnCustomerMetricsCardsMap } from "../cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
  CustomerMetricsNewReturningChartsKey,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
  CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "../constants";
import { CustomerMetricsCategory } from "../types";
import { returningAction } from "./actions";
import { returningReducer } from "./reducers";
import { initialReturningState } from "./state";

type ReturningProps = {
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
  returningOverviewCards: {
    lifetimeValue: React.JSX.Element;
    totalCustomers: React.JSX.Element;
    dailyReturningCustomers: React.JSX.Element;
  };
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

function Returning(
  {
    calendarChartsData,
    calendarView,
    customerMetricsCards,
    customerMetricsCharts,
    day,
    metricCategory,
    metricsView,
    month,
    returningOverviewCards,
    storeLocation,
    year,
  }: ReturningProps,
) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [returningState, returningDispatch] = React.useReducer(
    returningReducer,
    initialReturningState,
  );

  const {
    barLineRadialChartKind,
    barLineRadialChartYAxis,
    calendarChartYAxis,
    pieChartYAxis,
  } = returningState;

  const charts = returnCalendarViewCustomerCharts(
    calendarView,
    customerMetricsCharts,
  );

  const {
    returning: { bar: barCharts, line: lineCharts, pie: pieCharts },
  } = charts;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks(
    {
      barLineRadialChartYAxis,
      calendarChartYAxis,
      calendarView,
      metricCategory,
      metricsView,
      pieChartYAxis,
    },
  );

  const { barLineRadialChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineRadialChartYAxis,
      calendarView,
      metricCategory,
      storeLocation,
      subMetric: "Customers",
      calendarChartYAxis,
    });

  const chartUnitKind = "" as ChartUnitKind;
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
              chartData: pieCharts[pieChartYAxis],
              chartKind: "pie",
              chartTitle: pieChartHeading,
              chartUnitKind,
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

  const pieChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setPieChartYAxis,
        value: pieChartYAxis,
      }}
    />
  );

  const pieChart = (
    <ResponsivePieChart
      chartUnitKind={chartUnitKind}
      hideControls
      pieChartData={pieCharts[pieChartYAxis]}
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
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setBarLineRadialChartKind,
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
  const barChartKeys = CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA.map((obj) =>
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
        data: CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setBarLineRadialChartYAxis,
        value: barLineRadialChartYAxis,
      }}
    />
  );

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[barLineRadialChartYAxis]}
        chartUnitKind={chartUnitKind}
        hideControls
        indexBy={barChartIndexBy}
        keys={barChartKeys}
        tooltip={(arg) =>
          createChartTooltipElement({ arg, chartUnitKind, kind: "bar" })}
      />
    )
    : barLineRadialChartKind === "line"
    ? (
      <ResponsiveLineChart
        chartUnitKind={chartUnitKind}
        hideControls
        lineChartData={lineCharts[barLineRadialChartYAxis]}
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
    )
    : (
      <ResponsiveRadialBarChart
        radialBarChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
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
    metricCategory,
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

  const calendarChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setCalendarChartYAxis,
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

  const statisticsMap = returnStatistics<
    CustomerMetricsNewReturningChartsKey
  >(
    barCharts,
  );

  const cardsMap = returnCustomerMetricsCardsMap(
    customerMetricsCards,
    calendarView,
  );

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    metricCategory,
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    cardsMap.get(metricCategory) ?? new Map(),
    statisticsElementsMap,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineRadialChartYAxis,
    CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  const overviewCards = (
    <>
      {returningOverviewCards.totalCustomers}
      {returningOverviewCards.lifetimeValue}
      {returningOverviewCards.dailyReturningCustomers}
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
        expandPieChartButton={expandPieChartButton}
        overviewCards={overviewCards}
        pieChart={pieChart}
        pieChartHeading={pieChartHeading}
        pieChartYAxisSelectInput={pieChartYAxisSelectInput}
        sectionHeading="Returning Customers"
        semanticLabel="TODO"
      />
    </Stack>
  );
}

export default Returning;
