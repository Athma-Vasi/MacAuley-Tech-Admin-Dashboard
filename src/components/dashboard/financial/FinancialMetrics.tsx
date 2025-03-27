import { Group, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import React from "react";
import {
  APP_HEADER_HEIGHT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  Month,
  Year,
} from "../types";
import { financialMetricsAction } from "./actions";
import { createFinancialMetricsCards } from "./cards";
import {
  createFinancialMetricsCalendarCharts,
  createFinancialMetricsCharts,
  returnSelectedDateFinancialMetrics,
} from "./chartsData";
import { FINANCIAL_METRICS_CATEGORY_DATA, PERT_SET } from "./constants";
import OtherMetrics from "./otherMetrics/OtherMetrics";
import PERT from "./pert/PERT";
import { financialMetricsReducer } from "./reducers";
import { initialFinancialMetricsState } from "./state";
import {
  returnFinancialMetricsOverviewCards,
  returnOverviewFinancialMetrics,
} from "./utils";

type FinancialMetricsProps = {
  businessMetrics: BusinessMetric[];
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function FinancialMetrics({
  businessMetrics,
  selectedDate,
  selectedMonth,
  selectedYYYYMMDD,
  selectedYear,
  storeLocationView,
}: FinancialMetricsProps) {
  const [financialMetricsState, financialMetricsDispatch] = useReducer(
    financialMetricsReducer,
    initialFinancialMetricsState,
  );
  const { cards, category, charts, calendarChartsData, isGenerating } =
    financialMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

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

    async function generateFinancialChartsCards() {
      financialMetricsDispatch({
        action: financialMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateFinancialMetrics = returnSelectedDateFinancialMetrics(
          {
            businessMetrics,
            day: selectedDate,
            month: selectedMonth,
            months: MONTHS,
            storeLocation: storeLocationView,
            year: selectedYear,
          },
        );

        const {
          currentYear,
          previousYear,
        } = await createFinancialMetricsCalendarCharts(
          selectedDateFinancialMetrics,
        );

        const financialMetricsCharts = await createFinancialMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedDateFinancialMetrics,
          storeLocation: storeLocationView,
        });

        const financialMetricsCards = await createFinancialMetricsCards({
          greenColorShade,
          redColorShade,
          selectedDateFinancialMetrics,
        });

        if (!isMounted) {
          return;
        }

        financialMetricsDispatch({
          action: financialMetricsAction.setCalendarChartsData,
          payload: {
            currentYear,
            previousYear,
          },
        });

        financialMetricsDispatch({
          action: financialMetricsAction.setCards,
          payload: financialMetricsCards,
        });

        financialMetricsDispatch({
          action: financialMetricsAction.setCharts,
          payload: financialMetricsCharts,
        });

        financialMetricsDispatch({
          action: financialMetricsAction.setIsGenerating,
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
      generateFinancialChartsCards();
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
        data: FINANCIAL_METRICS_CATEGORY_DATA,
        name: "category",
        parentDispatch: financialMetricsDispatch,
        validValueAction: financialMetricsAction.setCategory,
        value: category,
      }}
    />
  );

  const overviewMetrics = returnOverviewFinancialMetrics(
    businessMetrics,
    storeLocationView,
    selectedYYYYMMDD,
  );

  const { pertOverviewCards, otherMetricsOverviewCards } =
    returnFinancialMetricsOverviewCards({
      overviewMetrics,
      selectedYYYYMMDD,
      storeLocationView,
    });

  const subCategoryPage = PERT_SET.has(category)
    ? (
      CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
        <React.Fragment key={idx}>
          <PERT
            calendarChartsData={calendarChartsData}
            calendarView={calendarView}
            financialMetricsCards={cards}
            financialMetricsCharts={charts}
            day={selectedDate}
            month={selectedYYYYMMDD.split("-")[1]}
            metricCategory={category}
            metricsView="Financials"
            pertOverviewCards={pertOverviewCards[calendarView]}
            storeLocation={storeLocationView}
            year={selectedYear}
          />
        </React.Fragment>
      ))
    )
    : (
      CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
        <React.Fragment key={idx}>
          <OtherMetrics
            calendarChartsData={calendarChartsData}
            calendarView={calendarView}
            financialMetricsCards={cards}
            financialMetricsCharts={charts}
            day={selectedDate}
            month={selectedYYYYMMDD.split("-")[1]}
            metricCategory={category}
            metricsView="Financials"
            otherMetricsOverviewCards={otherMetricsOverviewCards[calendarView]}
            storeLocation={storeLocationView}
            year={selectedYear}
          />
        </React.Fragment>
      ))
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

  const financialMetrics = (
    <Stack>
      {loadingOverlay}
      <Group
        align="center"
        h={METRICS_HEADER_HEIGHT}
        py="sm"
        style={{
          position: "sticky",
          top: APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT,
          zIndex: 3,
          backgroundColor,
          // boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.1)",
        }}
        opacity={0.97}
      >
        {categorySelectInput}
      </Group>
      {subCategoryPage}
    </Stack>
  );

  return financialMetrics;
}

export { FinancialMetrics };
