import {
  ProductMetricsCalendarChartsKey,
  ProductMetricsChartKey,
} from "../chartsData";
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
  [rusAction.setBarLineChartKind, rusReducer_setBarLineChartKind],
  [
    rusAction.setBarLineChartYAxisVariable,
    rusReducer_setBarLineChartYAxisVariable,
  ],
  [
    rusAction.setCalendarChartYAxisVariable,
    rusReducer_setCalendarChartYAxisVariable,
  ],
]);

function rusReducer_setBarLineChartKind(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return { ...state, barLineChartKind: dispatch.payload as "bar" | "line" };
}

function rusReducer_setBarLineChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    barLineChartYAxisVariable: dispatch.payload as ProductMetricsChartKey,
  };
}

function rusReducer_setCalendarChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    calendarChartYAxisVariable: dispatch
      .payload as ProductMetricsCalendarChartsKey,
  };
}

export { rusReducer };
