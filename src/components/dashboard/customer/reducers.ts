import { CustomerMetricsAction, customerMetricsAction } from "./actions";
import { CustomerMetricsCards } from "./cards";
import { CustomerMetricsCharts } from "./chartsData";
import {
  CustomerMetricsCategory,
  CustomerMetricsDispatch,
  CustomerMetricsState,
} from "./types";

function customerMetricsReducer(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch
): CustomerMetricsState {
  const reducer = customerMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const customerMetricsReducers = new Map<
  CustomerMetricsAction[keyof CustomerMetricsAction],
  (state: CustomerMetricsState, dispatch: CustomerMetricsDispatch) => CustomerMetricsState
>([
  [customerMetricsAction.setCards, customerMetricsReducer_setCards],
  [customerMetricsAction.setCategory, customerMetricsReducer_setCategory],
  [customerMetricsAction.setCharts, customerMetricsReducer_setCharts],
  [customerMetricsAction.setIsGenerating, customerMetricsReducer_setIsGenerating],
]);

function customerMetricsReducer_setCards(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch
): CustomerMetricsState {
  return {
    ...state,
    cards: dispatch.payload as CustomerMetricsCards,
  };
}

function customerMetricsReducer_setCategory(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch
): CustomerMetricsState {
  return {
    ...state,
    category: dispatch.payload as CustomerMetricsCategory,
  };
}

function customerMetricsReducer_setCharts(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch
): CustomerMetricsState {
  return {
    ...state,
    charts: dispatch.payload as CustomerMetricsCharts,
  };
}

function customerMetricsReducer_setIsGenerating(
  state: CustomerMetricsState,
  dispatch: CustomerMetricsDispatch
): CustomerMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { customerMetricsReducer };
