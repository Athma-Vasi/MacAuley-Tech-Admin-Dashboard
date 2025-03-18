import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsPieChartsKey,
} from "../chartsData";
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
  [
    pertAction.setBarLineChartYAxisVariable,
    pertReducer_setBarLineChartYAxisVariable,
  ],
  [pertAction.setBarLineChartKind, pertReducer_setBarLineChartKind],
  [pertAction.setPieChartYAxisVariable, pertReducer_setPieChartYAxisVariable],
]);

function pertReducer_setBarLineChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    barLineChartYAxisVariable: dispatch
      .payload as FinancialMetricsBarLineChartsKey,
  };
}

function pertReducer_setBarLineChartKind(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    barLineChartKind: dispatch.payload as "bar" | "line",
  };
}

function pertReducer_setPieChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    pieChartYAxisVariable: dispatch.payload as FinancialMetricsPieChartsKey,
  };
}

export { pertReducer };
