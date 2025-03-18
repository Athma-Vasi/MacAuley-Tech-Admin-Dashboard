import { Flex, Group, Stack, Text } from "@mantine/core";
import React from "react";
import {
    FinancialMetricsBarLineChartsKey,
    FinancialMetricsOtherMetricsChartsKey,
} from "./financial/chartsData";
import { YAXIS_KEY_TO_CARDS_KEY_MAP } from "./financial/constants";

type DashboardBarLineLayoutProps = {
    barLineChart: React.JSX.Element;
    barLineChartHeading: string;
    barLineChartYAxisSelectInput: React.JSX.Element;
    barLineChartKindSegmentedControl: React.JSX.Element;
    barLineChartYAxisVariable:
        | FinancialMetricsBarLineChartsKey
        | FinancialMetricsOtherMetricsChartsKey;
    calendarChart: React.JSX.Element | null;
    calendarChartHeading: string;
    calendarChartYAxisSelectInput: React.JSX.Element | null;
    consolidatedCards: Map<FinancialMetricsBarLineChartsKey, React.JSX.Element>;
    expandBarLineChartButton: React.JSX.Element;
    expandCalendarChartButton: React.JSX.Element | null;
    expandPieChartButton?: React.JSX.Element;
    pieChart?: React.JSX.Element;
    pieChartHeading?: string;
    pieChartYAxisSelectInput?: React.JSX.Element;
    sectionHeading: string;
    semanticLabel?: string;
};

function DashboardBarLineLayout(
    {
        barLineChart,
        barLineChartHeading,
        barLineChartKindSegmentedControl,
        barLineChartYAxisSelectInput,
        barLineChartYAxisVariable,
        calendarChart,
        calendarChartHeading,
        calendarChartYAxisSelectInput,
        consolidatedCards,
        expandBarLineChartButton,
        expandCalendarChartButton,
        expandPieChartButton,
        pieChart,
        pieChartHeading,
        pieChartYAxisSelectInput,
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

    const dashboardBarLineLayout = (
        <Stack>
            <Text>{sectionHeading}</Text>
            <Stack>
                <Text>{pieChartHeading}</Text>
                {pieChartYAxisSelectInput}
                {expandPieChartButton}
                {pieChart}
            </Stack>

            <Group w="100%" position="apart">
                <Text>{barLineChartHeading}</Text>
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

            <Stack>
                <Text>{calendarChartHeading}</Text>
                {calendarChartYAxisSelectInput}
                {expandCalendarChartButton}
                {calendarChart}
            </Stack>
        </Stack>
    );

    return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
