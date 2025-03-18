import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";

type ChurnRetentionState = {
  barLineChartYAxisVariable: CustomerMetricsChurnRetentionChartsKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: CustomerMetricsChurnRetentionChartsKey;
};

type ChurnRetentionDispatch = {
  action: "setBarLineChartYAxisVariable";
  payload: CustomerMetricsChurnRetentionChartsKey;
} | {
  action: "setBarLineChartKind";
  payload: "bar" | "line";
} | {
  action: "setCalendarChartYAxisVariable";
  payload: CustomerMetricsChurnRetentionChartsKey;
};

export type { ChurnRetentionDispatch, ChurnRetentionState };
