import { ChartKindSegment } from "../../types";
import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { OtherMetricsAction } from "./actions";

type OtherMetricsState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: FinancialMetricsOtherMetricsChartsKey;
};

type OtherMetricsDispatch =
  | {
    action: OtherMetricsAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: OtherMetricsAction["setYAxisKey"];
    payload: FinancialMetricsOtherMetricsChartsKey;
  };

export type { OtherMetricsDispatch, OtherMetricsState };
