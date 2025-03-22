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
    barLineChartKind,
    barLineChartYAxisVariable,
    calendarChartYAxisVariable,
    pieChartYAxisVariable,
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
    metricsView,
    calendarView,
    metricCategory,
  );

  const { barLineChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineChartYAxisVariable,
      calendarView,
      metricCategory,
      storeLocation,
      calendarChartYAxisVariable,
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
              chartData: pieCharts[pieChartYAxisVariable],
              chartTitle: pieChartHeading,
              chartUnitKind: "number",
            },
          });

          navigate(expandPieChartNavigateLink);
        },
      }}
    />
  );

  const pieChartYAxisVariableSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
        name: "Y-Axis Pie",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setPieChartYAxisVariable,
        value: pieChartYAxisVariable,
      }}
    />
  );

  const pieChart = (
    <ResponsivePieChart
      pieChartData={pieCharts[pieChartYAxisVariable]}
      hideControls
      unitKind="number"
    />
  );

  const barLineChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setBarLineChartKind,
        value: barLineChartKind,
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
              chartKind: barLineChartKind,
              chartData: barLineChartKind === "bar"
                ? barCharts[barLineChartYAxisVariable]
                : lineCharts[barLineChartYAxisVariable],
              chartTitle: barLineChartHeading,
              chartUnitKind: "number",
            } as CustomizeChartsPageData,
          });

          navigate(
            barLineChartKind === "bar"
              ? expandBarChartNavigateLink
              : expandLineChartNavigateLink,
          );
        },
      }}
    />
  );

  const barLineChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setBarLineChartYAxisVariable,
        value: barLineChartYAxisVariable,
      }}
    />
  );

  const barLineChart = barLineChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[barLineChartYAxisVariable]}
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
    : (
      <ResponsiveLineChart
        lineChartData={lineCharts[barLineChartYAxisVariable]}
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
    );

  const calendarChartData = returnSelectedCalendarCharts(
    calendarChartsData,
    calendarChartYAxisVariable,
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

  const calendarChartYAxisVariableSelectInput = calendarView === "Yearly"
    ? (
      <AccessibleSelectInput
        attributes={{
          data: CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
          name: "Y-Axis Pie",
          parentDispatch: returningDispatch,
          validValueAction: returningAction.setCalendarChartYAxisVariable,
          value: calendarChartYAxisVariable,
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
    barLineChartYAxisVariable,
    CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <Stack>
      <DashboardBarLineLayout
        barLineChart={barLineChart}
        barLineChartHeading={barLineChartHeading}
        barLineChartKindSegmentedControl={barLineChartKindSegmentedControl}
        barLineChartYAxisSelectInput={barLineChartYAxisVariablesSelectInput}
        barLineChartYAxisVariable={barLineChartYAxisVariable}
        calendarChart={calendarChart}
        calendarView={calendarView}
        calendarChartHeading={calendarChartHeading}
        calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
        cardsWithStatisticsElements={cardsWithStatisticsElements}
        expandBarLineChartButton={expandBarLineChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        pieChart={pieChart}
        expandPieChartButton={expandPieChartButton}
        pieChartYAxisSelectInput={pieChartYAxisVariableSelectInput}
        pieChartHeading={pieChartHeading}
        sectionHeading="Customer Returning"
        semanticLabel="TODO"
      />
    </Stack>
  );
}

export default Returning;
