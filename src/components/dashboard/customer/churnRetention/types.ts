import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";

type ChurnRetentionState = {
  yAxisKey: CustomerMetricsChurnRetentionChartsKey;
};

type ChurnRetentionDispatch = {
  action: "setYAxisKey";
  payload: CustomerMetricsChurnRetentionChartsKey;
};

export type { ChurnRetentionDispatch, ChurnRetentionState };
