import { ChartKindSegment } from "../../types";
import {
  CustomerChurnRetentionCalendarChartsKey,
  CustomerMetricsChurnRetentionChartsKey,
} from "../chartsData";

type ChurnRetentionState = {
  barLineRadialChartYAxis: CustomerMetricsChurnRetentionChartsKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: CustomerChurnRetentionCalendarChartsKey;
};

type ChurnRetentionDispatch = {
  action: "setBarLineRadialChartYAxis";
  payload: CustomerMetricsChurnRetentionChartsKey;
} | {
  action: "setBarLineRadialChartKind";
  payload: ChartKindSegment;
} | {
  action: "setCalendarChartYAxis";
  payload: CustomerChurnRetentionCalendarChartsKey;
};

export type { ChurnRetentionDispatch, ChurnRetentionState };
