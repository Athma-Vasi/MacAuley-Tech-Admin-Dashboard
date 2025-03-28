import {
  Accordion,
  Group,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  APP_HEADER_HEIGHT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  METRICS_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT_MOBILE,
  MOBILE_BREAKPOINT,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  Month,
  Year,
} from "../types";
import { productMetricsAction } from "./actions";
import { createProductMetricsCards } from "./cards";
import {
  createProductMetricsCalendarCharts,
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
import {
  returnOverviewAllProductsMetrics,
  returnProductMetricsOverviewCards,
} from "./utils";

type ProductMetricsProps = {
  businessMetrics: BusinessMetric[];
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function ProductMetrics({
  businessMetrics,
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
  const {
    calendarChartsData,
    cards,
    charts,
    isGenerating,
    productCategory,
    subMetric,
  } = productMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { windowWidth } = useWindowSize();

  const { showBoundary } = useErrorBoundary();

  const {
    redColorShade,
    greenColorShade,
    backgroundColor,
    grayColorShade,
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

        const { currentYear, previousYear } =
          await createProductMetricsCalendarCharts(
            selectedDateProductMetrics,
          );

        const productMetricsCharts = await createProductMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedProductCategory: productCategory,
          selectedDateProductMetrics,
          storeLocation: storeLocationView,
        });

        const productMetricsCards = await createProductMetricsCards({
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

  const subMetricSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRICS_SUB_CATEGORY_DATA,
        name: "Sub-metric",
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
        name: "Products",
        parentDispatch: productMetricsDispatch,
        validValueAction: productMetricsAction.setProductCategory,
        value: productCategory,
      }}
    />
  );

  const productMetricsHeader = (
    <Group
      h={METRICS_HEADER_HEIGHT}
      opacity={0.97}
      py="sm"
      position="apart"
      style={{
        position: "sticky",
        top: APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT,
        zIndex: 3,
        backgroundColor,
      }}
    >
      {subMetricSelectInput}
      {productCategorySelectInput}
    </Group>
  );

  const productMetricsHeaderAccordion = (
    <Group
      h={METRICS_HEADER_HEIGHT_MOBILE}
      opacity={0.97}
      py="sm"
      style={{
        position: "sticky",
        top: APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT_MOBILE,
        zIndex: 3,
        backgroundColor,
      }}
    >
      <Accordion bg={backgroundColor} w="100%">
        <Accordion.Item value="Sub-metrics and Category">
          <Accordion.Control>
            <Text weight={500} size="md">Sub-metrics and Category</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group w="100%" position="apart">
              {subMetricSelectInput}
              {productCategorySelectInput}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Group>
  );

  const overviewMetrics = returnOverviewAllProductsMetrics(
    businessMetrics,
    storeLocationView,
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
        productCategory={productCategory}
        productMetricsCards={cards}
        productMetricsCharts={charts}
        storeLocation={storeLocationView}
        subMetric={subMetric}
        year={selectedYear}
      />
    </React.Fragment>
  ));

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
    <Stack w="100%">
      {loadingOverlay}

      {windowWidth < MOBILE_BREAKPOINT
        ? productMetricsHeaderAccordion
        : productMetricsHeader}
      {revenueUnitsSold}
    </Stack>
  );

  return productMetrics;
}

export { ProductMetrics };
