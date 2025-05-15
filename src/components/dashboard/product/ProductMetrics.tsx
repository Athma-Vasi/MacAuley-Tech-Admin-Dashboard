import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { ProductMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { MessageEventProductWorkerToMain } from "../../../workers/productChartsWorker";
import ProductChartsWorker from "../../../workers/productChartsWorker?worker";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { productMetricsAction } from "./actions";
import { returnSelectedDateProductMetrics } from "./chartsData";
import { handleMessageEventProductWorkerToMain } from "./handlers";
import { productMetricsReducer } from "./reducers";
import { RUS } from "./rus/RUS";
import { initialProductMetricsState } from "./state";
import { ProductMetricCategory, ProductSubMetric } from "./types";
import {
  returnOverviewAllProductsMetrics,
  returnProductMetricsOverviewCards,
} from "./utils";

type ProductMetricsProps = {
  calendarView: DashboardCalendarView;
  productMetricCategory: ProductMetricCategory;
  productMetricsDocument: ProductMetricsDocument;
  productSubMetricCategory: ProductSubMetric;
  selectedDate: string;
  selectedMonth: Month;
  selectedYYYYMMDD: string;
  selectedYear: Year;
  storeLocation: AllStoreLocations;
};

function ProductMetrics(
  {
    calendarView,
    productMetricCategory,
    productMetricsDocument,
    productSubMetricCategory,
    selectedDate,
    selectedMonth,
    selectedYYYYMMDD,
    selectedYear,
    storeLocation,
  }: ProductMetricsProps,
) {
  const [productMetricsState, productMetricsDispatch] = useReducer(
    productMetricsReducer,
    initialProductMetricsState,
  );
  const {
    calendarChartsData,
    cards,
    charts,
    isGenerating,
    productChartsWorker,
  } = productMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { showBoundary } = useErrorBoundary();
  const isComponentMountedRef = useMountedRef();

  const selectedDateProductMetrics = returnSelectedDateProductMetrics({
    productMetricsDocument,
    day: selectedDate,
    month: selectedMonth,
    months: MONTHS,
    year: selectedYear,
  });

  const { cardBgGradient, redColorShade, greenColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  useEffect(() => {
    if (!productChartsWorker) {
      return;
    }

    if (productMetricsDocument || !cards || !charts) {
      productChartsWorker.postMessage(
        {
          calendarView,
          cardBgGradient,
          greenColorShade,
          productMetricsDocument,
          redColorShade,
          selectedDateProductMetrics,
          selectedYYYYMMDD,
        },
      );
    }
  }, [
    productChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocation,
    productMetricCategory,
    productMetricsDocument,
  ]);

  useEffect(() => {
    const newProductChartsWorker = new ProductChartsWorker();

    productMetricsDispatch({
      action: productMetricsAction.setProductChartsWorker,
      payload: newProductChartsWorker,
    });

    newProductChartsWorker.onmessage = async (
      event: MessageEventProductWorkerToMain,
    ) => {
      await handleMessageEventProductWorkerToMain({
        event,
        isComponentMountedRef,
        productMetricsDispatch,
        showBoundary,
      });
    };

    return () => {
      newProductChartsWorker.terminate();
      isComponentMountedRef.current = false;
    };
  }, []);

  if (!productMetricsDocument || !cards || !charts) {
    return null;
  }

  const overviewMetrics = returnOverviewAllProductsMetrics(
    productMetricsDocument,
    selectedYYYYMMDD,
  );

  const overviewCards = returnProductMetricsOverviewCards({
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocation,
  });

  return (
    <RUS
      calendarChartsData={calendarChartsData}
      calendarView={calendarView}
      day={selectedDate}
      metricsView="Products"
      month={selectedYYYYMMDD.split("-")[1]}
      overviewCards={overviewCards[calendarView]}
      productCategory={productMetricCategory}
      productMetricsCards={cards}
      productMetricsCharts={charts}
      storeLocation={storeLocation}
      subMetric={productSubMetricCategory}
      year={selectedYear}
    />
  );
}

export { ProductMetrics };
