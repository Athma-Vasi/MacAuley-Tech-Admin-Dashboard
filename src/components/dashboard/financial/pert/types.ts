import { ChartKindSegment } from "../../types";
import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsCalendarChartsKeyPERT,
  FinancialMetricsPieChartsKey,
} from "../chartsData";
import { PERTAction } from "./actions";

type PERTState = {
  barLineRadialChartYAxis: FinancialMetricsBarLineChartsKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: FinancialMetricsCalendarChartsKeyPERT;
  pieChartYAxis: FinancialMetricsPieChartsKey;
};

type PERTDispatch =
  | {
    action: PERTAction["setBarLineRadialChartYAxis"];
    payload: FinancialMetricsBarLineChartsKey;
  }
  | {
    action: PERTAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: PERTAction["setCalendarChartYAxis"];
    payload: FinancialMetricsCalendarChartsKeyPERT;
  }
  | {
    action: PERTAction["setPieChartYAxisVariable"];
    payload: FinancialMetricsPieChartsKey;
  };

export type { PERTDispatch, PERTState };
