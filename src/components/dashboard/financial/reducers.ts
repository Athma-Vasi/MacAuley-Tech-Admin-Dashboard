import { parseSyncSafe } from "../../../utils";
import { FinancialMetricsAction, financialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
} from "./chartsData";
import {
  setCalendarChartsFinancialMetricsDispatchZod,
  setChartsFinancialMetricsDispatchZod,
  setChartsWorkerFinancialMetricsDispatchZod,
  setIsGeneratingFinancialMetricsDispatchZod,
} from "./schemas";
import { FinancialMetricsDispatch, FinancialMetricsState } from "./types";

function financialMetricsReducer(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const reducer = financialMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const financialMetricsReducers = new Map<
  FinancialMetricsAction[keyof FinancialMetricsAction],
  (
    state: FinancialMetricsState,
    dispatch: FinancialMetricsDispatch,
  ) => FinancialMetricsState
>([
  [
    financialMetricsAction.setCalendarChartsData,
    financialMetricsReducer_setCalendarChartsData,
  ],
  [financialMetricsAction.setCards, financialMetricsReducer_setCards],
  [financialMetricsAction.setCharts, financialMetricsReducer_setCharts],
  [
    financialMetricsAction.setFinancialChartsWorker,
    financialMetricsReducer_setFinancialChartsWorker,
  ],
  [
    financialMetricsAction.setIsGenerating,
    financialMetricsReducer_setIsGenerating,
  ],
]);

function financialMetricsReducer_setCalendarChartsData(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setCalendarChartsFinancialMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.val.val.payload as {
      currentYear: FinancialMetricsCalendarCharts;
      previousYear: FinancialMetricsCalendarCharts;
    },
  };
}

function financialMetricsReducer_setCards(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  if (!dispatch.payload) {
    return state;
  }

  return {
    ...state,
    cards: dispatch.payload as FinancialMetricsCards,
  };
}

function financialMetricsReducer_setCharts(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsFinancialMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.val.val.payload as FinancialMetricsCharts,
  };
}

function financialMetricsReducer_setFinancialChartsWorker(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsWorkerFinancialMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    financialChartsWorker: parsedResult.val.val.payload as Worker,
  };
}

function financialMetricsReducer_setIsGenerating(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setIsGeneratingFinancialMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isGenerating: parsedResult.val.val.payload as boolean,
  };
}

export {
  financialMetricsReducer,
  financialMetricsReducer_setCalendarChartsData,
  financialMetricsReducer_setCards,
  financialMetricsReducer_setCharts,
  financialMetricsReducer_setFinancialChartsWorker,
  financialMetricsReducer_setIsGenerating,
};
