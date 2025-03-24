import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsCalendarChartsKeyPERT,
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
    pertAction.setBarLineRadialChartYAxis,
    pertReducer_setBarLineRadialChartYAxis,
  ],
  [pertAction.setBarLineRadialChartKind, pertReducer_setBarLineRadialChartKind],
  [
    pertAction.setCalendarChartYAxis,
    pertReducer_setCalendarChartYAxis,
  ],
  [pertAction.setPieChartYAxisVariable, pertReducer_setPieChartYAxisVariable],
]);

function pertReducer_setBarLineRadialChartYAxis(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch
      .payload as FinancialMetricsBarLineChartsKey,
  };
}

function pertReducer_setBarLineRadialChartKind(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function pertReducer_setCalendarChartYAxis(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as FinancialMetricsCalendarChartsKeyPERT,
  };
}

function pertReducer_setPieChartYAxisVariable(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  return {
    ...state,
    pieChartYAxis: dispatch.payload as FinancialMetricsPieChartsKey,
  };
}

export { pertReducer };
