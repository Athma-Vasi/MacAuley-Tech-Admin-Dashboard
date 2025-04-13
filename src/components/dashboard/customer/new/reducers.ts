import { ChartKindSegment } from "../../types";
import { CustomerNewReturningYAxisKey } from "../types";
import { NewAction, newAction } from "./actions";
import { NewDispatch, NewState } from "./types";

function newReducer(state: NewState, dispatch: NewDispatch) {
  const reducer = newReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const newReducers = new Map<
  NewAction[keyof NewAction],
  (state: NewState, dispatch: NewDispatch) => NewState
>([
  [
    newAction.setBarLineRadialChartKind,
    newReducer_setBarLineRadialChartKind,
  ],
  [newAction.setYAxisKey, newReducer_setYAxisKey],
]);

function newReducer_setBarLineRadialChartKind(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function newReducer_setYAxisKey(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    yAxisKey: dispatch.payload as CustomerNewReturningYAxisKey,
  };
}

export { newReducer };
