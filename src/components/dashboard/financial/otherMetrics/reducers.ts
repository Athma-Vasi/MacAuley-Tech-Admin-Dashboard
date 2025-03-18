import {
  FinancialMetricsCalendarChartsKeyOtherMetrics,
  FinancialMetricsOtherMetricsChartsKey,
} from "../chartsData";
import { OtherMetricsAction, otherMetricsAction } from "./actions";
import { OtherMetricsDispatch, OtherMetricsState } from "./types";

function otherMetricsReducer(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  const reducer = otherMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const otherMetricsReducers = new Map<
  OtherMetricsAction[keyof OtherMetricsAction],
  (
    state: OtherMetricsState,
    dispatch: OtherMetricsDispatch,
  ) => OtherMetricsState
>([
  [
    otherMetricsAction.setBarLineChartYAxisVariable,
    otherMetricsReducer_setBarLineChartYAxisVariable,
  ],
  [
    otherMetricsAction.setBarLineChartKind,
    otherMetricsReducer_setBarLineChartKind,
  ],
  [
    otherMetricsAction.setCalendarChartYAxisVariable,
    otherMetricsReducer_setCalendarChartYAxisVariable,
  ],
]);

function otherMetricsReducer_setBarLineChartYAxisVariable(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    barLineChartYAxisVariable: dispatch
      .payload as FinancialMetricsOtherMetricsChartsKey,
  };
}

function otherMetricsReducer_setBarLineChartKind(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    barLineChartKind: dispatch.payload as "bar" | "line",
  };
}

function otherMetricsReducer_setCalendarChartYAxisVariable(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    calendarChartYAxisVariable: dispatch
      .payload as FinancialMetricsCalendarChartsKeyOtherMetrics,
  };
}

export { otherMetricsReducer };
