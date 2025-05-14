import { parseSafeSync } from "../../../utils";
import { ProductMetricsAction, productMetricsAction } from "./actions";
import { ProductMetricsCards } from "./cards";
import {
  ProductMetricsCalendarCharts,
  ProductMetricsCharts,
} from "./chartsData";
import {
  setCalendarChartsDataProductMetricsDispatchZod,
  setChartsProductMetricsDispatchZod,
  setChartsWorkerProductMetricsDispatchZod,
  setIsGeneratingProductMetricsDispatchZod,
} from "./schemas";
import { ProductMetricsDispatch, ProductMetricsState } from "./types";

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
  [
    productMetricsAction.setProductChartsWorker,
    productMetricsReducer_setProductChartsWorker,
  ],
]);

function productMetricsReducer_setCalendarChartsData(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCalendarChartsDataProductMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    calendarChartsData: parsedResult.safeUnwrap().data?.payload as {
      currentYear: ProductMetricsCalendarCharts;
      previousYear: ProductMetricsCalendarCharts;
    },
  };
}

function productMetricsReducer_setCards(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  if (!dispatch.payload) {
    return state;
  }

  return {
    ...state,
    cards: dispatch.payload as ProductMetricsCards,
  };
}

function productMetricsReducer_setCharts(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setChartsProductMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    charts: parsedResult.safeUnwrap().data?.payload as ProductMetricsCharts,
  };
}

function productMetricsReducer_setIsGenerating(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsGeneratingProductMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    isGenerating: parsedResult.safeUnwrap().data?.payload as boolean,
  };
}

function productMetricsReducer_setProductChartsWorker(
  state: ProductMetricsState,
  dispatch: ProductMetricsDispatch,
): ProductMetricsState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setChartsWorkerProductMetricsDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    productChartsWorker: parsedResult.safeUnwrap().data?.payload as Worker,
  };
}

export {
  productMetricsReducer,
  productMetricsReducer_setCalendarChartsData,
  productMetricsReducer_setCards,
  productMetricsReducer_setCharts,
  productMetricsReducer_setIsGenerating,
  productMetricsReducer_setProductChartsWorker,
};
