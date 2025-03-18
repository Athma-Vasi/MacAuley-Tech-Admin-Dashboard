import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  barLineChartYAxisVariable: FinancialMetricsOtherMetricsChartsKey;
  barLineChartKind: "bar" | "line";
};

type OtherMetricsDispatch =
  | {
    action: OtherMetricsAction["setBarLineChartYAxisVariable"];
    payload: FinancialMetricsOtherMetricsChartsKey;
  }
  | {
    action: OtherMetricsAction["setBarLineChartKind"];
    payload: "bar" | "line";
  };

export type { OtherMetricsDispatch, OtherMetricsState };
