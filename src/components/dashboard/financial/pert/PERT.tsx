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
import DashboardLayoutContainer from "../../DashboardLayoutContainer";
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
  FinancialMetricsPieChartsKey,
  returnCalendarViewFinancialCharts,
} from "../chartsData";
import {
  FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP,
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_Y_AXIS_DATA,
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
    barLineRadialChartKind,
    yAxisKey,
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
    calendarView,
    metricCategory,
    metricsView,
    yAxisKey,
  });

  const {
    yAxisKeyChartHeading,
  } = returnChartTitles({
    calendarView,
    metricCategory,
    storeLocation,
    yAxisKey,
  });

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIAL_PERT_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: pertDispatch,
        validValueAction: pertAction.setYAxisKey,
        value: yAxisKey,
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
    yAxisKey,
    yAxisKeyChartHeading,
    year,
  };

  const pieChart = (
    <ResponsivePieChart
      chartUnitKind={chartUnitKind}
      hideControls
      onClick={() => {
        globalDispatch({
          action: globalAction.setExpandPieChartData,
          payload: {
            ...commonPayload,
            chartData: pieCharts[yAxisKey as FinancialMetricsPieChartsKey],
            chartKind: "pie",
          },
        });

        globalDispatch({
          action: globalAction.setSelectedChartKind,
          payload: "pie",
        });

        navigate(expandPieChartNavigateLink);
      }}
      pieChartData={pieCharts[yAxisKey as FinancialMetricsPieChartsKey]}
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
          kind: "bar",
          chartUnitKind,
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
  );

  const radialChart = (
    <ResponsiveRadialBarChart
      radialBarChartData={lineCharts[yAxisKey]}
      hideControls
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
          chartUnitKind,
          kind: "radial",
        })}
    />
  );

  // const barLineRadialChart = barLineRadialChartKind === "bar"
  //   ? (
  //     <ResponsiveBarChart
  //       barChartData={barCharts[yAxisKey]}
  //       chartUnitKind={chartUnitKind}
  //       hideControls
  //       indexBy={barChartIndexBy}
  //       keys={barChartKeys}
  //       onClick={() => {
  //         globalDispatch({
  //           action: globalAction.setExpandBarChartData,
  //           payload: {
  //             ...commonPayload,
  //             chartData: barCharts[yAxisKey],
  //             chartKind: "bar",
  //             indexBy: barChartIndexBy,
  //             keys: barChartKeys,
  //           },
  //         });

  //         globalDispatch({
  //           action: globalAction.setSelectedChartKind,
  //           payload: "bar",
  //         });

  //         navigate(expandBarChartNavigateLink);
  //       }}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({
  //           arg,
  //           kind: "bar",
  //           chartUnitKind,
  //         })}
  //     />
  //   )
  //   : barLineRadialChartKind === "line"
  //   ? (
  //     <ResponsiveLineChart
  //       chartUnitKind={chartUnitKind}
  //       hideControls
  //       lineChartData={lineCharts[yAxisKey]}
  //       onClick={() => {
  //         globalDispatch({
  //           action: globalAction.setExpandLineChartData,
  //           payload: {
  //             ...commonPayload,
  //             chartData: lineCharts[yAxisKey],
  //             chartKind: "line",
  //           },
  //         });

  //         globalDispatch({
  //           action: globalAction.setSelectedChartKind,
  //           payload: "line",
  //         });

  //         navigate(expandLineChartNavigateLink);
  //       }}
  //       xFormat={(x) =>
  //         `${
  //           calendarView === "Daily"
  //             ? "Day - "
  //             : calendarView === "Yearly"
  //             ? "Year - "
  //             : ""
  //         }${x}`}
  //       yFormat={(y) => addCommaSeparator(y) + chartUnitKind}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({
  //           arg,
  //           calendarView,
  //           chartUnitKind,
  //           kind: "line",
  //         })}
  //     />
  //   )
  //   : (
  //     <ResponsiveRadialBarChart
  //       radialBarChartData={lineCharts[yAxisKey]}
  //       hideControls
  //       onClick={() => {
  //         globalDispatch({
  //           action: globalAction.setExpandRadialBarChartData,
  //           payload: {
  //             ...commonPayload,
  //             chartData: lineCharts[yAxisKey],
  //             chartKind: "radial",
  //           },
  //         });

  //         globalDispatch({
  //           action: globalAction.setSelectedChartKind,
  //           payload: "radial",
  //         });

  //         navigate(expandRadialBarChartNavigateLink);
  //       }}
  //       tooltip={(arg) =>
  //         createChartTooltipElement({
  //           arg,
  //           chartUnitKind,
  //           kind: "radial",
  //         })}
  //     />
  //   );

  const calendarChartData = returnSelectedCalendarCharts(
    calendarChartsData,
    yAxisKey,
    metricCategory,
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

  const selectedCards = returnFinancialMetricsCards(
    {
      financialMetricsCards,
      calendarView,
      metricCategory,
      yAxisKey,
      financialYAxisKeyToCardsKeyMap: FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
    },
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
    Map<string, boolean>
  >(
    new Map([
      ["Total", false],
      ["Sales Total", false],
      ["Repair", false],
      ["Sales In-Store", false],
      ["Sales Online", false],
    ]),
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

  const consolidatedCards = consolidateCardsAndStatisticsModals({
    modalsOpenedState,
    selectedCards,
    setModalsOpenedState,
  });

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    yAxisKey,
    FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <DashboardLayoutContainer
      barChart={barChart}
      calendarChart={calendarChart}
      calendarView={calendarView}
      chartsToYAxisKeysMap={FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP}
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

export default PERT;
