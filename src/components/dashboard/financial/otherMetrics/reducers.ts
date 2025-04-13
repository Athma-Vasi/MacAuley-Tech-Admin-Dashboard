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
    otherMetricsAction.setBarLineRadialChartKind,
    otherMetricsReducer_setBarLineRadialChartKind,
  ],
  [
    otherMetricsAction.setYAxisKey,
    otherMetricsReducer_setYAxisKey,
  ],
]);

function otherMetricsReducer_setBarLineRadialChartKind(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function otherMetricsReducer_setYAxisKey(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  return {
    ...state,
    yAxisKey: dispatch.payload as FinancialMetricsOtherMetricsChartsKey,
  };
}

export { otherMetricsReducer };
