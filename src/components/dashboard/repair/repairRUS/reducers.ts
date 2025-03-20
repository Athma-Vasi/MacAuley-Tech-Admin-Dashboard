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
    [repairRUSAction.setBarLineChartKind, repairRUSReducer_setBarLineChartKind],
    [
        repairRUSAction.setBarLineChartYAxisVariable,
        repairRUSReducer_setBarLineChartYAxisVariable,
    ],
    [
        repairRUSAction.setCalendarChartYAxisVariable,
        repairRUSReducer_setCalendarChartYAxisVariable,
    ],
]);

function repairRUSReducer_setBarLineChartKind(
    state: RepairRUSState,
    dispatch: RepairRUSDispatch,
): RepairRUSState {
    return {
        ...state,
        barLineChartKind: dispatch.payload as "bar" | "line",
    };
}

function repairRUSReducer_setBarLineChartYAxisVariable(
    state: RepairRUSState,
    dispatch: RepairRUSDispatch,
): RepairRUSState {
    return {
        ...state,
        barLineChartYAxisVariable: dispatch.payload as RepairSubMetric,
    };
}

function repairRUSReducer_setCalendarChartYAxisVariable(
    state: RepairRUSState,
    dispatch: RepairRUSDispatch,
): RepairRUSState {
    return {
        ...state,
        calendarChartYAxisVariable: dispatch.payload as RepairSubMetric,
    };
}

export { repairRUSReducer };
