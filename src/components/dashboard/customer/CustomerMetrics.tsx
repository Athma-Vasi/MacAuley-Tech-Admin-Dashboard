import { Overlay, Stack } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  COLORS_SWATCHES,
  OVERLAY_BLUR,
  OVERLAY_OPACITY,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { CustomerMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
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
import New from "./new/New";
import { customerMetricsReducer } from "./reducers";
import Returning from "./returning/Returning";
import { initialCustomerMetricsState } from "./state";
import { CustomerMetricsCategory } from "./types";
import {
  returnCustomerMetricsOverviewCards,
  returnOverviewCustomerMetrics,
} from "./utils";

type CustomerMetricsProps = {
  calendarView: DashboardCalendarView;
  customerMetricsCategory: CustomerMetricsCategory;
  customerMetricsDocument: CustomerMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: AllStoreLocations;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function CustomerMetrics(
  {
    calendarView,
    customerMetricsCategory,
    customerMetricsDocument,
    selectedDate,
    selectedMonth,
    selectedYYYYMMDD,
    selectedYear,
    storeLocationView,
  }: CustomerMetricsProps,
) {
  const [customerMetricsState, customerMetricsDispatch] = useReducer(
    customerMetricsReducer,
    initialCustomerMetricsState,
  );
  const { calendarChartsData, cards, charts, isGenerating } =
    customerMetricsState;

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

    async function generateCustomerChartsCards() {
      customerMetricsDispatch({
        action: customerMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateCustomerMetrics = returnSelectedDateCustomerMetrics({
          customerMetricsDocument,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createCustomerMetricsCalendarCharts(
            selectedDateCustomerMetrics,
          );

        const customerMetricsCharts = await createCustomerMetricsCharts({
          customerMetricsDocument,
          months: MONTHS,
          selectedDateCustomerMetrics,
        });

        const customerMetricsCards = await createCustomerMetricsCards({
          cardBgGradient,
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

    if (!cards || !charts) {
      generateCustomerChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView]);

  if (!customerMetricsDocument || !cards || !charts) {
    return null;
  }

  const overviewMetrics = returnOverviewCustomerMetrics(
    customerMetricsDocument,
    selectedYYYYMMDD,
  );

  const { churnOverviewCards, newOverviewCards, returningOverviewCards } =
    returnCustomerMetricsOverviewCards({
      overviewMetrics,
      selectedYYYYMMDD,
      storeLocationView,
    });

  const newCustomers = (
    <New
      calendarChartsData={calendarChartsData}
      calendarView={calendarView}
      customerMetricsCards={cards}
      customerMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      metricCategory={customerMetricsCategory}
      metricsView="Customers"
      newOverviewCards={newOverviewCards[calendarView]}
      storeLocation={storeLocationView}
      year={selectedYear}
    />
  );

  const returningCustomers = (
    <Returning
      calendarChartsData={calendarChartsData}
      calendarView={calendarView}
      customerMetricsCards={cards}
      customerMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      metricCategory={customerMetricsCategory}
      metricsView="Customers"
      returningOverviewCards={returningOverviewCards[calendarView]}
      storeLocation={storeLocationView}
      year={selectedYear}
    />
  );

  const churnRetention = (
    <ChurnRetention
      calendarChartsData={calendarChartsData}
      calendarView={calendarView}
      churnOverviewCards={churnOverviewCards[calendarView]}
      customerMetricsCards={cards}
      customerMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      metricCategory={customerMetricsCategory}
      metricsView="Customers"
      storeLocation={storeLocationView}
      year={selectedYear}
    />
  );

  const customerMetrics = (
    <Stack w="100%" pos="relative">
      {isGenerating
        ? <Overlay opacity={OVERLAY_OPACITY} blur={OVERLAY_BLUR} />
        : null}
      {customerMetricsCategory === "new"
        ? newCustomers
        : customerMetricsCategory === "returning"
        ? returningCustomers
        : churnRetention}
    </Stack>
  );

  return customerMetrics;
}

export { CustomerMetrics };
