import { Stack } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { FinancialMetricsPieChartsKey } from "../../financial/chartsData";
import {
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
  returnCardElementsForYAxisVariable,
  returnStatisticsModals,
} from "../../utilsTSX";
import { CustomerMetricsCards, returnCustomerMetricsCardsMap } from "../cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
  CustomerMetricsNewReturningChartsKey,
  returnCalendarViewCustomerCharts,
} from "../chartsData";
import {
  CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP,
  CUSTOMER_NEW_RETURNING_Y_AXIS_DATA,
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
  returningOverviewCards: React.JSX.Element;
  storeLocation: AllStoreLocations;
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
  const { globalState: { themeObject }, globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [returningState, returningDispatch] = React.useReducer(
    returningReducer,
    initialReturningState,
  );

  const {
    barLineRadialChartKind,
    yAxisKey,
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
      calendarView,
      metricCategory,
      metricsView,
      yAxisKey,
    },
  );

  const { yAxisKeyChartHeading } = returnChartTitles({
    calendarView,
    metricCategory,
    storeLocation,
    subMetric: "Customers",
    yAxisKey,
  });

  const chartUnitKind = "" as ChartUnitKind;
  const commonPayload = {
    calendarView,
    chartUnitKind,
    day,
    month,
    year,
    yAxisKey,
    yAxisKeyChartHeading,
  };

  const yAxisKeySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_NEW_RETURNING_Y_AXIS_DATA,
        name: "Y-Axis",
        parentDispatch: returningDispatch,
        validValueAction: returningAction.setYAxisKey,
        value: yAxisKey,
      }}
    />
  );

  const expandPieChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Expand and customize pie chart",
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
              chartData: pieCharts[yAxisKey as FinancialMetricsPieChartsKey],
              chartKind: "pie",
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

  const pieChart = (
    <ResponsivePieChart
      chartUnitKind={chartUnitKind}
      hideControls
      pieChartData={pieCharts[yAxisKey as FinancialMetricsPieChartsKey]}
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
  const barChartKeys = CUSTOMER_NEW_RETURNING_Y_AXIS_DATA.map((obj) =>
    obj.label
  );

  const expandBarLineRadialChartButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText:
          `Expand and customize ${barLineRadialChartKind} chart`,
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
        enabledScreenreaderText: "Expand and customize calendar chart",
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
    CustomerMetricsNewReturningChartsKey
  >(
    barCharts,
  );

  const cardsMap = returnCustomerMetricsCardsMap(
    {
      calendarView,
      customerMetricsCards,
      customerYAxisKeyToCardsKeyMap:
        CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
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
      ["Total Returning", false],
      ["Sales", false],
      ["Sales Online", false],
      ["Sales In-Store", false],
      ["Repair", false],
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

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    yAxisKey,
    CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  return (
    <Stack>
      <DashboardBarLineLayout
        barLineRadialChart={barLineRadialChart}
        barLineRadialChartKindSegmentedControl={barLineRadialChartKindSegmentedControl}
        calendarChart={calendarChart}
        calendarView={calendarView}
        consolidatedCards={cardsWithStatisticsElements}
        expandBarLineRadialChartButton={expandBarLineRadialChartButton}
        expandCalendarChartButton={expandCalendarChartButton}
        expandPieChartButton={expandPieChartButton}
        pieChart={pieChart}
        sectionHeading="Returning Customers"
        semanticLabel="TODO"
        statisticsModals={statisticsModals}
        yAxisKey={yAxisKey}
        yAxisKeyChartHeading={yAxisKeyChartHeading}
        yAxisKeySelectInput={yAxisKeySelectInput}
        chartsToYAxisKeysMap={CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP}
      />
    </Stack>
  );
}

export default Returning;
