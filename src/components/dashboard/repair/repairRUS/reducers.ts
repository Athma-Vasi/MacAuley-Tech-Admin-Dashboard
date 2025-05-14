import { parseSafeSync } from "../../../../utils";
import { RepairSubMetric } from "../types";
import { RepairRUSAction, repairRUSAction } from "./actions";
import { setYAxisKeyRepairRUSDispatchZod } from "./schemas";
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
  [repairRUSAction.setYAxisKey, repairRUSReducer_setYAxisKey],
]);

function repairRUSReducer_setYAxisKey(
  state: RepairRUSState,
  dispatch: RepairRUSDispatch,
): RepairRUSState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setYAxisKeyRepairRUSDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    yAxisKey: parsedResult.safeUnwrap().data?.payload as RepairSubMetric,
  };
}

export { repairRUSReducer, repairRUSReducer_setYAxisKey };
