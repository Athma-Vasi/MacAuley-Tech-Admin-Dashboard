import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { FinancialMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { financialMetricsAction } from "./actions";
import { MessageEventFinancialChartsWorkerToMain } from "./chartsWorker";
import FinancialChartsWorker from "./chartsWorker?worker";
import { PERT_SET } from "./constants";
import { handleMessageEventFinancialChartsWorkerToMain } from "./handlers";
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

  const { grayBorderShade, redColorShade, greenColorShade } = returnThemeColors(
    {
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    },
  );

  const isComponentMountedRef = useMountedRef();

  useEffect(() => {
    if (!financialChartsWorker || !financialMetricsDocument) {
      return;
    }

    financialChartsWorker.postMessage(
      {
        calendarView,
        grayBorderShade,
        financialMetricsDocument,
        greenColorShade,
        redColorShade,
        selectedDate,
        selectedMonth,
        selectedYYYYMMDD,
        selectedYear,
      },
    );
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
      event: MessageEventFinancialChartsWorkerToMain,
    ) => {
      await handleMessageEventFinancialChartsWorkerToMain({
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
  }, []);

  if (
    !calendarChartsData.currentYear || !calendarChartsData.previousYear ||
    !financialMetricsDocument || !cards || !charts
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
