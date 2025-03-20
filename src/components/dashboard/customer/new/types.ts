import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { NewAction } from "./actions";

type NewState = {
  barLineChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: CustomerNewReturningCalendarChartsKey;
  pieChartYAxisVariable: CustomerMetricsNewReturningPieChartsKey;
};

type NewDispatch = {
  action: NewAction["setBarLineChartYAxisVariable"];
  payload: CustomerMetricsNewReturningChartsKey;
} | {
  action: NewAction["setBarLineChartKind"];
  payload: "bar" | "line";
} | {
  action: NewAction["setCalendarChartYAxisVariable"];
  payload: CustomerNewReturningCalendarChartsKey;
} | {
  action: NewAction["setPieChartYAxisVariable"];
  payload: CustomerMetricsNewReturningPieChartsKey;
};

export type { NewDispatch, NewState };
