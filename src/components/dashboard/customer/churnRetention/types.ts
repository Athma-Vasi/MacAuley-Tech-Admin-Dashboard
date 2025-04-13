import { ChartKindSegment } from "../../types";
import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";

type ChurnRetentionState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: CustomerMetricsChurnRetentionChartsKey;
};

type ChurnRetentionDispatch =
  | {
    action: "setBarLineRadialChartKind";
    payload: ChartKindSegment;
  }
  | {
    action: "setYAxisKey";
    payload: CustomerMetricsChurnRetentionChartsKey;
  };

export type { ChurnRetentionDispatch, ChurnRetentionState };
