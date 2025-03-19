import {
  CustomerChurnRetentionCalendarChartsKey,
  CustomerMetricsChurnRetentionChartsKey,
} from "../chartsData";
import { ChurnRetentionAction, churnRetentionAction } from "./actions";
import { ChurnRetentionDispatch, ChurnRetentionState } from "./types";

function churnRetentionReducer(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  const reducer = churnRetentionReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const churnRetentionReducers = new Map<
  ChurnRetentionAction[keyof ChurnRetentionAction],
  (
    state: ChurnRetentionState,
    dispatch: ChurnRetentionDispatch,
  ) => ChurnRetentionState
>([
  [
    churnRetentionAction.setBarLineChartKind,
    churnRetentionReducer_setBarLineChartKind,
  ],
  [
    churnRetentionAction.setBarLineChartYAxisVariable,
    churnRetentionReducer_setChurnRetentionBarChartYAxisVariable,
  ],
  [
    churnRetentionAction.setCalendarChartYAxisVariable,
    churnRetentionReducer_setChurnRetentionLineChartYAxisVariable,
  ],
]);

function churnRetentionReducer_setBarLineChartKind(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return { ...state, barLineChartKind: dispatch.payload as "bar" | "line" };
}

function churnRetentionReducer_setChurnRetentionBarChartYAxisVariable(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    barLineChartYAxisVariable: dispatch
      .payload as CustomerMetricsChurnRetentionChartsKey,
  };
}

function churnRetentionReducer_setChurnRetentionLineChartYAxisVariable(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    calendarChartYAxisVariable: dispatch
      .payload as CustomerChurnRetentionCalendarChartsKey,
  };
}

export { churnRetentionReducer };
