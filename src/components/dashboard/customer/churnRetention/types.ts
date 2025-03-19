import {
  CustomerChurnRetentionCalendarChartsKey,
  CustomerMetricsChurnRetentionChartsKey,
} from "../chartsData";

type ChurnRetentionState = {
  barLineChartYAxisVariable: CustomerMetricsChurnRetentionChartsKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: CustomerChurnRetentionCalendarChartsKey;
};

type ChurnRetentionDispatch = {
  action: "setBarLineChartYAxisVariable";
  payload: CustomerMetricsChurnRetentionChartsKey;
} | {
  action: "setBarLineChartKind";
  payload: "bar" | "line";
} | {
  action: "setCalendarChartYAxisVariable";
  payload: CustomerChurnRetentionCalendarChartsKey;
};

export type { ChurnRetentionDispatch, ChurnRetentionState };
