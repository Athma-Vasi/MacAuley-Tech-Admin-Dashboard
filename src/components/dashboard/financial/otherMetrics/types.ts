import {
  FinancialMetricsCalendarChartsKeyOtherMetrics,
  FinancialMetricsOtherMetricsChartsKey,
} from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  barLineChartYAxisVariable: FinancialMetricsOtherMetricsChartsKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: FinancialMetricsCalendarChartsKeyOtherMetrics;
};

type OtherMetricsDispatch =
  | {
    action: OtherMetricsAction["setBarLineChartYAxisVariable"];
    payload: FinancialMetricsOtherMetricsChartsKey;
  }
  | {
    action: OtherMetricsAction["setBarLineChartKind"];
    payload: "bar" | "line";
  }
  | {
    action: OtherMetricsAction["setCalendarChartYAxisVariable"];
    payload: FinancialMetricsCalendarChartsKeyOtherMetrics;
  };

export type { OtherMetricsDispatch, OtherMetricsState };
