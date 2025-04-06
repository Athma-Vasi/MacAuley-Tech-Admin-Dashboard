import { Overlay, Stack } from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  COLORS_SWATCHES,
  OVERLAY_BLUR,
  OVERLAY_OPACITY,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { ProductMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type { BusinessMetricStoreLocation, Month, Year } from "../types";
import { productMetricsAction } from "./actions";
import { createProductMetricsCards } from "./cards";
import {
  createProductMetricsCalendarCharts,
  createProductMetricsCharts,
  returnSelectedDateProductMetrics,
} from "./chartsData";
import { productMetricsReducer } from "./reducers";
import { RUS } from "./rus/RUS";
import { initialProductMetricsState } from "./state";
import { ProductMetricCategory, ProductSubMetric } from "./types";
import {
  returnOverviewAllProductsMetrics,
  returnProductMetricsOverviewCards,
} from "./utils";

type ProductMetricsProps = {
  productMetricCategory: ProductMetricCategory;
  productMetricsDocument: ProductMetricsDocument;
  productSubMetricCategory: ProductSubMetric;
  selectedDate: string;
  selectedMonth: Month;
  selectedYYYYMMDD: string;
  selectedYear: Year;
  storeLocationView: BusinessMetricStoreLocation;
};

function ProductMetrics(
  {
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
  } = productMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  const { cardBgGradient, redColorShade, greenColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const isComponentMountedRef = useRef(false);
  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateProductChartsCards() {
      productMetricsDispatch({
        action: productMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateProductMetrics = returnSelectedDateProductMetrics({
          productMetricsDocument,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createProductMetricsCalendarCharts(
            selectedDateProductMetrics,
          );

        const productMetricsCharts = await createProductMetricsCharts({
          productMetricsDocument,
          months: MONTHS,
          selectedDateProductMetrics,
        });

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
          action: productMetricsAction.setCalendarChartsData,
          payload: {
            currentYear,
            previousYear,
          },
        });

        productMetricsDispatch({
          action: productMetricsAction.setCards,
          payload: productMetricsCards,
        });

        productMetricsDispatch({
          action: productMetricsAction.setCharts,
          payload: productMetricsCharts,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView, productMetricCategory]);

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

  const revenueUnitsSold = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
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
    </React.Fragment>
  ));

  const productMetrics = (
    <Stack w="100%" pos="relative">
      {isGenerating
        ? <Overlay opacity={OVERLAY_OPACITY} blur={OVERLAY_BLUR} />
        : null}
      {revenueUnitsSold}
    </Stack>
  );

  return productMetrics;
}

export { ProductMetrics };
