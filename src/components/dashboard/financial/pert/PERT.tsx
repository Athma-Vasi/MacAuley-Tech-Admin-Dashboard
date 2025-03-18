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
import { returnStatistics } from "../../utils";
import {
  consolidateFinancialCardsAndStatistics,
  createFinancialStatisticsElements,
  DashboardCardInfo,
} from "../../utilsTSX";
import { type FinancialMetricsCards } from "../cards";
import {
  FinancialMetricsCalendarCharts,
  type FinancialMetricsCharts,
  returnCalendarViewFinancialCharts,
} from "../chartsData";
import {
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  MONEY_SYMBOL_CATEGORIES,
  PERT_SET,
} from "../constants";
import {
  FinancialCardsAndStatisticsKeyPERT,
  type FinancialMetricCategory,
  FinancialYAxisVariables,
} from "../types";
import { pertAction } from "./actions";
import { pertReducer } from "./reducers";
import { initialPERTState } from "./state";

type PERTProps = {
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
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};
/** PERT = Profit | Expenses | Revenue | Transactions */
function PERT({
  calendarChartsData,
  calendarView,
  financialMetricsCards,
  financialMetricsCharts,
  day,
  metricCategory,
  metricsView,
  month,
  storeLocation,
  year,
}: PERTProps) {
  const { globalState: { themeObject: { primaryColor } }, globalDispatch } =
    useGlobalState();
  const navigate = useNavigate();

  const [pertState, pertDispatch] = React.useReducer(
    pertReducer,
    initialPERTState,
  );

  const {
    barLineChartYAxisVariable,
    barLineChartKind,
    pieChartYAxisVariable,
  } = pertState;

  // const [barLineYAxisVariable, setBarLineYAxisVariable] = React.useState<
  //   FinancialMetricsBarLineChartsKey
  // >(
  //   "total",
  // );
  // const [pieChartYAxisVariable, setPieChartYAxisVariable] = React.useState<
  //   FinancialMetricsPieChartsKey
  // >("overview");
  // const [chartKind, setChartKind] = React.useState<"bar" | "line">(
  //   "bar",
  // );

  const charts = returnCalendarViewFinancialCharts(
    calendarView,
    financialMetricsCharts,
  );

  const {
    bar: barCharts,
    line: lineCharts,
    pie: pieCharts,
  } = PERT_SET.has(metricCategory)
    ? (charts[metricCategory] as FinancialMetricsCharts["dailyCharts"][
      "expenses"
    ])
    : charts.profit;

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
  //   yAxisBarChartVariable: barLineChartYAxisVariable,
  //   yAxisLineChartVariable: lineChartYAxisVariable,
  //   year,
  //   day,
  //   month,
  //   months: MONTHS,
  // });

  const pieChartYAxisVariableSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_PERT_PIE_Y_AXIS_DATA,
        name: "Y-Axis Pie",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setPieChartYAxisVariable,
        value: pieChartYAxisVariable,
      }}
    />
  );

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
              chartTitle: "Pie Chart",
              chartUnitKind: "number",
            },
          });

          // navigate(expandPieChartNavigateLink);
        },
      }}
    />
  );

  const overviewPieChart = (
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
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarLineChartKind,
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
              chartData: barCharts[barLineChartYAxisVariable],
              chartTitle: "TODO",
              chartUnitKind: "number",
            } as CustomizeChartsPageData,
          });

          // navigate(expandBarChartNavigateLink);
        },
      }}
    />
  );

  const barLineChartYAxisVariablesSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarLineChartYAxisVariable,
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
        keys={FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA.map((obj) => obj.label)}
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
        yFormat={(y) =>
          `${MONEY_SYMBOL_CATEGORIES.has(metricCategory) ? "CAD" : ""} ${
            addCommaSeparator(y)
          }`}
        unitKind="number"
      />
    );

  // const expandLineChartButton = (
  //   <AccessibleButton
  //     attributes={{
  //       enabledScreenreaderText: `Expand and customize ${lineChartHeading}`,
  //       kind: "expand",
  //       onClick: (
  //         _event:
  //           | React.MouseEvent<HTMLButtonElement>
  //           | React.PointerEvent<HTMLButtonElement>,
  //       ) => {
  //         globalDispatch({
  //           action: globalAction.setCustomizeChartsPageData,
  //           payload: {
  //             chartKind: "line",
  //             chartData: lineCharts[lineChartYAxisVariable],
  //             chartTitle: lineChartHeading,
  //             chartUnitKind: "number",
  //           },
  //         });

  //         navigate(expandLineChartNavigateLink);
  //       },
  //     }}
  //   />
  // );

  // const lineChartYAxisVariablesSelectInput = (
  //   <AccessibleSelectInput
  //     attributes={{
  //       data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  //       name: "Y-Axis Line",
  //       parentDispatch: pertDispatch,
  //       validValueAction: pertAction.setLineChartYAxisVariable,
  //       value: lineChartYAxisVariable,
  //     }}
  //   />
  // );

  const cards = calendarView === "Daily"
    ? financialMetricsCards.dailyCards
    : calendarView === "Monthly"
    ? financialMetricsCards.monthlyCards
    : financialMetricsCards.yearlyCards;

  const overviewCardsArr = PERT_SET.has(metricCategory)
    ? cards[metricCategory]
    : cards.profit;

  const overviewCards = overviewCardsArr.reduce((acc, card) => {
    const { heading = "Total" } = card;

    acc.set(heading as FinancialCardsAndStatisticsKeyPERT, card);

    return acc;
  }, new Map<FinancialCardsAndStatisticsKeyPERT, DashboardCardInfo>());

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "pert",
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateFinancialCardsAndStatistics(
    overviewCards,
    statisticsElementsMap,
  );

  console.group("PERT");
  console.log({ metricCategory });
  console.log({ metricsView });
  console.log({ calendarView });
  console.log({ calendarChartsData });
  console.groupEnd();

  function returnCalendarCharts(
    calendarChartsData: {
      currentYear: FinancialMetricsCalendarCharts | null;
      previousYear: FinancialMetricsCalendarCharts | null;
    },
    barLineYAxisVariable: FinancialYAxisVariables,
    metricCategory: FinancialMetricCategory,
  ): Array<{ day: string; value: number }> {
    const defaultValue = [{
      day: "",
      value: 0,
    }];

    const { currentYear, previousYear } = calendarChartsData;
    if (
      currentYear === null || previousYear === null
    ) {
      return defaultValue;
    }

    const currentYearMetric = currentYear[metricCategory];
    const previousYearMetric = previousYear[metricCategory];

    console.log("currentYearMetric", currentYearMetric);
    console.log("previousYearMetric", previousYearMetric);

    return (Object.entries(currentYearMetric).find(([key]) =>
      key === barLineYAxisVariable
    )?.[1] ?? defaultValue).concat(
      Object.entries(previousYearMetric).find(([key]) =>
        key === barLineYAxisVariable
      )?.[1] ?? defaultValue,
    );
  }

  const calendarChartData = returnCalendarCharts(
    calendarChartsData,
    barLineChartYAxisVariable,
    metricCategory,
  );

  console.log("year", year);
  console.log("calendarChartData", calendarChartData);

  const calendarCharts =
    new Set(["all", "overview"]).has(barLineChartYAxisVariable) ? null : (
      <Stack>
        <ResponsiveCalendarChart
          calendarChartData={calendarChartData}
          hideControls
          from={`${year}-01-01`}
          to={`${year}-12-31`}
        />
      </Stack>
    );

  return (
    <Stack>
      <DashboardBarLineLayout
        barLineChart={barLineChart}
        barLineChartHeading={"TODO"}
        barLineChartKindSegmentedControl={barLineChartKindSegmentedControl}
        barLineChartYAxisSelectInput={barLineChartYAxisVariablesSelectInput}
        barLineChartYAxisVariable={barLineChartYAxisVariable}
        calendarCharts={calendarCharts}
        consolidatedCards={consolidatedCards}
        expandBarLineChartButton={expandBarLineChartButton}
        sectionHeading="TODO"
        semanticLabel="TODO"
      />
      {/* {financialMetricsOverview} */}
    </Stack>
  );
}

export default PERT;
