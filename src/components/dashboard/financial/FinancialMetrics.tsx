import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { FinancialMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { MessageEventFinancialWorkerToMain } from "../../../workers/financialChartsWorker";
import FinancialChartsWorker from "../../../workers/financialChartsWorker?worker";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { financialMetricsAction } from "./actions";
import { createFinancialMetricsCards } from "./cards";
import { returnSelectedDateFinancialMetrics } from "./chartsData";
import { PERT_SET } from "./constants";
import { handleMessageEventFinancialWorkerToMain } from "./handlers";
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
  calendarView: DashboardCalendarView;
  financialMetricCategory: FinancialMetricCategory;
  financialMetricsDocument: FinancialMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocation: AllStoreLocations;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function FinancialMetrics(
  {
    calendarView,
    financialMetricCategory,
    financialMetricsDocument,
    selectedDate,
    selectedMonth,
    selectedYYYYMMDD,
    selectedYear,
    storeLocation,
  }: FinancialMetricsProps,
) {
  const [financialMetricsState, financialMetricsDispatch] = useReducer(
    financialMetricsReducer,
    initialFinancialMetricsState,
  );
  const {
    cards,
    charts,
    calendarChartsData,
    financialChartsWorker,
    isGenerating,
  } = financialMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { showBoundary } = useErrorBoundary();

  const { cardBgGradient, redColorShade, greenColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const isComponentMountedRef = useMountedRef();

  const selectedDateFinancialMetrics = returnSelectedDateFinancialMetrics(
    {
      financialMetricsDocument,
      day: selectedDate,
      month: selectedMonth,
      months: MONTHS,
      storeLocation,
      year: selectedYear,
    },
  );

  useEffect(() => {
    if (!financialChartsWorker) {
      return;
    }

    if (financialMetricsDocument || !cards || !charts) {
      financialChartsWorker.postMessage(
        {
          calendarView,
          financialMetricsDocument,
          selectedDateFinancialMetrics,
          selectedYYYYMMDD,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    financialChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocation,
    financialMetricsDocument,
  ]);

  useEffect(() => {
    const newFinancialChartsWorker = new FinancialChartsWorker();

    financialMetricsDispatch({
      action: financialMetricsAction.setFinancialChartsWorker,
      payload: newFinancialChartsWorker,
    });

    newFinancialChartsWorker.onmessage = async (
      event: MessageEventFinancialWorkerToMain,
    ) => {
      await handleMessageEventFinancialWorkerToMain({
        event,
        isComponentMountedRef,
        financialMetricsDispatch,
        showBoundary,
      });
    };

    return () => {
      newFinancialChartsWorker.terminate();
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateFinancialChartsCards() {
      try {
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
          action: financialMetricsAction.setCards,
          payload: financialMetricsCards,
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
  }, [
    calendarView,
    financialChartsWorker,
    selectedYYYYMMDD,
    storeLocation,
    themeObject,
    financialMetricsDocument,
  ]);

  if (
    !calendarChartsData.currentYear || !calendarChartsData.previousYear ||
    !financialMetricsDocument || !cards || !charts || isGenerating
  ) {
    return null;
  }

  const overviewMetrics = returnOverviewFinancialMetrics(
    financialMetricsDocument,
    selectedYYYYMMDD,
  );

  const { pertOverviewCards, otherMetricsOverviewCards } =
    returnFinancialMetricsOverviewCards({
      overviewMetrics,
      selectedYYYYMMDD,
      storeLocation,
    });

  const subCategoryPage = PERT_SET.has(financialMetricCategory)
    ? (
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
        storeLocation={storeLocation}
        year={selectedYear}
      />
    )
    : (
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
        storeLocation={storeLocation}
        year={selectedYear}
      />
    );

  return subCategoryPage;
}

export { FinancialMetrics };
