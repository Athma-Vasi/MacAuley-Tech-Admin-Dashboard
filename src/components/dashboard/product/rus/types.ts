import {
  ProductMetricsCalendarChartsKey,
  ProductMetricsChartKey,
} from "../chartsData";
import { RUSAction } from "./actions";

type RUSState = {
  barLineChartYAxisVariable: ProductMetricsChartKey;
  barLineChartKind: "bar" | "line";
  calendarChartYAxisVariable: ProductMetricsCalendarChartsKey;
};

type RUSDispatch =
  | {
    action: RUSAction["setBarLineChartKind"];
    payload: "bar" | "line";
  }
  | {
    action: RUSAction["setBarLineChartYAxisVariable"];
    payload: ProductMetricsChartKey;
  }
  | {
    action: RUSAction["setCalendarChartYAxisVariable"];
    payload: ProductMetricsCalendarChartsKey;
  };

export type { RUSDispatch, RUSState };
