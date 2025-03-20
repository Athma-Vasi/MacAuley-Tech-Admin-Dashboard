import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleSegmentedControl } from "../../accessibleInputs/AccessibleSegmentedControl";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { customerMetricsAction } from "./actions";
import { createCustomerMetricsCards } from "./cards";
import {
  createCustomerMetricsCharts,
  returnSelectedDateCustomerMetrics,
} from "./chartsData";
import { ChurnRetention } from "./churnRetention/ChurnRetention";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "./constants";
import New from "./new/New";
import NewReturning from "./newReturning/NewReturning";
import { customerMetricsReducer } from "./reducers";
import { initialCustomerMetricsState } from "./state";

type CustomerMetricsProps = {
  businessMetrics: BusinessMetric[];
  calendarView: DashboardCalendarView;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function CustomerMetrics({
  businessMetrics,
  calendarView,
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
  const { cards, category, charts, isGenerating } = customerMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  const {
    redColorShade,
    greenColorShade,
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

  const categorySegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: CUSTOMER_METRICS_CATEGORY_DATA as any,
        name: "category",
        parentDispatch: customerMetricsDispatch,
        validValueAction: customerMetricsAction.setCategory,
        value: category,
      }}
    />
  );

  const newReturning = (
    <NewReturning
      calendarView={calendarView}
      customerMetricsCards={cards}
      customerMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      metricCategory={category}
      metricsView="Customers"
      storeLocation={storeLocationView}
      year={selectedYear}
    />
  );

  const newCustomers = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <New
        calendarView={calendarView}
        customerMetricsCards={cards}
        customerMetricsCharts={charts}
        day={selectedDate}
        month={selectedYYYYMMDD.split("-")[1]}
        metricCategory="new"
        metricsView="Customers"
        storeLocation={storeLocationView}
        year={selectedYear}
      />
    </React.Fragment>
  ));

  const churnRetention = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <ChurnRetention
        calendarView={calendarView}
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
      {categorySegmentedControl}
      {category === "new"
        ? newCustomers
        : category === "returning"
        ? newReturning
        : churnRetention}
    </Stack>
  );

  return customerMetrics;
}

export { CustomerMetrics };
