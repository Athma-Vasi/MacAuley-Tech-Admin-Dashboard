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
  returnSelectedCalendarCharts,
  returnStatistics,
} from "../../utils";
import {
  consolidateCardsAndStatistics,
  createFinancialStatisticsElements,
  returnCardElementsForYAxisVariable,
} from "../../utilsTSX";
import {
  type FinancialMetricsCards,
  returnFinancialMetricsCards,
} from "../cards";
import {
  FinancialMetricsCalendarCharts,
  type FinancialMetricsCharts,
  returnCalendarViewFinancialCharts,
} from "../chartsData";
import {
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_CALENDAR_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  MONEY_SYMBOL_CATEGORIES,
  PERT_SET,
} from "../constants";
import { type FinancialMetricCategory } from "../types";
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
    calendarChartYAxisVariable,
    pieChartYAxisVariable,
  } = pertState;

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
      pieChartYAxisVariable,
    });

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
          data: FINANCIAL_PERT_CALENDAR_Y_AXIS_DATA,
          name: "Y-Axis Pie",
          parentDispatch: pertDispatch,
          validValueAction: pertAction.setCalendarChartYAxisVariable,
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

  const selectedCards = returnFinancialMetricsCards(
    financialMetricsCards,
    calendarView,
    metricCategory,
  );

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElementsMap = createFinancialStatisticsElements(
    calendarView,
    metricCategory,
    "pert",
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    selectedCards,
    statisticsElementsMap,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineChartYAxisVariable,
    FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
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
        expandPieChartButton={expandPieChartButton}
        pieChart={pieChart}
        pieChartHeading={pieChartHeading}
        pieChartYAxisSelectInput={pieChartYAxisVariableSelectInput}
        expandCalendarChartButton={expandCalendarChartButton}
        calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
        cardsWithStatisticsElements={cardsWithStatisticsElements}
        expandBarLineChartButton={expandBarLineChartButton}
        sectionHeading={splitCamelCase(metricsView)}
        semanticLabel="TODO"
      />
      {/* {financialMetricsOverview} */}
    </Stack>
  );
}

export default PERT;
