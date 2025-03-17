import { Flex, Group, Stack } from "@mantine/core";
import React from "react";
import { AccessibleSegmentedControl } from "../accessibleInputs/AccessibleSegmentedControl";
import { CHART_KIND_DATA } from "./constants";
import {
    FinancialMetricsBarLineChartsKey,
    FinancialMetricsOtherMetricsChartsKey,
    FinancialMetricsPieChartsKey,
} from "./financial/chartsData";
import { YAXIS_KEY_TO_CARDS_KEY_MAP } from "./financial/constants";

type DashboardBarLineLayoutProps = {
    barChart: React.JSX.Element;
    barChartHeading: string;
    barChartYAxisSelectInput: React.JSX.Element;
    barChartYAxisVariable:
        | FinancialMetricsBarLineChartsKey
        | FinancialMetricsOtherMetricsChartsKey
        | FinancialMetricsPieChartsKey;
    consolidatedCards: Map<FinancialMetricsBarLineChartsKey, React.JSX.Element>;
    expandBarChartButton: React.JSX.Element;
    expandLineChartButton: React.JSX.Element;
    lineChart: React.JSX.Element;
    lineChartHeading: string;
    lineChartYAxisSelectInput: React.JSX.Element;
    lineChartYAxisVariable:
        | FinancialMetricsBarLineChartsKey
        | FinancialMetricsOtherMetricsChartsKey
        | FinancialMetricsPieChartsKey;
    sectionHeading: string;
    semanticLabel?: string;
};

function DashboardBarLineLayout(
    {
        barChart,
        barChartHeading,
        barChartYAxisSelectInput,
        barChartYAxisVariable,
        consolidatedCards,
        expandBarChartButton,
        expandLineChartButton,
        lineChart,
        lineChartHeading,
        lineChartYAxisSelectInput,
        lineChartYAxisVariable,
        sectionHeading,
        semanticLabel,
    }: DashboardBarLineLayoutProps,
) {
    const [chartKind, setChartKind] = React.useState("bar");

    const chartKindSegmentedControl = (
        <AccessibleSegmentedControl
            attributes={{
                data: CHART_KIND_DATA,
                name: "chartKind",
                parentDispatch: setChartKind as any,
                validValueAction: "setChartKind",
                value: chartKind,
                defaultValue: "bar",
                onChange: (value) => {
                    setChartKind(value);
                },
            }}
        />
    );

    const yAxisSelectInput = chartKind === "bar"
        ? barChartYAxisSelectInput
        : lineChartYAxisSelectInput;

    const expandChartButton = chartKind === "bar"
        ? expandBarChartButton
        : expandLineChartButton;

    const chart = chartKind === "bar" ? barChart : lineChart;

    const cards = Array.from(consolidatedCards).map(([key, card], idx) => {
        const yAxisVariable = chartKind === "bar"
            ? barChartYAxisVariable
            : lineChartYAxisVariable;
        const cardsSet = YAXIS_KEY_TO_CARDS_KEY_MAP.get(yAxisVariable);

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
            <Group w="100%" position="apart">
                {yAxisSelectInput}
                {chartKindSegmentedControl}
                {expandChartButton}
            </Group>

            <Group w="100%" position="apart">
                <Flex wrap="wrap">
                    {cards}
                </Flex>
                {chart}
            </Group>
        </Stack>
    );

    return dashboardBarLineLayout;
}

export default DashboardBarLineLayout;
