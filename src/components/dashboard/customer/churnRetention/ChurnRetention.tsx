import React from "react";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mantine/core";
import { COLORS_SWATCHES } from "../../../../constants";
import { globalAction } from "../../../../context/globalProvider/actions";
import { useGlobalState } from "../../../../hooks/useGlobalState";
import { addCommaSeparator, returnThemeColors } from "../../../../utils";
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
  createStatisticsElements,
  returnStatisticsModals,
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
  CUSTOMER_CHARTS_CHURN_TO_Y_AXIS_KEYS_MAP,
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
  churnOverviewCards: React.JSX.Element;
  customerMetricsCards: CustomerMetricsCards;
  customerMetricsCharts: CustomerMetricsCharts;
  day: string;
  metricCategory: CustomerMetricsCategory;
  metricsView: DashboardMetricsView;
  month: string;
  storeLocation: AllStoreLocations;
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
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [churnRetentionState, churnRetentionDispatch] = React.useReducer(
    churnRetentionReducer,
    initialChurnRetentionState,
  );

  const {
    barLineRadialChartKind,
    yAxisKey,
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
    expandRadialBarChartNavigateLink,
  } = createExpandChartNavigateLinks({
    calendarView,
    metricsView,
    yAxisKey,
  });

  const { yAxisKeyChartHeading } = returnChartTitles({
    calendarView,
    metricCategory: "",
    storeLocation,
    yAxisKey,
  });

  const chartUnitKind = "%" as ChartUnitKind;
  const commonPayload = {
    calendarView,
    chartUnitKind,
    day,
    month,
    yAxisKey,
    yAxisKeyChartHeading,
    year,
  };

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: churnRetentionDispatch,
        validValueAction: churnRetentionAction.setYAxisKey,
        value: yAxisKey,
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
            action: globalAction.setExpandPieChartData,
            payload: {
              ...commonPayload,
              chartData: pieCharts,
              chartKind: "pie",
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
      pieChartData={pieCharts}
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
        parentDispatch: churnRetentionDispatch,
        validValueAction: churnRetentionAction.setBarLineRadialChartKind,
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
  const barChartKeys = CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA.map((obj) =>
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
          }

          if (barLineRadialChartKind === "line") {
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
          }

          if (barLineRadialChartKind === "radial") {
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

  const barLineRadialChart = barLineRadialChartKind === "bar"
    ? (
      <ResponsiveBarChart
        barChartData={barCharts[yAxisKey]}
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
        lineChartData={lineCharts[yAxisKey]}
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
        radialBarChartData={lineCharts[yAxisKey]}
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
    yAxisKey,
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
              chartData: calendarChartData,
              chartKind: "calendar",
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

  const calendarChart = (
    <ResponsiveCalendarChart
      calendarChartData={calendarChartData}
      hideControls
      from={`${year}-01-01`}
      to={`${year}-12-31`}
      tooltip={(arg) =>
        createChartTooltipElement({
          arg,
          chartUnitKind,
          kind: "calendar",
          yAxisKey,
        })}
    />
  );

  const statisticsMap = returnStatistics<
    CustomerMetricsChurnRetentionChartsKey
  >(
    barCharts,
  );

  const cardsMap = returnCustomerMetricsCardsMap(
    {
      calendarView,
      customerMetricsCards,
      customerYAxisKeyToCardsKeyMap:
        CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
      yAxisKey,
    },
  );

  const statisticsElementsMap = createStatisticsElements(
    calendarView,
    metricCategory,
    statisticsMap,
    storeLocation,
  );

  const [modalsOpenedState, setModalsOpenedState] = React.useState<
    Map<string, boolean>
  >(
    new Map([
      ["Churn Rate", false],
      ["Retention Rate", false],
    ]),
  );

  const consolidatedCards = consolidateCardsAndStatisticsModals({
    modalsOpenedState,
    selectedCards: cardsMap.get(metricCategory) ?? new Map(),
    setModalsOpenedState,
  });

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
    <Stack>
      <DashboardBarLineLayout
        barLineRadialChart={barLineRadialChart}
        barLineRadialChartKindSegmentedControl={barLineRadialChartKindSegmentedControl}
        calendarChart={calendarChart}
        calendarView={calendarView}
        consolidatedCards={consolidatedCards}
        expandBarLineRadialChartButton={expandBarLineRadialChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        expandPieChartButton={expandPieChartButton}
        pieChart={pieChart}
        sectionHeading="Customers Churn"
        semanticLabel="TODO"
        statisticsModals={statisticsModals}
        yAxisKey={yAxisKey}
        yAxisKeyChartHeading={yAxisKeyChartHeading}
        yAxisKeySelectInput={yAxisKeySelectInput}
        chartsToYAxisKeysMap={CUSTOMER_CHARTS_CHURN_TO_Y_AXIS_KEYS_MAP}
      />
    </Stack>
  );
}

export { ChurnRetention };
