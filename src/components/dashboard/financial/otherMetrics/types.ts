import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  yAxisKey: FinancialMetricsOtherMetricsChartsKey;
};

type OtherMetricsDispatch = {
  action: OtherMetricsAction["setYAxisKey"];
  payload: FinancialMetricsOtherMetricsChartsKey;
};

export type { OtherMetricsDispatch, OtherMetricsState };
