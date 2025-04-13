import { ChartKindSegment } from "../../types";
import { CustomerMetricsChurnRetentionChartsKey } from "../chartsData";
import { ChurnRetentionAction, churnRetentionAction } from "./actions";
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
  [
    churnRetentionAction.setBarLineRadialChartKind,
    churnRetentionReducer_setBarLineRadialChartKind,
  ],
  [churnRetentionAction.setYAxisKey, churnRetentionReducer_setYAxisKey],
]);

function churnRetentionReducer_setBarLineRadialChartKind(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function churnRetentionReducer_setYAxisKey(
  state: ChurnRetentionState,
  dispatch: ChurnRetentionDispatch,
): ChurnRetentionState {
  return {
    ...state,
    yAxisKey: dispatch.payload as CustomerMetricsChurnRetentionChartsKey,
  };
}

export { churnRetentionReducer };
