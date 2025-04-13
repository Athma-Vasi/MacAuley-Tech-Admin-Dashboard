import { ChartKindSegment } from "../../types";
import { ProductMetricsChartKey } from "../chartsData";
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
  [rusAction.setBarLineRadialChartKind, rusReducer_setBarLineChartKind],
  [rusAction.setYAxisKey, rusReducer_setYAxisKey],
]);

function rusReducer_setBarLineChartKind(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function rusReducer_setYAxisKey(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    yAxisKey: dispatch.payload as ProductMetricsChartKey,
  };
}

export { rusReducer };
