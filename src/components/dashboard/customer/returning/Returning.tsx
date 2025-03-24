import { Stack } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { globalAction } from "../../../../context/globalProvider/actions";
import { CustomizeChartsPageData } from "../../../../context/globalProvider/types";
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
            action: globalAction.setCustomizeChartsPageData,
            payload: {
              chartKind: "pie",
              chartData: pieCharts[pieChartYAxis],
              chartTitle: pieChartHeading,
              chartUnitKind: "number",
            },
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
        name: "Y-Axis Pie",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setPieChartYAxis,
        value: pieChartYAxis,
      }}
    />
  );

  const pieChart = (
    <ResponsivePieChart
      pieChartData={pieCharts[pieChartYAxis]}
      hideControls
      unitKind="number"
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
              chartKind: barLineRadialChartKind,
              chartData: barLineRadialChartKind === "bar"
                ? barCharts[barLineRadialChartYAxis]
                : lineCharts[barLineRadialChartYAxis],
              chartTitle: barLineRadialChartHeading,
              chartUnitKind: "number",
            } as CustomizeChartsPageData,
          });

          navigate(
            barLineRadialChartKind === "bar"
              ? expandBarChartNavigateLink
              : expandLineChartNavigateLink,
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
        hideControls
        indexBy={calendarView === "Daily"
          ? "Days"
          : calendarView === "Monthly"
          ? "Months"
          : "Years"}
        keys={CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA.map((obj) =>
          obj.label
        )}
        unitKind="number"
      />
    )
    : barLineRadialChartKind === "line"
    ? (
      <ResponsiveLineChart
        lineChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
        xFormat={(x) =>
          `${
            calendarView === "Daily"
              ? "Day"
              : calendarView === "Monthly"
              ? "Month"
              : "Year"
          } - ${x}`}
        yFormat={(y) => `${addCommaSeparator(y)} Customers`}
        unitKind="number"
      />
    )
    : (
      <ResponsiveRadialBarChart
        radialBarChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
      />
    );

  const calendarChartData = returnSelectedCalendarCharts(
    calendarChartsData,
    calendarChartYAxis,
    metricCategory,
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

  const calendarChartYAxisSelectInput = calendarView === "Yearly"
    ? (
      <AccessibleSelectInput
        attributes={{
          data: CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
          name: "Y-Axis Pie",
          parentDispatch: returningDispatch,
          validValueAction: returningAction.setCalendarChartYAxis,
          value: calendarChartYAxis,
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
        expandBarLineChartButton={expandBarLineChartButton}
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
