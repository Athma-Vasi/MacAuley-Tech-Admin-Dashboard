import {
    CustomerMetricsNewReturningChartsKey,
    CustomerMetricsNewReturningPieChartsKey,
    CustomerNewReturningCalendarChartsKey,
} from "../chartsData";
import { NewAction, newAction } from "./actions";
import { NewDispatch, NewState } from "./types";

function newReducer(state: NewState, dispatch: NewDispatch) {
    const reducer = newReducers.get(dispatch.action);
    return reducer ? reducer(state, dispatch) : state;
}

const newReducers = new Map<
    NewAction[keyof NewAction],
    (state: NewState, dispatch: NewDispatch) => NewState
>([
    [newAction.setBarLineChartKind, newReducer_setBarLineChartKind],
    [
        newAction.setBarLineChartYAxisVariable,
        newReducer_setBarLineChartYAxisVariable,
    ],
    [
        newAction.setCalendarChartYAxisVariable,
        newReducer_setCalendarChartYAxisVariable,
    ],
    [newAction.setPieChartYAxisVariable, newReducer_setPieChartYAxisVariable],
]);

function newReducer_setBarLineChartKind(
    state: NewState,
    dispatch: NewDispatch,
): NewState {
    return { ...state, barLineChartKind: dispatch.payload as "bar" | "line" };
}

function newReducer_setBarLineChartYAxisVariable(
    state: NewState,
    dispatch: NewDispatch,
): NewState {
    return {
        ...state,
        barLineChartYAxisVariable: dispatch
            .payload as CustomerMetricsNewReturningChartsKey,
    };
}

function newReducer_setCalendarChartYAxisVariable(
    state: NewState,
    dispatch: NewDispatch,
): NewState {
    return {
        ...state,
        calendarChartYAxisVariable: dispatch
            .payload as CustomerNewReturningCalendarChartsKey,
    };
}

function newReducer_setPieChartYAxisVariable(
    state: NewState,
    dispatch: NewDispatch,
): NewState {
    return {
        ...state,
        pieChartYAxisVariable: dispatch
            .payload as CustomerMetricsNewReturningPieChartsKey,
    };
}

export { newReducer };
