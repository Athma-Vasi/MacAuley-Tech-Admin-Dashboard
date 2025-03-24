import { ChartKindSegment } from "../../types";
import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { NewAction } from "./actions";

type NewState = {
  barLineRadialChartYAxis: CustomerMetricsNewReturningChartsKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: CustomerNewReturningCalendarChartsKey;
  pieChartYAxis: CustomerMetricsNewReturningPieChartsKey;
};

type NewDispatch = {
  action: NewAction["setBarLineRadialChartYAxis"];
  payload: CustomerMetricsNewReturningChartsKey;
} | {
  action: NewAction["setBarLineRadialChartKind"];
  payload: ChartKindSegment;
} | {
  action: NewAction["setCalendarChartYAxis"];
  payload: CustomerNewReturningCalendarChartsKey;
} | {
  action: NewAction["setPieChartYAxis"];
  payload: CustomerMetricsNewReturningPieChartsKey;
};

export type { NewDispatch, NewState };
