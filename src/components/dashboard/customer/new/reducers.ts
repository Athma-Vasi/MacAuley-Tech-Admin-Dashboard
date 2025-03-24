import { ChartKindSegment } from "../../types";
import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { NewAction, newAction } from "./actions";
import { NewDispatch, NewState } from "./types";

function newReducer(state: NewState, dispatch: NewDispatch) {
  const reducer = newReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const newReducers = new Map<
  NewAction[keyof NewAction],
  (state: NewState, dispatch: NewDispatch) => NewState
>([
  [newAction.setBarLineRadialChartKind, newReducer_setBarLineRadialChartKind],
  [
    newAction.setBarLineRadialChartYAxis,
    newReducer_setBarLineRadialChartYAxis,
  ],
  [
    newAction.setCalendarChartYAxis,
    newReducer_setCalendarChartYAxis,
  ],
  [newAction.setPieChartYAxis, newReducer_setPieChartYAxis],
]);

function newReducer_setBarLineRadialChartKind(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function newReducer_setBarLineRadialChartYAxis(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch
      .payload as CustomerMetricsNewReturningChartsKey,
  };
}

function newReducer_setCalendarChartYAxis(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as CustomerNewReturningCalendarChartsKey,
  };
}

function newReducer_setPieChartYAxis(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  return {
    ...state,
    pieChartYAxis: dispatch
      .payload as CustomerMetricsNewReturningPieChartsKey,
  };
}

export { newReducer };
