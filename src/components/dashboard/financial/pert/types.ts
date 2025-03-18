import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsPieChartsKey,
} from "../chartsData";
import { PERTAction } from "./actions";

type PERTState = {
  barLineChartYAxisVariable: FinancialMetricsBarLineChartsKey;
  barLineChartKind: "bar" | "line";
  pieChartYAxisVariable: FinancialMetricsPieChartsKey;
};

type PERTDispatch =
  | {
    action: PERTAction["setBarLineChartYAxisVariable"];
    payload: FinancialMetricsBarLineChartsKey;
  }
  | {
    action: PERTAction["setBarLineChartKind"];
    payload: "bar" | "line";
  }
  | {
    action: PERTAction["setPieChartYAxisVariable"];
    payload: FinancialMetricsPieChartsKey;
  };

export type { PERTDispatch, PERTState };
