import { parseSafeSync } from "../../../../utils";
import { FinancialMetricsOtherMetricsChartsKey } from "../chartsData";
import { OtherMetricsAction, otherMetricsAction } from "./actions";
import { setYAxisKeyOtherMetricsDispatchZod } from "./schemas";
import { OtherMetricsDispatch, OtherMetricsState } from "./types";

function otherMetricsReducer(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  const reducer = otherMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const otherMetricsReducers = new Map<
  OtherMetricsAction[keyof OtherMetricsAction],
  (
    state: OtherMetricsState,
    dispatch: OtherMetricsDispatch,
  ) => OtherMetricsState
>([
  [
    otherMetricsAction.setYAxisKey,
    otherMetricsReducer_setYAxisKey,
  ],
]);

function otherMetricsReducer_setYAxisKey(
  state: OtherMetricsState,
  dispatch: OtherMetricsDispatch,
): OtherMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setYAxisKeyOtherMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.safeUnwrap().data
      ?.payload as FinancialMetricsOtherMetricsChartsKey,
  };
}

export { otherMetricsReducer, otherMetricsReducer_setYAxisKey };
