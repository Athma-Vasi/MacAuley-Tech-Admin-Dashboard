import { parseSafeSync } from "../../../../utils";
import { FinancialYAxisKey } from "../../types";
import { PERTAction, pertAction } from "./actions";
import { setYAxisKeyPERTDispatchZod } from "./schemas";
import { PERTDispatch, PERTState } from "./types";

function pertReducer(state: PERTState, dispatch: PERTDispatch): PERTState {
  const reducer = pertReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const pertReducers = new Map<
  PERTAction[keyof PERTAction],
  (state: PERTState, dispatch: PERTDispatch) => PERTState
>([
  [pertAction.setYAxisKey, pertReducer_setYAxisKey],
]);

function pertReducer_setYAxisKey(
  state: PERTState,
  dispatch: PERTDispatch,
): PERTState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setYAxisKeyPERTDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.safeUnwrap().data?.payload as FinancialYAxisKey,
  };
}

export { pertReducer, pertReducer_setYAxisKey };
