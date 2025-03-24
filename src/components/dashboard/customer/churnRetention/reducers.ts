import { ChartKindSegment } from "../../types";
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
    churnRetentionAction.setBarLineRadialChartKind,
    churnRetentionReducer_setBarLineRadialChartKind,
  ],
  [
    churnRetentionAction.setBarLineRadialChartYAxis,
    churnRetentionReducer_setBarLineRadialChartYAxis,
  ],
  [
    churnRetentionAction.setCalendarChartYAxis,
    churnRetentionReducer_setCalendarChartYAxis,
  ],
]);

function churnRetentionReducer_setBarLineRadialChartKind(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function churnRetentionReducer_setBarLineRadialChartYAxis(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch
      .payload as CustomerMetricsChurnRetentionChartsKey,
  };
}

function churnRetentionReducer_setCalendarChartYAxis(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as CustomerChurnRetentionCalendarChartsKey,
  };
}

export { churnRetentionReducer };
