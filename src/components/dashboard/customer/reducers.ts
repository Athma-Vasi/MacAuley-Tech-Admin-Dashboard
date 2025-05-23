import { parseSyncSafe } from "../../../utils";
import { CustomerMetricsAction, customerMetricsAction } from "./actions";
import { CustomerMetricsCards } from "./cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
} from "./chartsData";
import {
  setCalendarChartsCustomerMetricsDispatchZod,
  setChartsCustomerMetricsDispatchZod,
  setChartsWorkerCustomerMetricsDispatchZod,
  setIsGeneratingCustomerMetricsDispatchZod,
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
    customerMetricsAction.setCustomerChartsWorker,
    customerMetricsReducer_setCustomerChartsWorker,
  ],
  [
    customerMetricsAction.setIsGenerating,
    customerMetricsReducer_setIsGenerating,
  ],
]);

function customerMetricsReducer_setCalendarChartsData(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setCalendarChartsCustomerMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.val.val.payload as {
      currentYear: CustomerMetricsCalendarCharts;
      previousYear: CustomerMetricsCalendarCharts;
    },
  };
}

function customerMetricsReducer_setCards(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  if (!dispatch.payload) {
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
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsCustomerMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.val.val.payload as CustomerMetricsCharts,
  };
}

function customerMetricsReducer_setCustomerChartsWorker(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setChartsWorkerCustomerMetricsDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    customerChartsWorker: parsedResult.val.val.payload as Worker,
  };
}

function customerMetricsReducer_setIsGenerating(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch,
): CustomerMetricsState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setIsGeneratingCustomerMetricsDispatchZod,
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
  customerMetricsReducer,
  customerMetricsReducer_setCalendarChartsData,
  customerMetricsReducer_setCards,
  customerMetricsReducer_setCharts,
  customerMetricsReducer_setCustomerChartsWorker,
  customerMetricsReducer_setIsGenerating,
};
