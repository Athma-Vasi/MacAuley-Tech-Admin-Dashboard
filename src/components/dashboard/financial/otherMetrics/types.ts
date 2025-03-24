import { ChartKindSegment } from "../../types";
import {
  FinancialMetricsCalendarChartsKeyOtherMetrics,
  FinancialMetricsOtherMetricsChartsKey,
} from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  barLineRadialChartYAxis: FinancialMetricsOtherMetricsChartsKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: FinancialMetricsCalendarChartsKeyOtherMetrics;
};

type OtherMetricsDispatch =
  | {
    action: OtherMetricsAction["setBarLineRadialChartYAxis"];
    payload: FinancialMetricsOtherMetricsChartsKey;
  }
  | {
    action: OtherMetricsAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: OtherMetricsAction["setCalendarChartYAxis"];
    payload: FinancialMetricsCalendarChartsKeyOtherMetrics;
  };

export type { OtherMetricsDispatch, OtherMetricsState };
