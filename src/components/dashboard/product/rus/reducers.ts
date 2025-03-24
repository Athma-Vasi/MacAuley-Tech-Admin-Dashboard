import { ChartKindSegment } from "../../types";
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
  [rusAction.setBarLineRadialChartKind, rusReducer_setBarLineChartKind],
  [
    rusAction.setBarLineRadialChartYAxis,
    rusReducer_setBarLineChartYAxisVariable,
  ],
  [
    rusAction.setCalendarChartYAxis,
    rusReducer_setCalendarChartYAxisVariable,
  ],
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

function rusReducer_setBarLineChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    barLineRadialChartYAxis: dispatch.payload as ProductMetricsChartKey,
  };
}

function rusReducer_setCalendarChartYAxisVariable(
  state: RUSState,
  dispatch: RUSDispatch,
): RUSState {
  return {
    ...state,
    calendarChartYAxis: dispatch
      .payload as ProductMetricsCalendarChartsKey,
  };
}

export { rusReducer };
