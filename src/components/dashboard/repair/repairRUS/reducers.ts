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
    [
        repairRUSAction.setBarLineRadialChartYAxis,
        repairRUSReducer_setBarLineRadialChartYAxis,
    ],
    [
        repairRUSAction.setCalendarChartYAxis,
        repairRUSReducer_setCalendarChartYAxis,
    ],
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

function repairRUSReducer_setBarLineRadialChartYAxis(
    state: RepairRUSState,
    dispatch: RepairRUSDispatch,
): RepairRUSState {
    return {
        ...state,
        barLineRadialChartYAxis: dispatch.payload as RepairSubMetric,
    };
}

function repairRUSReducer_setCalendarChartYAxis(
    state: RepairRUSState,
    dispatch: RepairRUSDispatch,
): RepairRUSState {
    return {
        ...state,
        calendarChartYAxis: dispatch.payload as RepairSubMetric,
    };
}

export { repairRUSReducer };
