import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { ReturningAction } from "./actions";

type ReturningState = {
  barLineChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: CustomerNewReturningCalendarChartsKey;
  pieChartYAxisVariable: CustomerMetricsNewReturningPieChartsKey;
};

type ReturningDispatch = {
  action: ReturningAction["setBarLineChartYAxisVariable"];
  payload: CustomerMetricsNewReturningChartsKey;
} | {
  action: ReturningAction["setBarLineChartKind"];
  payload: "bar" | "line";
} | {
  action: ReturningAction["setCalendarChartYAxisVariable"];
  payload: CustomerNewReturningCalendarChartsKey;
} | {
  action: ReturningAction["setPieChartYAxisVariable"];
  payload: CustomerMetricsNewReturningPieChartsKey;
};

export type { ReturningDispatch, ReturningState };
