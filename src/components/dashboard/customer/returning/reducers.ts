import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { returningAction, ReturningAction } from "./actions";
import { ReturningDispatch, ReturningState } from "./types";

function returningReducer(state: ReturningState, dispatch: ReturningDispatch) {
  const reducer = returningReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const returningReducers = new Map<
  ReturningAction[keyof ReturningAction],
  (state: ReturningState, dispatch: ReturningDispatch) => ReturningState
>([
  [returningAction.setBarLineChartKind, returningReducer_setBarLineChartKind],
  [
    returningAction.setBarLineChartYAxisVariable,
    returningReducer_setBarLineChartYAxisVariable,
  ],
  [
    returningAction.setCalendarChartYAxisVariable,
    returningReducer_setCalendarChartYAxisVariable,
  ],
  [returningAction.setPieChartYAxisVariable, returningReducer_setPieChartYAxisVariable],
]);

function returningReducer_setBarLineChartKind(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return { ...state, barLineChartKind: dispatch.payload as "bar" | "line" };
}

function returningReducer_setBarLineChartYAxisVariable(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    barLineChartYAxisVariable: dispatch
      .payload as CustomerMetricsNewReturningChartsKey,
  };
}

function returningReducer_setCalendarChartYAxisVariable(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    calendarChartYAxisVariable: dispatch
      .payload as CustomerNewReturningCalendarChartsKey,
  };
}

function returningReducer_setPieChartYAxisVariable(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    pieChartYAxisVariable: dispatch
      .payload as CustomerMetricsNewReturningPieChartsKey,
  };
}

export { returningReducer };
