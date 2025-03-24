import { ChartKindSegment } from "../../types";
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
    otherMetricsAction.setBarLineRadialChartYAxis,
    otherMetricsReducer_setBarLineRadialChartYAxis,
  ],
  [
    otherMetricsAction.setBarLineRadialChartKind,
    otherMetricsReducer_setBarLineRadialChartKind,
  ],
  [
    otherMetricsAction.setCalendarChartYAxis,
    otherMetricsReducer_setCalendarChartYAxis,
  ],
]);

function otherMetricsReducer_setBarLineRadialChartYAxis(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch
      .payload as FinancialMetricsOtherMetricsChartsKey,
  };
}

function otherMetricsReducer_setBarLineRadialChartKind(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function otherMetricsReducer_setCalendarChartYAxis(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as FinancialMetricsCalendarChartsKeyOtherMetrics,
  };
}

export { otherMetricsReducer };
