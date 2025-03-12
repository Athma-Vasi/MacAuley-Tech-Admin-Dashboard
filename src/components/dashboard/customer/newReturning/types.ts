import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
} from "../chartsData";
import { NewReturningAction } from "./actions";

type NewReturningState = {
  newReturningBarChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
  newReturningLineChartYAxisVariable: CustomerMetricsNewReturningChartsKey;
  newReturningPieChartYAxisVariable: CustomerMetricsNewReturningPieChartsKey;
};

type NewReturningDispatch =
  | {
      action:
        | NewReturningAction["setNewReturningBarChartYAxisVariable"]
        | NewReturningAction["setNewReturningLineChartYAxisVariable"];
      payload: CustomerMetricsNewReturningChartsKey;
    }
  | {
      action: NewReturningAction["setNewReturningPieChartYAxisVariable"];
      payload: CustomerMetricsNewReturningPieChartsKey;
    };

export type { NewReturningDispatch, NewReturningState };
