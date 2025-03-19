import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { globalAction } from "../../../../context/globalProvider/actions";
import { CustomizeChartsPageData } from "../../../../context/globalProvider/types";
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
  returnStatistics,
} from "../../utils";
import {
  consolidateCardsAndStatistics,
  createStatisticsElements,
} from "../../utilsTSX";
import {
  type CustomerMetricsCards,
  returnCustomerMetricsCardsMap,
} from "../cards";
import {
  type CustomerMetricsCharts,
  type CustomerMetricsChurnRetentionChartsKey,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_CHURN_RETENTION_CALENDAR_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
} from "../constants";
import type { CustomerMetricsCategory } from "../types";
import { churnRetentionAction } from "./actions";
import { churnRetentionReducer } from "./reducers";
import { initialChurnRetentionState } from "./state";

type ChurnRetentionProps = {
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

function ChurnRetention({
  calendarView,
  customerMetricsCards,
  customerMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  year,
}: ChurnRetentionProps) {
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

  // const {
  //   barChartHeading,
  //   expandBarChartNavigateLink,
  //   expandLineChartNavigateLink,
  //   expandPieChartNavigateLink,
  //   lineChartHeading,
  //   pieChartHeading,
  // } = returnChartTitleNavigateLinks({
  //   calendarView,
  //   metricCategory,
  //   metricsView,
  //   storeLocation,
  //   yAxisBarChartVariable: churnRetentionBarChartYAxisVariable,
  //   yAxisLineChartVariable: churnRetentionLineChartYAxisVariable,
  //   year,
  //   day,
  //   month,
  //   months: MONTHS,
  // });

  const {
    expandBarChartNavigateLink,
    expandCalendarChartNavigateLink,
    expandLineChartNavigateLink,
    expandPieChartNavigateLink,
  } = createExpandChartNavigateLinks(metricsView, calendarView, metricCategory);

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
              chartTitle: "Pie Chart",
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
              chartKind: "bar",
              chartData: barLineChartKind === "bar"
                ? barCharts[barLineChartYAxisVariable]
                : lineCharts[barLineChartYAxisVariable],
              chartTitle: "TODO",
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
                chartData: [], // TODO
                chartTitle: "TODO",
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
        calendarChartData={[]} // TODO
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

  // const cards = returnCalendarViewCustomerCards(
  //   calendarView,
  //   customerMetricsCards,
  // );
  // const overviewCards = metricCategory === "new" ? cards.new : cards.returning;
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

  const { barLineChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineChartYAxisVariable,
      calendarView,
      metricCategory,
      storeLocation,
      calendarChartYAxisVariable,
    });

  // console.group("ChurnRetention");
  // console.log("customerMetricsCards", customerMetricsCards);
  // console.log("metricCategory", metricCategory);
  console.log("cardsMap", cardsMap);
  // console.log("statisticsMap", statisticsMap);
  // console.log("statisticsElementsMap", statisticsElementsMap);
  // console.log("consolidatedCards", consolidatedCards);
  // console.log("barLineChartKind", barLineChartKind);
  // console.log("barLineChartYAxisVariable", barLineChartYAxisVariable);
  // console.log("calendarChartYAxisVariable", calendarChartYAxisVariable);
  // console.log("calendarView", calendarView);
  // console.log("metricsView", metricsView);
  // console.log("storeLocation", storeLocation);
  // console.log("year", year);
  // console.log("month", month);
  // console.log("day", day);
  // console.log("barCharts", barCharts);
  // console.log("barChartData", barCharts[barLineChartYAxisVariable]);
  // console.log("lineChartData", lineCharts[barLineChartYAxisVariable]);
  // console.log("lineCharts", lineCharts);
  // console.log("pieCharts", pieCharts);
  // console.groupEnd();

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
        cardsWithStatisticsElements={consolidatedCards.get(
          splitCamelCase(barLineChartYAxisVariable),
        ) ??
          <></>}
        expandBarLineChartButton={expandBarLineChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        pieChart={pieChart}
        expandPieChartButton={expandPieChartButton}
        pieChartHeading={pieChartHeading}
        sectionHeading="Churn Retention"
        semanticLabel="Churn Retention"
      />
    </Stack>
  );
}

export { ChurnRetention };
