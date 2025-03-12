import { RUSAction, rusAction } from "./actions";
import { RUSDispatch, RUSState } from "./types";

function rusReducer(state: RUSState, dispatch: RUSDispatch): RUSState {
  const reducer = rusReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const rusReducers = new Map<
  RUSAction[keyof RUSAction],
  (state: RUSState, dispatch: RUSDispatch) => RUSState
>([
  [rusAction.setBarChartYAxisVariable, rusReducer_setBarChartYAxisVariable],
  [rusAction.setLineChartYAxisVariable, rusReducer_setLineChartYAxisVariable],
]);

function rusReducer_setBarChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch
): RUSState {
  return { ...state, barChartYAxisVariable: dispatch.payload };
}

function rusReducer_setLineChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch
): RUSState {
  return { ...state, lineChartYAxisVariable: dispatch.payload };
}

export { rusReducer };
