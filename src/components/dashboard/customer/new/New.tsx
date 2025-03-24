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
    ResponsiveRadialBarChart,
} from "../../../charts";
import { createChartTooltipElement } from "../../../charts/utils";
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
    CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
} from "../constants";
import { CustomerMetricsCategory } from "../types";
import { newAction } from "./actions";
import { newReducer } from "./reducers";
import { initialNewState } from "./state";

type NewProps = {
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
    newOverviewCards: {
        lifetimeValue: React.JSX.Element;
        totalCustomers: React.JSX.Element;
        dailyNewCustomers: React.JSX.Element;
    };
    storeLocation: BusinessMetricStoreLocation;
    year: Year;
};

function New(
    {
        calendarChartsData,
        calendarView,
        customerMetricsCards,
        customerMetricsCharts,
        day,
        metricCategory,
        metricsView,
        month,
        newOverviewCards,
        storeLocation,
        year,
    }: NewProps,
) {
    const { globalDispatch } = useGlobalState();
    const navigate = useNavigate();

    const [newState, newDispatch] = React.useReducer(
        newReducer,
        initialNewState,
    );

    const {
        barLineRadialChartKind,
        barLineRadialChartYAxis,
        calendarChartYAxis,
        pieChartYAxis,
    } = newState;

    const charts = returnCalendarViewCustomerCharts(
        calendarView,
        customerMetricsCharts,
    );

    const {
        new: { bar: barCharts, line: lineCharts, pie: pieCharts },
    } = charts;

    const {
        expandBarChartNavigateLink,
        expandCalendarChartNavigateLink,
        expandLineChartNavigateLink,
        expandPieChartNavigateLink,
        expandRadialBarChartNavigateLink,
    } = createExpandChartNavigateLinks(
        {
            barLineRadialChartYAxis,
            calendarChartYAxis,
            calendarView,
            metricCategory,
            metricsView,
            pieChartYAxis,
        },
    );

    const { barLineRadialChartHeading, calendarChartHeading, pieChartHeading } =
        returnChartTitles({
            barLineRadialChartYAxis,
            calendarView,
            metricCategory,
            pieChartYAxis,
            storeLocation,
            subMetric: "Customers",
            calendarChartYAxis,
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
                            chartData: pieCharts[pieChartYAxis],
                            chartTitle: pieChartHeading,
                            chartUnitKind: "number",
                        },
                    });

                    navigate(expandPieChartNavigateLink);
                },
            }}
        />
    );

    const pieChartYAxisSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
                name: "Y-Axis",
                parentDispatch: newDispatch,
                validValueAction: newAction.setPieChartYAxis,
                value: pieChartYAxis,
            }}
        />
    );

    const pieChart = (
        <ResponsivePieChart
            pieChartData={pieCharts[pieChartYAxis]}
            hideControls
            unitKind="number"
            tooltip={(arg) =>
                createChartTooltipElement({ arg, kind: "pie", unit: "" })}
        />
    );

    const barLineRadialChartKindSegmentedControl = (
        <AccessibleSegmentedControl
            attributes={{
                data: CHART_KIND_DATA,
                name: "chartKind",
                parentDispatch: newDispatch,
                validValueAction: newAction.setBarLineRadialChartKind,
                value: barLineRadialChartKind,
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
                            chartKind: barLineRadialChartKind,
                            chartData: barLineRadialChartKind === "bar"
                                ? barCharts[barLineRadialChartYAxis]
                                : lineCharts[barLineRadialChartYAxis],
                            chartTitle: barLineRadialChartHeading,
                            chartUnitKind: "number",
                        } as CustomizeChartsPageData,
                    });

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
                data: CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
                name: "Y-Axis",
                parentDispatch: newDispatch,
                validValueAction: newAction.setBarLineRadialChartYAxis,
                value: barLineRadialChartYAxis,
            }}
        />
    );

    const barLineRadialChart = barLineRadialChartKind === "bar"
        ? (
            <ResponsiveBarChart
                barChartData={barCharts[barLineRadialChartYAxis]}
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
                tooltip={(arg) =>
                    createChartTooltipElement({ arg, kind: "bar", unit: "" })}
            />
        )
        : barLineRadialChartKind === "line"
        ? (
            <ResponsiveLineChart
                lineChartData={lineCharts[barLineRadialChartYAxis]}
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
                tooltip={(arg) =>
                    createChartTooltipElement({ arg, kind: "line", unit: "" })}
            />
        )
        : (
            <ResponsiveRadialBarChart
                radialBarChartData={lineCharts[barLineRadialChartYAxis]}
                hideControls
                tooltip={(arg) =>
                    createChartTooltipElement({
                        arg,
                        kind: "radial",
                        unit: "",
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
    );

    const calendarChartYAxisSelectInput = (
        <AccessibleSelectInput
            attributes={{
                data: CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
                name: "Y-Axis",
                parentDispatch: newDispatch,
                validValueAction: newAction.setCalendarChartYAxis,
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
                createChartTooltipElement({ arg, kind: "calendar", unit: "" })}
        />
    );

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
        barLineRadialChartYAxis,
        CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
    );

    const overviewCards = (
        <>
            {newOverviewCards.totalCustomers}
            {newOverviewCards.lifetimeValue}
            {newOverviewCards.dailyNewCustomers}
        </>
    );

    return (
        <Stack>
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
                expandBarLineChartButton={expandBarLineChartButton}
                expandCalendarChartButton={expandCalendarChartButton}
                expandPieChartButton={expandPieChartButton}
                overviewCards={overviewCards}
                pieChart={pieChart}
                pieChartHeading={pieChartHeading}
                pieChartYAxisSelectInput={pieChartYAxisSelectInput}
                sectionHeading="New Customers"
                semanticLabel="Churn Retention"
            />
        </Stack>
    );
}

export default New;
