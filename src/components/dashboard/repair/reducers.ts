import { RepairMetricsAction, repairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricsCharts } from "./chartsData";
import {
  RepairMetricCategory,
  RepairMetricsDispatch,
  RepairMetricsState,
  RepairSubMetric,
} from "./types";

function repairMetricsReducer(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  const reducer = repairMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const repairMetricsReducers = new Map<
  RepairMetricsAction[keyof RepairMetricsAction],
  (state: RepairMetricsState, dispatch: RepairMetricsDispatch) => RepairMetricsState
>([
  [repairMetricsAction.setCards, repairMetricsReducer_setCards],
  [repairMetricsAction.setCharts, repairMetricsReducer_setCharts],
  [repairMetricsAction.setIsGenerating, repairMetricsReducer_setIsGenerating],
  [repairMetricsAction.setRepairCategory, repairMetricsReducer_setRepairCategory],
  [repairMetricsAction.setSubMetric, repairMetricsReducer_setSubMetric],
]);

function repairMetricsReducer_setCards(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  return {
    ...state,
    cards: dispatch.payload as RepairMetricsCards,
  };
}

function repairMetricsReducer_setSubMetric(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  return {
    ...state,
    subMetric: dispatch.payload as RepairSubMetric,
  };
}

function repairMetricsReducer_setCharts(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  return {
    ...state,
    charts: dispatch.payload as RepairMetricsCharts,
  };
}

function repairMetricsReducer_setRepairCategory(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  return {
    ...state,
    repairCategory: dispatch.payload as RepairMetricCategory,
  };
}

function repairMetricsReducer_setIsGenerating(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch
): RepairMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { repairMetricsReducer };
