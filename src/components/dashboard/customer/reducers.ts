import { parseSafeSync } from "../../../utils";
import { CustomerMetricsAction, customerMetricsAction } from "./actions";
import { CustomerMetricsCards } from "./cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
} from "./chartsData";
import {
  setCustomerCalendarChartsDispatchZod,
  setCustomerChartsDispatch,
  setCustomerIsGeneratingDispatch,
} from "./schemas";
import { CustomerMetricsDispatch, CustomerMetricsState } from "./types";

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
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCustomerCalendarChartsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.safeUnwrap().data?.payload as {
      currentYear: CustomerMetricsCalendarCharts;
      previousYear: CustomerMetricsCalendarCharts;
    },
  };
}

function customerMetricsReducer_setCards(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  if (!dispatch) {
    return state;
  }

  return {
    ...state,
    cards: dispatch.payload as CustomerMetricsCards,
  };
}

function customerMetricsReducer_setCharts(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCustomerChartsDispatch,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.safeUnwrap().data?.payload as CustomerMetricsCharts,
  };
}

function customerMetricsReducer_setIsGenerating(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCustomerIsGeneratingDispatch,
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
  customerMetricsReducer,
  customerMetricsReducer_setCalendarChartsData,
  customerMetricsReducer_setCards,
  customerMetricsReducer_setCharts,
  customerMetricsReducer_setIsGenerating,
};
