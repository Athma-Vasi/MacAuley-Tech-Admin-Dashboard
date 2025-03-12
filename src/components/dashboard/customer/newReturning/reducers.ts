import {
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
} from "../chartsData";
import { NewReturningAction, newReturningAction } from "./actions";
import { NewReturningDispatch, NewReturningState } from "./types";

function newReturningReducer(
  state: NewReturningState,
  dispatch: NewReturningDispatch
): NewReturningState {
  const reducer = newReturningReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const newReturningReducers = new Map<
  NewReturningAction[keyof NewReturningAction],
  (state: NewReturningState, dispatch: NewReturningDispatch) => NewReturningState
>([
  [
    newReturningAction.setNewReturningBarChartYAxisVariable,
    newReturningReducer_setNewReturningBarChartYAxisVariable,
  ],
  [
    newReturningAction.setNewReturningLineChartYAxisVariable,
    newReturningReducer_setNewReturningLineChartYAxisVariable,
  ],
  [
    newReturningAction.setNewReturningPieChartYAxisVariable,
    newReturningReducer_setNewReturningPieChartYAxisVariable,
  ],
]);

function newReturningReducer_setNewReturningBarChartYAxisVariable(
  state: NewReturningState,
  dispatch: NewReturningDispatch
): NewReturningState {
  return {
    ...state,
    newReturningBarChartYAxisVariable:
      dispatch.payload as CustomerMetricsNewReturningChartsKey,
  };
}

function newReturningReducer_setNewReturningLineChartYAxisVariable(
  state: NewReturningState,
  dispatch: NewReturningDispatch
): NewReturningState {
  return {
    ...state,
    newReturningLineChartYAxisVariable:
      dispatch.payload as CustomerMetricsNewReturningChartsKey,
  };
}

function newReturningReducer_setNewReturningPieChartYAxisVariable(
  state: NewReturningState,
  dispatch: NewReturningDispatch
): NewReturningState {
  return {
    ...state,
    newReturningPieChartYAxisVariable:
      dispatch.payload as CustomerMetricsNewReturningPieChartsKey,
  };
}

export { newReturningReducer };
