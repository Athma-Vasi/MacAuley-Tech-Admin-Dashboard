import { ProductMetricsAction, productMetricsAction } from "./actions";
import { ProductMetricsCards } from "./cards";
import {
  ProductMetricsCalendarCharts,
  ProductMetricsCharts,
} from "./chartsData";
import {
  ProductMetricCategory,
  ProductMetricsDispatch,
  ProductMetricsState,
  ProductSubMetric,
} from "./types";

function productMetricsReducer(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  const reducer = productMetricsReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const productMetricsReducers = new Map<
  ProductMetricsAction[keyof ProductMetricsAction],
  (
    state: ProductMetricsState,
    dispatch: ProductMetricsDispatch,
  ) => ProductMetricsState
>([
  [
    productMetricsAction.setCalendarChartsData,
    productMetricsReducer_setCalendarChartsData,
  ],
  [productMetricsAction.setCards, productMetricsReducer_setCards],
  [productMetricsAction.setCharts, productMetricsReducer_setCharts],
  [productMetricsAction.setIsGenerating, productMetricsReducer_setIsGenerating],
]);

function productMetricsReducer_setCalendarChartsData(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  return {
    ...state,
    calendarChartsData: dispatch.payload as {
      currentYear: ProductMetricsCalendarCharts;
      previousYear: ProductMetricsCalendarCharts;
    },
  };
}

function productMetricsReducer_setCards(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  return {
    ...state,
    cards: dispatch.payload as ProductMetricsCards,
  };
}

function productMetricsReducer_setCharts(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  return {
    ...state,
    charts: dispatch.payload as ProductMetricsCharts,
  };
}

function productMetricsReducer_setIsGenerating(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  return {
    ...state,
    isGenerating: dispatch.payload as boolean,
  };
}

export { productMetricsReducer };
