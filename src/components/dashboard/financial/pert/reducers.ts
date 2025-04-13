import { ChartKindSegment, FinancialYAxisKey } from "../../types";
import { PERTAction, pertAction } from "./actions";
import { PERTDispatch, PERTState } from "./types";

function pertReducer(state: PERTState, dispatch: PERTDispatch): PERTState {
  const reducer = pertReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const pertReducers = new Map<
  PERTAction[keyof PERTAction],
  (state: PERTState, dispatch: PERTDispatch) => PERTState
>([
  [pertAction.setBarLineRadialChartKind, pertReducer_setBarLineRadialChartKind],
  [pertAction.setYAxisKey, pertReducer_setYAxisKey],
]);

function pertReducer_setBarLineRadialChartKind(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function pertReducer_setYAxisKey(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    yAxisKey: dispatch.payload as FinancialYAxisKey,
  };
}

export { pertReducer };
