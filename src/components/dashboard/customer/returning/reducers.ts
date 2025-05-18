import { parseSafeSync } from "../../../../utils";
import { CustomerNewReturningYAxisKey } from "../types";
import { ReturningAction, returningAction } from "./actions";
import { setYAxisKeyReturningDispatchZod } from "./schemas";
import { ReturningDispatch, ReturningState } from "./types";

function returningReducer(state: ReturningState, dispatch: ReturningDispatch) {
  const reducer = returningReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const returningReducers = new Map<
  ReturningAction[keyof ReturningAction],
  (state: ReturningState, dispatch: ReturningDispatch) => ReturningState
>([
  [returningAction.setYAxisKey, returningReducer_setYAxisKey],
]);

function returningReducer_setYAxisKey(
  state: ReturningState,
  dispatch: ReturningDispatch,
): ReturningState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setYAxisKeyReturningDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.val.data.val.payload as CustomerNewReturningYAxisKey,
  };
}

export { returningReducer, returningReducer_setYAxisKey };
