import { ChartKindSegment } from "../../types";
import { CustomerNewReturningYAxisKey } from "../types";
import { ReturningAction, returningAction } from "./actions";
import { ReturningDispatch, ReturningState } from "./types";

function returningReducer(state: ReturningState, dispatch: ReturningDispatch) {
  const reducer = returningReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const returningReducers = new Map<
  ReturningAction[keyof ReturningAction],
  (state: ReturningState, dispatch: ReturningDispatch) => ReturningState
>([
  [
    returningAction.setBarLineRadialChartKind,
    returningReducer_setBarLineRadialChartKind,
  ],
  [returningAction.setYAxisKey, returningReducer_setYAxisKey],
]);

function returningReducer_setBarLineRadialChartKind(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function returningReducer_setYAxisKey(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    yAxisKey: dispatch.payload as CustomerNewReturningYAxisKey,
  };
}

export { returningReducer };
