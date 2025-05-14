import { CustomerNewReturningYAxisKey } from "../types";
import { NewAction } from "./actions";

type NewState = {
  yAxisKey: CustomerNewReturningYAxisKey;
};

type NewDispatch = {
  action: NewAction["setYAxisKey"];
  payload: CustomerNewReturningYAxisKey;
};

export type { NewDispatch, NewState };
