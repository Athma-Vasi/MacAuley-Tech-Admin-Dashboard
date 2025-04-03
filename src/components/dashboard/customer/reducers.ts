import { CustomerMetricsAction, customerMetricsAction } from "./actions";
import { CustomerMetricsCards } from "./cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
} from "./chartsData";
import {
  CustomerMetricsCategory,
  CustomerMetricsDispatch,
  CustomerMetricsState,
} from "./types";

function customerMetricsReducer(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const reducer = customerMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const customerMetricsReducers = new Map<
  CustomerMetricsAction[keyof CustomerMetricsAction],
  (
    state: CustomerMetricsState,
    dispatch: CustomerMetricsDispatch,
  ) => CustomerMetricsState
>([
  [
    customerMetricsAction.setCalendarChartsData,
    customerMetricsReducer_setCalendarChartsData,
  ],
  [customerMetricsAction.setCards, customerMetricsReducer_setCards],
  [customerMetricsAction.setCharts, customerMetricsReducer_setCharts],
  [
    customerMetricsAction.setIsGenerating,
    customerMetricsReducer_setIsGenerating,
  ],
]);

function customerMetricsReducer_setCalendarChartsData(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  return {
    ...state,
    calendarChartsData: dispatch.payload as {
      currentYear: CustomerMetricsCalendarCharts;
      previousYear: CustomerMetricsCalendarCharts;
    },
  };
}

function customerMetricsReducer_setCards(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  return {
    ...state,
    cards: dispatch.payload as CustomerMetricsCards,
  };
}

function customerMetricsReducer_setCharts(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  return {
    ...state,
    charts: dispatch.payload as CustomerMetricsCharts,
  };
}

function customerMetricsReducer_setIsGenerating(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { customerMetricsReducer };
