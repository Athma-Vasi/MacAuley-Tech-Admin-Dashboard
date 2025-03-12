import { OtherMetricsAction, otherMetricsAction } from "./actions";
import { OtherMetricsDispatch, OtherMetricsState } from "./types";

function otherMetricsReducer(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch
): OtherMetricsState {
  const reducer = otherMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const otherMetricsReducers = new Map<
  OtherMetricsAction[keyof OtherMetricsAction],
  (state: OtherMetricsState, dispatch: OtherMetricsDispatch) => OtherMetricsState
>([
  [
    otherMetricsAction.setBarChartYAxisVariable,
    otherMetricsReducer_setBarChartYAxisVariable,
  ],
  [
    otherMetricsAction.setLineChartYAxisVariable,
    otherMetricsReducer_setLineChartYAxisVariable,
  ],
]);

function otherMetricsReducer_setBarChartYAxisVariable(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch
): OtherMetricsState {
  return {
    ...state,
    barChartYAxisVariable: dispatch.payload,
  };
}

function otherMetricsReducer_setLineChartYAxisVariable(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch
): OtherMetricsState {
  return {
    ...state,
    lineChartYAxisVariable: dispatch.payload,
  };
}

export { otherMetricsReducer };
