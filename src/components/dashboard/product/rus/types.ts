import { ProductMetricsChartKey } from "../chartsData";
import { RUSAction } from "./actions";

type RUSState = {
  barChartYAxisVariable: ProductMetricsChartKey;
  lineChartYAxisVariable: ProductMetricsChartKey;
};

type RUSDispatch =
  | {
      action: RUSAction["setBarChartYAxisVariable"];
      payload: ProductMetricsChartKey;
    }
  | {
      action: RUSAction["setLineChartYAxisVariable"];
      payload: ProductMetricsChartKey;
    };

export type { RUSDispatch, RUSState };
