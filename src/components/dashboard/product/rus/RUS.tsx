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
import {
  type ProductMetricsCards,
  returnProductMetricsCards,
} from "../../product/cards";
import type { ProductMetricsCharts } from "../../product/chartsData";
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
  returnCardElementsForYAxisVariable,
} from "../../utilsTSX";
import {
  PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
  PRODUCT_METRICS_CALENDAR_Y_AXIS_DATA,
} from "../constants";
import type { ProductSubMetric } from "../types";
import { rusAction } from "./actions";
import { rusReducer } from "./reducers";
import { initialRUSState } from "./state";

type RUSProps = {
  calendarView: DashboardCalendarView;
  day: string;
  subMetric: ProductSubMetric;
  metricsView: DashboardMetricsView;
  month: string;
  productMetricsCards: ProductMetricsCards;
  productMetricsCharts: ProductMetricsCharts;
  storeLocation: BusinessMetricStoreLocation;
  year: Year;
};

/** RUS: Revenue | Units Sold */
function RUS({
  calendarView,
  productMetricsCards,
  productMetricsCharts,
  day,
  subMetric,
  metricsView,
  month,
  storeLocation,
  year,
}: RUSProps) {
  const { globalDispatch } = useGlobalState();
  const navigate = useNavigate();

  const [rusState, rusDispatch] = React.useReducer(rusReducer, initialRUSState);

  const {
    barLineChartKind,
    barLineChartYAxisVariable,
    calendarChartYAxisVariable,
  } = rusState;

  const charts = calendarView === "Daily"
    ? productMetricsCharts.dailyCharts
    : calendarView === "Monthly"
    ? productMetricsCharts.monthlyCharts
    : productMetricsCharts.yearlyCharts;

  const {
    bar: barCharts,
    line: lineCharts,
    pie: pieCharts,
  } = subMetric === "revenue" ? charts.revenue : charts.unitsSold;

  // const {
  //   barChartHeading,
  //   expandBarChartNavigateLink,
  //   expandLineChartNavigateLink,
  //   expandPieChartNavigateLink,
  //   lineChartHeading,
  //   pieChartHeading,
  // } = returnChartTitleNavigateLinks({
  //   calendarView,
  //   metricCategory: subMetric,
  //   metricsView,
  //   storeLocation,
  //   yAxisBarChartVariable: barChartYAxisVariable,
  //   yAxisLineChartVariable: lineChartYAxisVariable,
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
  } = createExpandChartNavigateLinks(metricsView, calendarView, subMetric);

  const { barLineChartHeading, calendarChartHeading, pieChartHeading } =
    returnChartTitles({
      barLineChartYAxisVariable,
      calendarView,
      metricCategory: subMetric,
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
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setBarLineChartKind,
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
        data: PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
        name: "Y-Axis Bar",
        parentDispatch: rusDispatch,
        validValueAction: rusAction.setBarLineChartYAxisVariable,
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
        keys={PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA.map((obj) => obj.label)}
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
        yFormat={(y) => `${addCommaSeparator(y)} Products`}
        unitKind="number"
      />
    );

  // const calendarChartData = returnSelectedCalendarCharts(
  //   calendarChartsData,
  //   calendarChartYAxisVariable,
  //   metricCategory,
  // );

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
          data: PRODUCT_METRICS_CALENDAR_Y_AXIS_DATA,
          name: "Y-Axis Pie",
          parentDispatch: rusDispatch,
          validValueAction: rusAction.setCalendarChartYAxisVariable,
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

  const selectedCards = returnProductMetricsCards(
    productMetricsCards,
    calendarView,
    subMetric,
  );
  // const overviewCards = subMetric === "revenue"
  //   ? selectedCards.revenue
  //   : selectedCards.unitsSold;

  const statisticsMap = returnStatistics(barCharts);

  const statisticsElements = createStatisticsElements(
    calendarView,
    subMetric,
    statisticsMap,
    storeLocation,
  );

  const consolidatedCards = consolidateCardsAndStatistics(
    selectedCards,
    statisticsElements,
  );

  const cardsWithStatisticsElements = returnCardElementsForYAxisVariable(
    consolidatedCards,
    barLineChartYAxisVariable,
    PRODUCT_BAR_LINE_YAXIS_KEY_TO_CARDS_KEY_MAP,
  );

  console.group(
    `RUS: ${calendarView} ${subMetric} ${storeLocation}`,
  );
  console.log("barCharts", barCharts);
  console.log("lineCharts", lineCharts);
  console.log("pieCharts", pieCharts);
  console.log("selectedCards", selectedCards);
  console.log("statisticsMap", statisticsMap);
  console.log("statisticsElements", statisticsElements);
  console.log("consolidatedCards", consolidatedCards);
  console.groupEnd();

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
        expandPieChartButton={expandPieChartButton}
        pieChart={pieChart}
        pieChartHeading={pieChartHeading}
        expandCalendarChartButton={expandCalendarChartButton}
        calendarChartYAxisSelectInput={calendarChartYAxisVariableSelectInput}
        cardsWithStatisticsElements={cardsWithStatisticsElements}
        expandBarLineChartButton={expandBarLineChartButton}
        sectionHeading={splitCamelCase(metricsView)}
        semanticLabel="TODO"
      />
    </Stack>
  );
}

export { RUS };
