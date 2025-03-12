import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsPieChartsKey,
} from "../chartsData";
import { PERTAction } from "./actions";

type PERTState = {
  barChartYAxisVariable: FinancialMetricsBarLineChartsKey;
  lineChartYAxisVariable: FinancialMetricsBarLineChartsKey;
  pieChartYAxisVariable: FinancialMetricsPieChartsKey;
};

type PERTDispatch =
  | {
      action: PERTAction["setBarChartYAxisVariable"];
      payload: FinancialMetricsBarLineChartsKey;
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
