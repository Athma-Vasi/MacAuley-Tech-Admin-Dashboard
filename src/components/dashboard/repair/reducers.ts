import { parseSafeSync } from "../../../utils";
import { RepairMetricsAction, repairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricCalendarCharts, RepairMetricsCharts } from "./chartsData";
import {
  setIsGeneratingDispatchZod,
  setRepairCalendarChartsDataDispatchZod,
  setRepairChartsDispatchZod,
  setRepairChartsWorkerRepairMetricsDispatchZod,
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
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setRepairCalendarChartsDataDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.safeUnwrap().data?.payload as {
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
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setRepairChartsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.safeUnwrap().data?.payload as RepairMetricsCharts,
  };
}

function repairMetricsReducer_setIsGenerating(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsGeneratingDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isGenerating: parsedResult.safeUnwrap().data?.payload as boolean,
  };
}

function repairMetricsReducer_setRepairChartsWorker(
  state: RepairMetricsState,
  dispatch: RepairMetricsDispatch,
): RepairMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setRepairChartsWorkerRepairMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    repairChartsWorker: parsedResult.safeUnwrap().data?.payload as Worker,
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
