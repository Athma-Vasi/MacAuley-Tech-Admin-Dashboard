import { ProductMetricsChartKey } from "../chartsData";
import { RUSAction } from "./actions";

type RUSState = {
  yAxisKey: ProductMetricsChartKey;
};

type RUSDispatch = {
  action: RUSAction["setYAxisKey"];
  payload: ProductMetricsChartKey;
};

export type { RUSDispatch, RUSState };
