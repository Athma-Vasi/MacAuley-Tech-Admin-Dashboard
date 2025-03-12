import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  barChartYAxisVariable: FinancialMetricsOtherMetricsChartsKey;
  lineChartYAxisVariable: FinancialMetricsOtherMetricsChartsKey;
};

type OtherMetricsDispatch =
  | {
      action: OtherMetricsAction["setBarChartYAxisVariable"];
      payload: FinancialMetricsOtherMetricsChartsKey;
    }
  | {
      action: OtherMetricsAction["setLineChartYAxisVariable"];
      payload: FinancialMetricsOtherMetricsChartsKey;
    };

export type { OtherMetricsDispatch, OtherMetricsState };
