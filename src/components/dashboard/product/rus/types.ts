import { ChartKindSegment } from "../../types";
import {
  ProductMetricsCalendarChartsKey,
  ProductMetricsChartKey,
} from "../chartsData";
import { RUSAction } from "./actions";

type RUSState = {
  barLineRadialChartYAxis: ProductMetricsChartKey;
  barLineRadialChartKind: ChartKindSegment;
  calendarChartYAxis: ProductMetricsCalendarChartsKey;
};

type RUSDispatch =
  | {
    action: RUSAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: RUSAction["setBarLineRadialChartYAxis"];
    payload: ProductMetricsChartKey;
  }
  | {
    action: RUSAction["setCalendarChartYAxis"];
    payload: ProductMetricsCalendarChartsKey;
  };

export type { RUSDispatch, RUSState };
