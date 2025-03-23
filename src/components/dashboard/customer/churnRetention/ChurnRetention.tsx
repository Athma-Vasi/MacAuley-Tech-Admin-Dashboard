import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
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
import type {
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
import {
  type CustomerMetricsCards,
  returnCustomerMetricsCardsMap,
} from "../cards";
import {
  CustomerMetricsCalendarCharts,
  type CustomerMetricsCharts,
  type CustomerMetricsChurnRetentionChartsKey,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_CHURN_RETENTION_CALENDAR_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "../constants";
import type { CustomerMetricsCategory } from "../types";
import { churnRetentionAction } from "./actions";
import { churnRetentionReducer } from "./reducers";
import { initialChurnRetentionState } from "./state";

type ChurnRetentionProps = {
  calendarChartsData: {
    currentYear: CustomerMetricsCalendarCharts | null;
    previousYear: CustomerMetricsCalendarCharts | null;
  };
  calendarView: DashboardCalendarView;
  churnOverviewCards: {
    churnRate: React.JSX.Element;
    retentionRate: React.JSX.Element;
  };
  customerMetricsCards: CustomerMetricsCards;
  customerMetricsCharts: CustomerMetricsCharts;
  day: string;
  metricCategory: CustomerMetricsCategory;
  metricsView: DashboardMetricsView;
  month: string;
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

function ChurnRetention(
  {
    calendarChartsData,
    calendarView,
    churnOverviewCards,
    customerMetricsCards,
    customerMetricsCharts,
    day,
    metricCategory,
    metricsView,
    month,
    storeLocation,
    year,
  }: ChurnRetentionProps,
) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [churnRetentionState, churnRetentionDispatch] = React.useReducer(
    churnRetentionReducer,
    initialChurnRetentionState,
  );

  const {
    barLineChartKind,
    barLineChartYAxisVariable,
    calendarChartYAxisVariable,
  } = churnRetentionState;

  const charts = returnCalendarViewCustomerCharts(
    calendarView,
    customerMetricsCharts,
  );
  const {
    churnRetention: { bar: barCharts, line: lineCharts, pie: pieCharts },
  } = charts;

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
  } = createExpandChartNavigateLinks(metricsView, calendarView, metricCategory);

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
              chartData: pieCharts,
              chartTitle: pieChartHeading,
              chartUnitKind: "number",
            },
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
      unitKind="number"
    />
  );

  const barLineChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: churnRetentionDispatch,
        validValueAction: churnRetentionAction.setBarLineChartKind,
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
        data: CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: churnRetentionDispatch,
        validValueAction: churnRetentionAction.setBarLineChartYAxisVariable,
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
        keys={CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA.map((obj) => obj.label)}
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
          data: CUSTOMER_CHURN_RETENTION_CALENDAR_Y_AXIS_DATA,
          name: "Y-Axis Pie",
          parentDispatch: churnRetentionDispatch,
          validValueAction: churnRetentionAction.setCalendarChartYAxisVariable,
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
    CustomerMetricsChurnRetentionChartsKey
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
    CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  const overviewCards = (
    <>
      {churnOverviewCards.churnRate}
      {churnOverviewCards.retentionRate}
    </>
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
        calendarChartHeading={calendarChartHeading}
        calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
        calendarView={calendarView}
        cardsWithStatisticsElements={cardsWithStatisticsElements}
        expandBarLineChartButton={expandBarLineChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        expandPieChartButton={expandPieChartButton}
        overviewCards={overviewCards}
        pieChart={pieChart}
        pieChartHeading={pieChartHeading}
        sectionHeading="Customers Churn"
        semanticLabel="TODO"
      />
    </Stack>
  );
}

export { ChurnRetention };
