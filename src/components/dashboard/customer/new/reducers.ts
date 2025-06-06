import { parseSyncSafe } from "../../../../utils";
import { CustomerNewReturningYAxisKey } from "../types";
import { NewAction, newAction } from "./actions";
import { setYAxisKeyNewDispatchZod } from "./schemas";
import { NewDispatch, NewState } from "./types";

function newReducer(state: NewState, dispatch: NewDispatch) {
  const reducer = newReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const newReducers = new Map<
  NewAction[keyof NewAction],
  (state: NewState, dispatch: NewDispatch) => NewState
>([
  [newAction.setYAxisKey, newReducer_setYAxisKey],
]);

function newReducer_setYAxisKey(
  state: NewState,
  dispatch: NewDispatch,
): NewState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setYAxisKeyNewDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.val.val.payload as CustomerNewReturningYAxisKey,
  };
}

export { newReducer, newReducer_setYAxisKey };
