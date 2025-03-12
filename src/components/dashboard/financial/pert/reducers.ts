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
  [pertAction.setBarChartYAxisVariable, pertReducer_setBarChartYAxisVariable],
  [pertAction.setLineChartYAxisVariable, pertReducer_setLineChartYAxisVariable],
  [pertAction.setPieChartYAxisVariable, pertReducer_setPieChartYAxisVariable],
]);

function pertReducer_setBarChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch
): PERTState {
  return {
    ...state,
    barChartYAxisVariable: dispatch.payload as FinancialMetricsBarLineChartsKey,
  };
}

function pertReducer_setLineChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch
): PERTState {
  return {
    ...state,
    lineChartYAxisVariable: dispatch.payload as FinancialMetricsBarLineChartsKey,
  };
}

function pertReducer_setPieChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch
): PERTState {
  return {
    ...state,
    pieChartYAxisVariable: dispatch.payload as FinancialMetricsPieChartsKey,
  };
}

export { pertReducer };
