import { ChartKindSegment } from "../../types";
import { CustomerNewReturningYAxisKey } from "../types";
import { NewAction } from "./actions";

type NewState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: CustomerNewReturningYAxisKey;
};

type NewDispatch = {
  action: NewAction["setBarLineRadialChartKind"];
  payload: ChartKindSegment;
} | {
  action: NewAction["setYAxisKey"];
  payload: CustomerNewReturningYAxisKey;
};

export type { NewDispatch, NewState };
