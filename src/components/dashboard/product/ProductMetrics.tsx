import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { ProductMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import ProductChartsWorker from "../../../workers/productChartsWorker?worker";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { productMetricsAction } from "./actions";
import { createProductMetricsCards } from "./cards";
import { returnSelectedDateProductMetrics } from "./chartsData";
import { handleMessageEventProductWorkerToMain } from "./handlers";
import { productMetricsReducer } from "./reducers";
import { RUS } from "./rus/RUS";
import { initialProductMetricsState } from "./state";
import {
  MessageEventProductWorkerToMain,
  ProductMetricCategory,
  ProductSubMetric,
} from "./types";
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
  storeLocationView: AllStoreLocations;
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
    storeLocationView,
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

  useEffect(() => {
    if (!productChartsWorker) {
      return;
    }

    if (productMetricsDocument || !cards || !charts) {
      productChartsWorker.postMessage(
        {
          calendarView,
          productMetricsDocument,
          selectedDateProductMetrics,
          selectedYYYYMMDD,
        },
      );
    }
  }, [
    productChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocationView,
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

  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateProductChartsCards() {
      productMetricsDispatch({
        action: productMetricsAction.setIsGenerating,
        payload: true,
      });

      const { cardBgGradient, redColorShade, greenColorShade } =
        returnThemeColors({
          colorsSwatches: COLORS_SWATCHES,
          themeObject,
        });

      try {
        const productMetricsCards = await createProductMetricsCards({
          cardBgGradient,
          greenColorShade,
          redColorShade,
          selectedDateProductMetrics,
        });

        if (!isMounted) {
          return;
        }

        productMetricsDispatch({
          action: productMetricsAction.setCards,
          payload: productMetricsCards,
        });

        productMetricsDispatch({
          action: productMetricsAction.setIsGenerating,
          payload: false,
        });
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        showBoundary(error);
      }
    }

    if (productMetricsDocument || !cards || !charts) {
      generateProductChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
  }, [
    calendarView,
    productMetricCategory,
    productMetricsDocument,
    selectedYYYYMMDD,
    storeLocationView,
    themeObject,
  ]);

  if (!productMetricsDocument || !cards || !charts) {
    return null;
  }

  const overviewMetrics = returnOverviewAllProductsMetrics(
    productMetricsDocument,
    productMetricCategory,
    selectedYYYYMMDD,
  );

  const overviewCards = returnProductMetricsOverviewCards({
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocationView,
  });

  const revenueUnitsSold = (
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
      storeLocation={storeLocationView}
      subMetric={productSubMetricCategory}
      year={selectedYear}
    />
  );

  return revenueUnitsSold;
}

export { ProductMetrics };
