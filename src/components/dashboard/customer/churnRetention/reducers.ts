import { parseSafeSync } from "../../../../utils";
import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";
import { ChurnRetentionAction, churnRetentionAction } from "./actions";
import { setYAxisKeyChurnRetentionDispatchZod } from "./schemas";
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
  [churnRetentionAction.setYAxisKey, churnRetentionReducer_setYAxisKey],
]);

function churnRetentionReducer_setYAxisKey(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setYAxisKeyChurnRetentionDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.safeUnwrap().data
      ?.payload as CustomerMetricsChurnRetentionChartsKey,
  };
}

export { churnRetentionReducer, churnRetentionReducer_setYAxisKey };
