import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { CustomerMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { MessageEventCustomerWorkerToMain } from "../../../workers/customerChartsWorker";
import CustomerChartsWorker from "../../../workers/customerChartsWorker?worker";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { customerMetricsAction } from "./actions";
import { createCustomerMetricsCards } from "./cards";
import { returnSelectedDateCustomerMetrics } from "./chartsData";
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

  const { cardBgGradient, redColorShade, greenColorShade } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const isComponentMountedRef = useMountedRef();

  const selectedDateCustomerMetrics = returnSelectedDateCustomerMetrics({
    customerMetricsDocument,
    day: selectedDate,
    month: selectedMonth,
    months: MONTHS,
    year: selectedYear,
  });

  console.log("selectedDateCustomerMetrics", selectedDateCustomerMetrics);

  useEffect(() => {
    if (!customerChartsWorker) {
      return;
    }

    if (customerMetricsDocument || !cards || !charts) {
      customerChartsWorker.postMessage(
        {
          calendarView,
          customerMetricsDocument,
          selectedDateCustomerMetrics,
          selectedYYYYMMDD,
        },
      );
    }
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

  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateCustomerChartsCards() {
      try {
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
          action: customerMetricsAction.setCards,
          payload: customerMetricsCards,
        });
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        showBoundary(error);
      }
    }

    if (customerMetricsDocument || !cards || !charts) {
      generateCustomerChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
  }, [
    customerMetricsDocument,
    calendarView,
    selectedYYYYMMDD,
    storeLocation,
    themeObject,
  ]);

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
      storeLocation={storeLocation}
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
      storeLocation={storeLocation}
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
      storeLocation={storeLocation}
      year={selectedYear}
    />
  );

  // const customerMetrics = (
  //   <Stack w="100%" pos="relative">
  //     <LoadingOverlay visible={isGenerating} />
  //     {customerMetricsCategory === "new"
  //       ? newCustomers
  //       : customerMetricsCategory === "returning"
  //       ? returningCustomers
  //       : churnRetention}
  //   </Stack>
  // );

  return customerMetricsCategory === "new"
    ? newCustomers
    : customerMetricsCategory === "returning"
    ? returningCustomers
    : churnRetention;
}

export { CustomerMetrics };
