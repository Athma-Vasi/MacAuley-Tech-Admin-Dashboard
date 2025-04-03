import { FinancialMetricsAction, financialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
} from "./chartsData";
import {
  FinancialMetricCategory,
  FinancialMetricsDispatch,
  FinancialMetricsState,
} from "./types";

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
    financialMetricsReducer_setCalendarCharts,
  ],
  [financialMetricsAction.setCards, financialMetricsReducer_setCards],
  [financialMetricsAction.setCharts, financialMetricsReducer_setCharts],
  [
    financialMetricsAction.setIsGenerating,
    financialMetricsReducer_setIsGenerating,
  ],
]);

function financialMetricsReducer_setCalendarCharts(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  return {
    ...state,
    calendarChartsData: dispatch.payload as {
      currentYear: FinancialMetricsCalendarCharts;
      previousYear: FinancialMetricsCalendarCharts;
    },
  };
}

function financialMetricsReducer_setCards(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  return {
    ...state,
    cards: dispatch.payload as FinancialMetricsCards,
  };
}

function financialMetricsReducer_setCharts(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  return {
    ...state,
    charts: dispatch.payload as FinancialMetricsCharts,
  };
}

function financialMetricsReducer_setIsGenerating(
  state: FinancialMetricsState,
  dispatch: FinancialMetricsDispatch,
): FinancialMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { financialMetricsReducer };
