import { Group, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
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
import { customerMetricsAction } from "./actions";
import { createCustomerMetricsCards } from "./cards";
import {
  createCustomerMetricsCalendarCharts,
  createCustomerMetricsCharts,
  returnSelectedDateCustomerMetrics,
} from "./chartsData";
import { ChurnRetention } from "./churnRetention/ChurnRetention";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "./constants";
import New from "./new/New";
import { customerMetricsReducer } from "./reducers";
import Returning from "./returning/Returning";
import { initialCustomerMetricsState } from "./state";
import {
  returnCustomerMetricsOverviewCards,
  returnOverviewCustomerMetrics,
} from "./utils";

type CustomerMetricsProps = {
  businessMetrics: BusinessMetric[];
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function CustomerMetrics({
  businessMetrics,
  selectedDate,
  selectedMonth,
  selectedYYYYMMDD,
  selectedYear,
  storeLocationView,
}: CustomerMetricsProps) {
  const [customerMetricsState, customerMetricsDispatch] = useReducer(
    customerMetricsReducer,
    initialCustomerMetricsState,
  );
  const { calendarChartsData, cards, category, charts, isGenerating } =
    customerMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { windowWidth } = useWindowSize();

  const { showBoundary } = useErrorBoundary();

  const {
    redColorShade,
    greenColorShade,
    backgroundColor,
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const isComponentMountedRef = useRef(false);
  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateCustomerChartsCards() {
      customerMetricsDispatch({
        action: customerMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateCustomerMetrics = returnSelectedDateCustomerMetrics({
          businessMetrics,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          storeLocation: storeLocationView,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createCustomerMetricsCalendarCharts(
            selectedDateCustomerMetrics,
          );

        const customerMetricsCharts = await createCustomerMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedDateCustomerMetrics,
          storeLocation: storeLocationView,
        });

        const customerMetricsCards = await createCustomerMetricsCards({
          greenColorShade,
          redColorShade,
          selectedDateCustomerMetrics,
        });

        if (!isMounted) {
          return;
        }

        customerMetricsDispatch({
          action: customerMetricsAction.setCalendarChartsData,
          payload: {
            currentYear,
            previousYear,
          },
        });

        customerMetricsDispatch({
          action: customerMetricsAction.setCards,
          payload: customerMetricsCards,
        });

        customerMetricsDispatch({
          action: customerMetricsAction.setCharts,
          payload: customerMetricsCharts,
        });

        customerMetricsDispatch({
          action: customerMetricsAction.setIsGenerating,
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
      generateCustomerChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView]);

  if (!businessMetrics?.length || !cards || !charts) {
    return null;
  }

  const categorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CUSTOMER_METRICS_CATEGORY_DATA,
        name: "Sub-metric",
        parentDispatch: customerMetricsDispatch,
        validValueAction: customerMetricsAction.setCategory,
        value: category,
      }}
    />
  );

  const customerMetricsHeader = (
    <Group
      h={windowWidth < MOBILE_BREAKPOINT
        ? METRICS_HEADER_HEIGHT_MOBILE
        : METRICS_HEADER_HEIGHT}
      opacity={0.97}
      py="sm"
      position="apart"
      style={{
        position: "sticky",
        top: windowWidth < MOBILE_BREAKPOINT
          ? APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT_MOBILE
          : APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT,
        zIndex: 3,
        backgroundColor,
        // boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.1)",
      }}
    >
      {categorySelectInput}
    </Group>
  );

  const overviewMetrics = returnOverviewCustomerMetrics(
    businessMetrics,
    storeLocationView,
    selectedYYYYMMDD,
  );

  const { churnOverviewCards, newOverviewCards, returningOverviewCards } =
    returnCustomerMetricsOverviewCards({
      overviewMetrics,
      selectedYYYYMMDD,
      storeLocationView,
    });

  const newCustomers = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <New
        calendarChartsData={calendarChartsData}
        calendarView={calendarView}
        customerMetricsCards={cards}
        customerMetricsCharts={charts}
        day={selectedDate}
        month={selectedYYYYMMDD.split("-")[1]}
        metricCategory={category}
        metricsView="Customers"
        newOverviewCards={newOverviewCards[calendarView]}
        storeLocation={storeLocationView}
        year={selectedYear}
      />
    </React.Fragment>
  ));

  const returningCustomers = CALENDAR_VIEW_TABS_DATA.map((
    calendarView,
    idx,
  ) => (
    <React.Fragment key={idx}>
      <Returning
        calendarChartsData={calendarChartsData}
        calendarView={calendarView}
        customerMetricsCards={cards}
        customerMetricsCharts={charts}
        day={selectedDate}
        month={selectedYYYYMMDD.split("-")[1]}
        metricCategory={category}
        metricsView="Customers"
        returningOverviewCards={returningOverviewCards[calendarView]}
        storeLocation={storeLocationView}
        year={selectedYear}
      />
    </React.Fragment>
  ));

  const churnRetention = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <ChurnRetention
        calendarChartsData={calendarChartsData}
        calendarView={calendarView}
        churnOverviewCards={churnOverviewCards[calendarView]}
        customerMetricsCards={cards}
        customerMetricsCharts={charts}
        day={selectedDate}
        month={selectedYYYYMMDD.split("-")[1]}
        metricCategory={category}
        metricsView="Customers"
        storeLocation={storeLocationView}
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

  const customerMetrics = (
    <Stack>
      {loadingOverlay}
      {customerMetricsHeader}
      {category === "new"
        ? newCustomers
        : category === "returning"
        ? returningCustomers
        : churnRetention}
    </Stack>
  );

  return customerMetrics;
}

export { CustomerMetrics };
