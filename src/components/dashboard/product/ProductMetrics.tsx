import {
  Card,
  Group,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES, INPUT_WIDTH } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import {
  addCommaSeparator,
  formatDate,
  returnThemeColors,
} from "../../../utils";
import { AccessibleSegmentedControl } from "../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardMetricsView,
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

  const subMetricSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: PRODUCT_METRICS_SUB_CATEGORY_DATA,
        name: "category",
        parentDispatch: productMetricsDispatch,
        validValueAction: productMetricsAction.setSubMetric,
        value: subMetric,
      }}
    />
  );

  const productCategorySelectInput = (
    <Group w={300}>
      <AccessibleSelectInput
        attributes={{
          data: PRODUCT_METRIC_CATEGORY_DATA,
          name: "category",
          parentDispatch: productMetricsDispatch,
          validValueAction: productMetricsAction.setProductCategory,
          value: productCategory,
        }}
      />
    </Group>
  );

  function returnSelectedDateAllProductsMetrics(
    businessMetrics: BusinessMetric[],
    storeLocationView: BusinessMetricStoreLocation,
    selectedYYYYMMDD: string,
  ) {
    const defaultValue = {
      dailyRevenue: 0,
      dailyUnitsSold: 0,
    };

    const [year, month, day] = selectedYYYYMMDD.split("-") as [
      string,
      string,
      string,
    ];
    const productMetrics = businessMetrics.find(
      (bmetric) => bmetric.storeLocation === storeLocationView,
    )?.productMetrics;

    if (!productMetrics) {
      return defaultValue;
    }

    const allProductsYearlyMetrics = productMetrics.find(
      (productMetric) => productMetric.name === "All Products",
    );

    console.log({ allProductsYearlyMetrics });

    if (!allProductsYearlyMetrics) {
      return defaultValue;
    }

    const allProductsDailyMetrics = allProductsYearlyMetrics.yearlyMetrics.find(
      (yearlyMetric) => yearlyMetric.year === year,
    )?.monthlyMetrics.find((monthlyMetric) =>
      monthlyMetric.month === (MONTHS[Number(month) - 1].toString())
    )
      ?.dailyMetrics.find((dailyMetric) => dailyMetric.day === day);

    if (!allProductsDailyMetrics) {
      return defaultValue;
    }

    return {
      ...defaultValue,
      dailyRevenue: allProductsDailyMetrics.revenue.total,
      dailyUnitsSold: allProductsDailyMetrics.unitsSold.total,
    };
  }

  const { dailyRevenue, dailyUnitsSold } = returnSelectedDateAllProductsMetrics(
    businessMetrics,
    storeLocationView,
    selectedYYYYMMDD,
  );

  function createOverviewMetricCard(
    {
      metricsView,
      selectedYYYYMMDD,
      storeLocationView,
      subMetric,
      unit,
      value,
    }: {
      metricsView: DashboardMetricsView;
      selectedYYYYMMDD: string;
      storeLocationView: BusinessMetricStoreLocation;
      subMetric: string;
      unit: "CAD" | "%" | "Units";
      value: number;
    },
  ) {
    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w={INPUT_WIDTH}
        h={185}
      >
        <Stack align="flex-start" spacing={4}>
          <Text size={26} weight={600}>{metricsView}</Text>
          <Text size={16} mb={5}>
            {storeLocationView} {subMetric} for
          </Text>
          <Text size={16} mb={5}>
            {formatDate({
              date: selectedYYYYMMDD,
              formatOptions: { dateStyle: "long" },
            })}
          </Text>
          {/* <Text size={18} mb={5}>{subMetric}</Text> */}
          <Text size={28} weight={500}>
            {addCommaSeparator(value)} {unit}
          </Text>
        </Stack>
      </Card>
    );
  }

  const overviewRevenueCard = createOverviewMetricCard(
    {
      metricsView: "Products",
      selectedYYYYMMDD,
      storeLocationView,
      subMetric: "Revenue",
      unit: "CAD",
      value: dailyRevenue,
    },
  );

  const overviewUnitsSoldCard = createOverviewMetricCard(
    {
      metricsView: "Products",
      selectedYYYYMMDD,
      storeLocationView,
      subMetric: "Units Sold",
      unit: "Units",
      value: dailyUnitsSold,
    },
  );

  const overviewCards = (
    <>
      {overviewRevenueCard}
      {overviewUnitsSoldCard}
    </>
  );

  const revenueUnitsSold = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <RUS
        calendarChartsData={calendarChartsData}
        calendarView={calendarView}
        day={selectedDate}
        metricsView="Products"
        month={selectedYYYYMMDD.split("-")[1]}
        overviewCards={overviewCards}
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
    <Stack>
      {loadingOverlay}
      <Group
        opacity={0.97}
        py="sm"
        position="apart"
        style={{
          position: "sticky",
          top: 100,
          zIndex: 3,
          backgroundColor,
        }}
      >
        {subMetricSegmentedControl}
        {productCategorySelectInput}
      </Group>

      {revenueUnitsSold}
    </Stack>
  );

  return productMetrics;
}

export { ProductMetrics };
