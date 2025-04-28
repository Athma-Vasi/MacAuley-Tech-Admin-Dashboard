import { parseSafeSync } from "../../../utils";
import { setIsGeneratingDispatchZod } from "../product/schemas";
import { FinancialMetricsAction, financialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
} from "./chartsData";
import {
  setFinancialCalendarChartsDispatchZod,
  setFinancialChartsDispatchZod,
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
    financialMetricsAction.setIsGenerating,
    financialMetricsReducer_setIsGenerating,
  ],
]);

function financialMetricsReducer_setCalendarChartsData(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFinancialCalendarChartsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.safeUnwrap().data?.payload as {
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
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setFinancialChartsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.safeUnwrap().data?.payload as FinancialMetricsCharts,
  };
}

function financialMetricsReducer_setIsGenerating(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
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

export {
  financialMetricsReducer,
  financialMetricsReducer_setCalendarChartsData,
  financialMetricsReducer_setCards,
  financialMetricsReducer_setCharts,
  financialMetricsReducer_setIsGenerating,
};
