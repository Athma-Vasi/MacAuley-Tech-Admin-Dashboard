import { parseSyncSafe } from "../../../utils";
import { RepairMetricsAction, repairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricCalendarCharts, RepairMetricsCharts } from "./chartsData";
import {
  setCalendarChartsDataRepairMetricsDispatchZod,
  setChartsRepairMetricsDispatchZod,
  setChartsWorkerRepairMetricsDispatchZod,
  setIsGeneratingRepairMetricsDispatchZod,
} from "./schemas";

import { RepairMetricsDispatch, RepairMetricsState } from "./types";

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
  [
    repairMetricsAction.setRepairChartsWorker,
    repairMetricsReducer_setRepairChartsWorker,
  ],
]);

function repairMetricsReducer_setCalendarChartsData(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setCalendarChartsDataRepairMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.val.val.payload as {
      currentYear: RepairMetricCalendarCharts;
      previousYear: RepairMetricCalendarCharts;
    },
  };
}

function repairMetricsReducer_setCards(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  if (!dispatch.payload) {
    return state;
  }

  return {
    ...state,
    cards: dispatch.payload as RepairMetricsCards,
  };
}

function repairMetricsReducer_setCharts(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsRepairMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.val.val.payload as RepairMetricsCharts,
  };
}

function repairMetricsReducer_setIsGenerating(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setIsGeneratingRepairMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isGenerating: parsedResult.val.val.payload as boolean,
  };
}

function repairMetricsReducer_setRepairChartsWorker(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsWorkerRepairMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    repairChartsWorker: parsedResult.val.val.payload as Worker,
  };
}

export {
  repairMetricsReducer,
  repairMetricsReducer_setCalendarChartsData,
  repairMetricsReducer_setCards,
  repairMetricsReducer_setCharts,
  repairMetricsReducer_setIsGenerating,
  repairMetricsReducer_setRepairChartsWorker,
};
