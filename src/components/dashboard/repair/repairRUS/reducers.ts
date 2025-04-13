import { ChartKindSegment } from "../../types";
import { RepairSubMetric } from "../types";
import { RepairRUSAction, repairRUSAction } from "./actions";
import { RepairRUSDispatch, RepairRUSState } from "./types";

function repairRUSReducer(
  state: RepairRUSState,
  dispatch: RepairRUSDispatch,
): RepairRUSState {
  const reducer = repairRUSReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const repairRUSReducersMap = new Map<
  RepairRUSAction[keyof RepairRUSAction],
  (state: RepairRUSState, dispatch: RepairRUSDispatch) => RepairRUSState
>([
  [
    repairRUSAction.setBarLineRadialChartKind,
    repairRUSReducer_setBarLineRadialChartKind,
  ],
  [repairRUSAction.setYAxisKey, repairRUSReducer_setYAxisKey],
]);

function repairRUSReducer_setBarLineRadialChartKind(
  state: RepairRUSState,
  dispatch: RepairRUSDispatch,
): RepairRUSState {
  return {
    ...state,
    barLineRadialChartKind: dispatch.payload as ChartKindSegment,
  };
}

function repairRUSReducer_setYAxisKey(
  state: RepairRUSState,
  dispatch: RepairRUSDispatch,
): RepairRUSState {
  return {
    ...state,
    yAxisKey: dispatch.payload as RepairSubMetric,
  };
}

export { repairRUSReducer };
