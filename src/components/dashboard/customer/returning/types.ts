import { ChartKindSegment } from "../../types";
import { CustomerNewReturningYAxisKey } from "../types";
import { ReturningAction } from "./actions";

type ReturningState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: CustomerNewReturningYAxisKey;
};

type ReturningDispatch = {
  action: ReturningAction["setBarLineRadialChartKind"];
  payload: ChartKindSegment;
} | {
  action: ReturningAction["setYAxisKey"];
  payload: CustomerNewReturningYAxisKey;
};

export type { ReturningDispatch, ReturningState };
