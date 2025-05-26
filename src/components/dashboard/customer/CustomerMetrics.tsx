import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { CustomerMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { customerMetricsAction } from "./actions";
import { MessageEventCustomerWorkerToMain } from "./chartsWorker";
import CustomerChartsWorker from "./chartsWorker?worker";
import { ChurnRetention } from "./churnRetention/ChurnRetention";
import { handleMessageEventCustomerWorkerToMain } from "./handlers";
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
  storeLocation: AllStoreLocations;
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
    storeLocation,
  }: CustomerMetricsProps,
) {
  const [customerMetricsState, customerMetricsDispatch] = useReducer(
    customerMetricsReducer,
    initialCustomerMetricsState,
  );
  const {
    calendarChartsData,
    cards,
    charts,
    customerChartsWorker,
    isGenerating,
  } = customerMetricsState;

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
    if (!customerChartsWorker || !customerMetricsDocument) {
      return;
    }

    customerChartsWorker.postMessage(
      {
        calendarView,
        grayBorderShade,
        customerMetricsDocument,
        greenColorShade,
        redColorShade,
        selectedDate,
        selectedMonth,
        selectedYYYYMMDD,
        selectedYear,
      },
    );
  }, [
    customerChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocation,
    customerMetricsDocument,
    themeObject,
  ]);

  useEffect(() => {
    const newCustomerChartsWorker = new CustomerChartsWorker();

    customerMetricsDispatch({
      action: customerMetricsAction.setCustomerChartsWorker,
      payload: newCustomerChartsWorker,
    });

    newCustomerChartsWorker.onmessage = async (
      event: MessageEventCustomerWorkerToMain,
    ) => {
      await handleMessageEventCustomerWorkerToMain({
        event,
        isComponentMountedRef,
        customerMetricsDispatch,
        showBoundary,
      });
    };

    return () => {
      newCustomerChartsWorker.terminate();
      isComponentMountedRef.current = false;
    };
  }, []);

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
      storeLocation,
    });

  return customerMetricsCategory === "new"
    ? (
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
        storeLocation={storeLocation}
        year={selectedYear}
      />
    )
    : customerMetricsCategory === "returning"
    ? (
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
        storeLocation={storeLocation}
        year={selectedYear}
      />
    )
    : (
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
        storeLocation={storeLocation}
        year={selectedYear}
      />
    );
}

export { CustomerMetrics };
