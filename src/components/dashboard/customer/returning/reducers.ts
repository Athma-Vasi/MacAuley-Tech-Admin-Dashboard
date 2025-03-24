import { ChartKindSegment } from "../../types";
import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { ReturningAction, returningAction } from "./actions";
import { ReturningDispatch, ReturningState } from "./types";

function returningReducer(state: ReturningState, dispatch: ReturningDispatch) {
  const reducer = returningReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const returningReducers = new Map<
  ReturningAction[keyof ReturningAction],
  (state: ReturningState, dispatch: ReturningDispatch) => ReturningState
>([
  [
    returningAction.setBarLineRadialChartKind,
    returningReducer_setBarLineRadialChartKind,
  ],
  [
    returningAction.setBarLineRadialChartYAxis,
    returningReducer_setBarLineRadialChartYAxis,
  ],
  [
    returningAction.setCalendarChartYAxis,
    returningReducer_setCalendarChartYAxis,
  ],
  [
    returningAction.setPieChartYAxis,
    returningReducer_setPieChartYAxis,
  ],
]);

function returningReducer_setBarLineRadialChartKind(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function returningReducer_setBarLineRadialChartYAxis(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch
      .payload as CustomerMetricsNewReturningChartsKey,
  };
}

function returningReducer_setCalendarChartYAxis(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as CustomerNewReturningCalendarChartsKey,
  };
}

function returningReducer_setPieChartYAxis(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  return {
    ...state,
    pieChartYAxis: dispatch
      .payload as CustomerMetricsNewReturningPieChartsKey,
  };
}

export { returningReducer };
