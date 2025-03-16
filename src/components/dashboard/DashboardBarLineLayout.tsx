import { FinancialMetricsBarLineChartsKey } from "./financial/chartsData";

type DashboardBarLineLayoutProps = {
    barChart: React.JSX.Element;
    barChartHeading: string;
    barChartYAxisSelectInput: React.JSX.Element;
    chartKind: "bar" | "line";
    consolidatedCards: Map<FinancialMetricsBarLineChartsKey, React.JSX.Element>;
    expandBarChartButton: React.JSX.Element;
    expandLineChartButton: React.JSX.Element;
    lineChart: React.JSX.Element;
    lineChartHeading: string;
    lineChartYAxisSelectInput: React.JSX.Element;
    sectionHeading: string;
    semanticLabel?: string;
};

function DashboardBarLineLayout(
    {
        barChart,
        barChartHeading,
        barChartYAxisSelectInput,
        chartKind,
        consolidatedCards,
        expandBarChartButton,
        expandLineChartButton,
        lineChart,
        lineChartHeading,
        lineChartYAxisSelectInput,
        sectionHeading,
        semanticLabel,
    }: DashboardBarLineLayoutProps,
) {}

export default DashboardBarLineLayout;
