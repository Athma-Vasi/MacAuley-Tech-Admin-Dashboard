import { ChartKindSegment } from "../../types";
import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { ReturningAction } from "./actions";

type ReturningState = {
  barLineRadialChartYAxis: CustomerMetricsNewReturningChartsKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: CustomerNewReturningCalendarChartsKey;
  pieChartYAxis: CustomerMetricsNewReturningPieChartsKey;
};

type ReturningDispatch = {
  action: ReturningAction["setBarLineRadialChartYAxis"];
  payload: CustomerMetricsNewReturningChartsKey;
} | {
  action: ReturningAction["setBarLineRadialChartKind"];
  payload: ChartKindSegment;
} | {
  action: ReturningAction["setCalendarChartYAxis"];
  payload: CustomerNewReturningCalendarChartsKey;
} | {
  action: ReturningAction["setPieChartYAxis"];
  payload: CustomerMetricsNewReturningPieChartsKey;
};

export type { ReturningDispatch, ReturningState };
