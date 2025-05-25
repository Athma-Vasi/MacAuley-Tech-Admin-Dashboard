import { parseSyncSafe } from "../../../../utils";
import { ProductMetricsChartKey } from "../chartsData";
import { RUSAction, rusAction } from "./actions";
import { setYAxisKeyRUSDispatchZod } from "./schemas";
import { RUSDispatch, RUSState } from "./types";

function rusReducer(state: RUSState, dispatch: RUSDispatch): RUSState {
  const reducer = rusReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const rusReducers = new Map<
  RUSAction[keyof RUSAction],
  (state: RUSState, dispatch: RUSDispatch) => RUSState
>([
  [rusAction.setYAxisKey, rusReducer_setYAxisKey],
]);

function rusReducer_setYAxisKey(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setYAxisKeyRUSDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.val.val.payload as ProductMetricsChartKey,
  };
}

export { rusReducer, rusReducer_setYAxisKey };
