import { RepairMetricsAction, repairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricCalendarCharts, RepairMetricsCharts } from "./chartsData";
import {
  RepairMetricCategory,
  RepairMetricsDispatch,
  RepairMetricsState,
} from "./types";

function repairMetricsReducer(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const reducer = repairMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const repairMetricsReducers = new Map<
  RepairMetricsAction[keyof RepairMetricsAction],
  (
    state: RepairMetricsState,
    dispatch: RepairMetricsDispatch,
  ) => RepairMetricsState
>([
  [
    repairMetricsAction.setCalendarChartsData,
    repairMetricsReducer_setCalendarChartsData,
  ],
  [repairMetricsAction.setCards, repairMetricsReducer_setCards],
  [repairMetricsAction.setCharts, repairMetricsReducer_setCharts],
  [repairMetricsAction.setIsGenerating, repairMetricsReducer_setIsGenerating],
]);

function repairMetricsReducer_setCalendarChartsData(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  return {
    ...state,
    calendarChartsData: dispatch.payload as {
      currentYear: RepairMetricCalendarCharts;
      previousYear: RepairMetricCalendarCharts;
    },
  };
}

function repairMetricsReducer_setCards(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  return {
    ...state,
    cards: dispatch.payload as RepairMetricsCards,
  };
}

function repairMetricsReducer_setCharts(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  return {
    ...state,
    charts: dispatch.payload as RepairMetricsCharts,
  };
}

function repairMetricsReducer_setIsGenerating(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { repairMetricsReducer };
