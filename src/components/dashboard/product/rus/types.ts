import { ChartKindSegment } from "../../types";
import { ProductMetricsChartKey } from "../chartsData";
import { RUSAction } from "./actions";

type RUSState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: ProductMetricsChartKey;
};

type RUSDispatch =
  | {
    action: RUSAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: RUSAction["setYAxisKey"];
    payload: ProductMetricsChartKey;
  };

export type { RUSDispatch, RUSState };
