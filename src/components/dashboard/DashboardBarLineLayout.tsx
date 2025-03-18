import { Flex, Group, Stack } from "@mantine/core";
import React from "react";
import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { CHART_KIND_DATA } from "./constants";
import {
    FinancialMetricsBarLineChartsKey,
    FinancialMetricsCalendarCharts,
    FinancialMetricsOtherMetricsChartsKey,
} from "./financial/chartsData";
import { YAXIS_KEY_TO_CARDS_KEY_MAP } from "./financial/constants";
import {
    FinancialMetricCategory,
    FinancialYAxisVariables,
} from "./financial/types";

type DashboardBarLineLayoutProps = {
    barLineChart: React.JSX.Element;
    barLineChartHeading: string;
    barLineChartYAxisSelectInput: React.JSX.Element;
    barLineChartYAxisVariable:
        | FinancialMetricsBarLineChartsKey
        | FinancialMetricsOtherMetricsChartsKey;

    calendarChartsData: {
        currentYear: FinancialMetricsCalendarCharts | null;
        previousYear: FinancialMetricsCalendarCharts | null;
    };
    barLineChartKindSegmentedControl: React.JSX.Element;
    consolidatedCards: Map<FinancialMetricsBarLineChartsKey, React.JSX.Element>;
    expandBarLineChartButton: React.JSX.Element;
    sectionHeading: string;
    semanticLabel?: string;
};

function DashboardBarLineLayout(
    {
        barLineChart,
        barLineChartHeading,
        barLineChartYAxisSelectInput,
        barLineChartYAxisVariable,
        barLineChartKindSegmentedControl,
        calendarChartsData,
        consolidatedCards,
        expandBarLineChartButton,
        sectionHeading,
        semanticLabel,
    }: DashboardBarLineLayoutProps,
) {
    const cards = Array.from(consolidatedCards).map(([key, card], idx) => {
        const cardsSet = YAXIS_KEY_TO_CARDS_KEY_MAP.get(
            barLineChartYAxisVariable,
        );

        return cardsSet?.has(key)
            ? (
                <Group key={`${idx}-${key}`}>
                    {card}
                </Group>
            )
            : null;
    });

    console.log({ calendarChartsData });

    function returnCalendarCharts(
        calendarChartsData: {
            currentYear: FinancialMetricsCalendarCharts | null;
            previousYear: FinancialMetricsCalendarCharts | null;
        },
        yAxisVariable: FinancialYAxisVariables,
        metricCategory: FinancialMetricCategory,
    ) {
        const { currentYear, previousYear } = calendarChartsData;
        if (
            currentYear === null || previousYear === null
        ) {
            return {
                date: "",
                value: 0,
            };
        }

        const currentYearMetric = currentYear[metricCategory];
        const previousYearMetric = previousYear[metricCategory];
    }

    const dashboardBarLineLayout = (
        <Stack>
            <Group w="100%" position="apart">
                {barLineChartYAxisSelectInput}
                {barLineChartKindSegmentedControl}
                {expandBarLineChartButton}
            </Group>

            <Group w="100%" position="apart">
                <Flex wrap="wrap">
                    {cards}
                </Flex>
                {barLineChart}
            </Group>
        </Stack>
    );

    return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
