import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants/data";
import { useGlobalState } from "../../../hooks";
import { logState, returnThemeColors } from "../../../utils";
import { AccessibleSegmentedControl } from "../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { productMetricsAction } from "./actions";
import { returnProductMetricsCards } from "./cards";
import {
  createProductMetricsCharts,
  returnSelectedDateProductMetrics,
} from "./chartsData";
import {
  PRODUCT_METRIC_CATEGORY_DATA,
  PRODUCT_METRICS_SUB_CATEGORY_DATA,
} from "./constants";
import { productMetricsReducer } from "./reducers";
import { RUS } from "./rus/RUS";
import { initialProductMetricsState } from "./state";

type ProductMetricsProps = {
  businessMetrics: BusinessMetric[];
  calendarView: DashboardCalendarView;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function ProductMetrics({
  businessMetrics,
  calendarView,
  selectedDate,
  selectedMonth,
  selectedYYYYMMDD,
  selectedYear,
  storeLocationView,
}: ProductMetricsProps) {
  const [productMetricsState, productMetricsDispatch] = useReducer(
    productMetricsReducer,
    initialProductMetricsState,
  );
  const { cards, charts, isGenerating, productCategory, subMetric } =
    productMetricsState;

  const {
    globalState: { themeObject, width },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  const {
    generalColors: { redColorShade, greenColorShade },
    appThemeColors: { borderColor },
  } = returnThemeColors({
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
          businessMetrics,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          selectedProductCategory: productCategory,
          storeLocation: storeLocationView,
          year: selectedYear,
        });

        const productMetricsCharts = await createProductMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedProductCategory: productCategory,
          selectedDateProductMetrics,
          storeLocation: storeLocationView,
        });

        const productMetricsCards = await returnProductMetricsCards({
          greenColorShade,
          redColorShade,
          selectedDateProductMetrics,
          width,
        });

        if (!isMounted) {
          return;
        }

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

    if (businessMetrics?.length || !cards || !charts) {
      generateProductChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView, productCategory]);

  if (!businessMetrics?.length || !cards || !charts) {
    return null;
  }

  logState({
    state: productMetricsState,
    groupLabel: "ProductMetrics",
  });

  const subMetricSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: PRODUCT_METRICS_SUB_CATEGORY_DATA as any,
        name: "category",
        parentDispatch: productMetricsDispatch,
        validValueAction: productMetricsAction.setSubMetric,
        value: subMetric,
      }}
    />
  );

  const productCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRIC_CATEGORY_DATA,
        name: "category",
        parentDispatch: productMetricsDispatch,
        validValueAction: productMetricsAction.setProductCategory,
        value: productCategory,
      }}
    />
  );

  const revenueUnitsSold = (
    <RUS
      borderColor={borderColor}
      calendarView={calendarView}
      chartHeight={382}
      chartWidth={612}
      productMetricsCards={cards}
      productMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      subMetric={subMetric}
      metricsView="Products"
      storeLocation={storeLocationView}
      width={width}
      year={selectedYear}
    />
  );

  const loadingOverlay = (
    <LoadingOverlay
      visible={isGenerating}
      zIndex={2}
      overlayBlur={9}
      overlayOpacity={0.99}
      radius={4}
      loader={
        <Stack align="center">
          <Loader />
          <Text>Generating charts ... Please wait ...</Text>
        </Stack>
      }
      transitionDuration={500}
    />
  );

  const productMetrics = (
    <Stack>
      {loadingOverlay}
      {subMetricSegmentedControl}
      {productCategorySelectInput}
      {revenueUnitsSold}
    </Stack>
  );

  logState({
    state: productMetricsState,
    groupLabel: "ProductMetrics",
  });

  return productMetrics;
}

export { ProductMetrics };
