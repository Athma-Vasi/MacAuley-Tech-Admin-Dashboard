import { ChurnRetentionAction, churnRetentionAction } from "./actions";
import { ChurnRetentionDispatch, ChurnRetentionState } from "./types";

function churnRetentionReducer(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch
): ChurnRetentionState {
  const reducer = churnRetentionReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const churnRetentionReducers = new Map<
  ChurnRetentionAction[keyof ChurnRetentionAction],
  (state: ChurnRetentionState, dispatch: ChurnRetentionDispatch) => ChurnRetentionState
>([
  [
    churnRetentionAction.setChurnRetentionBarChartYAxisVariable,
    churnRetentionReducer_setChurnRetentionBarChartYAxisVariable,
  ],
  [
    churnRetentionAction.setChurnRetentionLineChartYAxisVariable,
    churnRetentionReducer_setChurnRetentionLineChartYAxisVariable,
  ],
]);

function churnRetentionReducer_setChurnRetentionBarChartYAxisVariable(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch
): ChurnRetentionState {
  return {
    ...state,
    churnRetentionBarChartYAxisVariable: dispatch.payload,
  };
}

function churnRetentionReducer_setChurnRetentionLineChartYAxisVariable(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch
): ChurnRetentionState {
  return {
    ...state,
    churnRetentionLineChartYAxisVariable: dispatch.payload,
  };
}

export { churnRetentionReducer };
