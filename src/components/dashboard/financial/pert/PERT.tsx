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
  createFinancialStatisticsElements,
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
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
  pertOverviewCards: React.JSX.Element;
  storeLocation: AllStoreLocations;
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
  pertOverviewCards,
  storeLocation,
  year,
}: PERTProps) {
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [pertState, pertDispatch] = React.useReducer(
    pertReducer,
    initialPERTState,
  );

  const {
    barLineRadialChartYAxis,
    barLineRadialChartKind,
    calendarChartYAxis,
    pieChartYAxis,
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
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks({
    barLineRadialChartYAxis,
    calendarChartYAxis,
    calendarView,
    metricCategory,
    metricsView,
    pieChartYAxis,
  });

  const { barLineRadialChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineRadialChartYAxis,
      calendarView,
      metricCategory,
      storeLocation,
      calendarChartYAxis,
      pieChartYAxis,
    });

  const pieChartYAxisSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_PERT_PIE_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setPieChartYAxisVariable,
        value: pieChartYAxis,
      }}
    />
  );

  const chartUnitKind = metricCategory === "transactions"
    ? ""
    : "CAD" as ChartUnitKind;
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
      chartUnitKind={chartUnitKind}
      hideControls
      pieChartData={pieCharts[pieChartYAxis]}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          day,
          kind: "pie",
          month,
          chartUnitKind,
          year,
        })}
    />
  );

  const barLineRadialChartKindSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CHART_KIND_DATA,
        name: "chartKind",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarLineRadialChartKind,
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
  const barChartKeys = FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA.map((obj) =>
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
        data: FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setBarLineRadialChartYAxis,
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
          createChartTooltipElement({
            arg,
            kind: "bar",
            chartUnitKind,
          })}
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
          createChartTooltipElement({
            arg,
            calendarView,
            chartUnitKind,
            kind: "line",
          })}
      />
    )
    : (
      <ResponsiveRadialBarChart
        radialBarChartData={lineCharts[barLineRadialChartYAxis]}
        hideControls
        tooltip={(arg) =>
          createChartTooltipElement({
            arg,
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
        data: FINANCIAL_PERT_CALENDAR_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setCalendarChartYAxis,
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

  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Array<boolean>
  >(
    Array.from({ length: statisticsElementsMap.size }, () => false),
  );

  console.group("PERT Statistics Elements Map");
  console.log(statisticsElementsMap);
  console.groupEnd();

  const consolidatedCards = consolidateCardsAndStatisticsModals({
    modalsOpenedState,
    selectedCards,
    setModalsOpenedState,
  });

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineRadialChartYAxis,
    FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

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

  return (
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
      overviewCards={pertOverviewCards}
      pieChart={pieChart}
      pieChartHeading={pieChartHeading}
      pieChartYAxisSelectInput={pieChartYAxisSelectInput}
      sectionHeading={splitCamelCase(metricsView)}
      semanticLabel="TODO"
    />
  );
}

export default PERT;
