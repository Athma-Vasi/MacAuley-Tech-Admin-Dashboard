import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsPieChartsKey,
} from "../chartsData";
import { PERTAction } from "./actions";

type PERTState = {
  barChartYAxisVariable: FinancialMetricsBarLineChartsKey;
  chartKind: "bar" | "line";
  lineChartYAxisVariable: FinancialMetricsBarLineChartsKey;
  pieChartYAxisVariable: FinancialMetricsPieChartsKey;
};

type PERTDispatch =
  | {
    action: PERTAction["setBarChartYAxisVariable"];
    payload: FinancialMetricsBarLineChartsKey;
  }
  | {
    action: PERTAction["setChartKind"];
    payload: "bar" | "line";
  }
  | {
    action: PERTAction["setLineChartYAxisVariable"];
    payload: FinancialMetricsBarLineChartsKey;
  }
  | {
    action: PERTAction["setPieChartYAxisVariable"];
    payload: FinancialMetricsPieChartsKey;
  };

export type { PERTDispatch, PERTState };
