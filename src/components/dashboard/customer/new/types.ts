import { CustomerMetricsNewReturningChartsKey } from "../chartsData";

type NewState = {
    barLineChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
    barLineChartKind: "bar" | "line";
    calendarChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
    pieChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
};

type NewDispatch = {
    action: NewAction["setBarLineChartYAxisVariable"];
    payload: CustomerMetricsNewReturningChartsKey;
} | {
    action: NewAction["setBarLineChartKind"];
    payload: "bar" | "line";
} | {
    action: NewAction["setCalendarChartYAxisVariable"];
    payload: CustomerMetricsNewReturningChartsKey;
} | {
    action: NewAction["setPieChartYAxisVariable"];
    payload: CustomerMetricsNewReturningChartsKey;
};

export type { NewDispatch, NewState };
