import { Overlay, Stack } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import React from "react";
import {
  COLORS_SWATCHES,
  OVERLAY_BLUR,
  OVERLAY_OPACITY,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { FinancialMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type { AllStoreLocations, Month, Year } from "../types";
import { financialMetricsAction } from "./actions";
import { createFinancialMetricsCards } from "./cards";
import {
  createFinancialMetricsCalendarCharts,
  createFinancialMetricsCharts,
  returnSelectedDateFinancialMetrics,
} from "./chartsData";
import { PERT_SET } from "./constants";
import OtherMetrics from "./otherMetrics/OtherMetrics";
import PERT from "./pert/PERT";
import { financialMetricsReducer } from "./reducers";
import { initialFinancialMetricsState } from "./state";
import { FinancialMetricCategory } from "./types";
import {
  returnFinancialMetricsOverviewCards,
  returnOverviewFinancialMetrics,
} from "./utils";

type FinancialMetricsProps = {
  financialMetricCategory: FinancialMetricCategory;
  financialMetricsDocument: FinancialMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: AllStoreLocations;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function FinancialMetrics(
  {
    financialMetricCategory,
    financialMetricsDocument,
    selectedDate,
    selectedMonth,
    selectedYYYYMMDD,
    selectedYear,
    storeLocationView,
  }: FinancialMetricsProps,
) {
  const [financialMetricsState, financialMetricsDispatch] = useReducer(
    financialMetricsReducer,
    initialFinancialMetricsState,
  );
  const { cards, charts, calendarChartsData, isGenerating } =
    financialMetricsState;

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

    async function generateFinancialChartsCards() {
      financialMetricsDispatch({
        action: financialMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateFinancialMetrics = returnSelectedDateFinancialMetrics(
          {
            financialMetricsDocument,
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
          financialMetricsDocument,
          months: MONTHS,
          selectedDateFinancialMetrics,
          storeLocation: storeLocationView,
        });

        const financialMetricsCards = await createFinancialMetricsCards({
          cardBgGradient,
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

    if (financialMetricsDocument || !cards || !charts) {
      generateFinancialChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView]);

  if (!financialMetricsDocument || !cards || !charts) {
    return null;
  }

  const overviewMetrics = returnOverviewFinancialMetrics(
    financialMetricsDocument,
    storeLocationView,
    selectedYYYYMMDD,
  );

  const { pertOverviewCards, otherMetricsOverviewCards } =
    returnFinancialMetricsOverviewCards({
      overviewMetrics,
      selectedYYYYMMDD,
      storeLocationView,
    });

  const subCategoryPage = PERT_SET.has(financialMetricCategory)
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
            metricCategory={financialMetricCategory}
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
            metricCategory={financialMetricCategory}
            metricsView="Financials"
            otherMetricsOverviewCards={otherMetricsOverviewCards[calendarView]}
            storeLocation={storeLocationView}
            year={selectedYear}
          />
        </React.Fragment>
      ))
    );

  const financialMetrics = (
    <Stack w="100%" pos="relative">
      {isGenerating
        ? <Overlay opacity={OVERLAY_OPACITY} blur={OVERLAY_BLUR} />
        : null}
      {subCategoryPage}
    </Stack>
  );

  return financialMetrics;
}

export { FinancialMetrics };
