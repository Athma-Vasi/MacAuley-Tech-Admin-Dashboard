import { parseSyncSafe } from "../../../../utils";
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
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setYAxisKeyChurnRetentionDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.val.val
      .payload as CustomerMetricsChurnRetentionChartsKey,
  };
}

export { churnRetentionReducer, churnRetentionReducer_setYAxisKey };
