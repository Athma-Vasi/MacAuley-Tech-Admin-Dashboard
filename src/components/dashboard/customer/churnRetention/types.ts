import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";

type ChurnRetentionState = {
  churnRetentionBarChartYAxisVariable: CustomerMetricsChurnRetentionChartsKey;
  churnRetentionLineChartYAxisVariable: CustomerMetricsChurnRetentionChartsKey;
};

type ChurnRetentionDispatch = {
  action:
    | "setChurnRetentionBarChartYAxisVariable"
    | "setChurnRetentionLineChartYAxisVariable";
  payload: CustomerMetricsChurnRetentionChartsKey;
};

export type { ChurnRetentionDispatch, ChurnRetentionState };
