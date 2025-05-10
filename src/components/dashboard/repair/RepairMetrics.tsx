import { Stack } from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { RepairMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import RepairChartsWorker from "../../../workers/repairChartsWorker?worker";
import { MONTHS } from "../constants";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { repairMetricsAction } from "./actions";
import { createRepairMetricsCards } from "./cards";
import { returnSelectedDateRepairMetrics } from "./chartsData";
import { handleMessageEventRepairWorkerToMain } from "./handlers";
import { repairMetricsReducer } from "./reducers";
import { RepairRUS } from "./repairRUS/RepairRUS";
import { initialRepairMetricsState } from "./state";
import { MessageEventRepairWorkerToMain, RepairMetricCategory } from "./types";
import {
  createOverviewRepairMetricsCards,
  returnOverviewRepairMetrics,
} from "./utils";

type RepairMetricsProps = {
  calendarView: DashboardCalendarView;
  repairMetricCategory: RepairMetricCategory;
  repairMetricsDocument: RepairMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: AllStoreLocations;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function RepairMetrics(
  {
    calendarView,
    repairMetricCategory,
    repairMetricsDocument,
    selectedDate,
    selectedMonth,
    selectedYYYYMMDD,
    selectedYear,
    storeLocationView,
  }: RepairMetricsProps,
) {
  const [repairMetricsState, repairMetricsDispatch] = useReducer(
    repairMetricsReducer,
    initialRepairMetricsState,
  );
  const {
    calendarChartsData,
    cards,
    charts,
    isGenerating,
    repairChartsWorker,
  } = repairMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  const { bgGradient, cardBgGradient, redColorShade, greenColorShade } =
    returnThemeColors({
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    });

  const isComponentMountedRef = useMountedRef();

  const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
    repairMetricsDocument,
    day: selectedDate,
    month: selectedMonth,
    months: MONTHS,
    year: selectedYear,
  });

  console.log("RepairMetrics state", repairMetricsState);

  useEffect(() => {
    if (!repairChartsWorker) {
      return;
    }

    if (repairMetricsDocument || !cards || !charts) {
      repairChartsWorker.postMessage(
        {
          calendarView,
          repairMetricsDocument,
          selectedDateRepairMetrics,
          selectedYYYYMMDD,
        },
      );
    }
  }, [
    repairChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocationView,
    repairMetricCategory,
    repairMetricsDocument,
  ]);

  useEffect(() => {
    const newRepairChartsWorker = new RepairChartsWorker();

    repairMetricsDispatch({
      action: repairMetricsAction.setRepairChartsWorker,
      payload: newRepairChartsWorker,
    });

    newRepairChartsWorker.onmessage = async (
      event: MessageEventRepairWorkerToMain,
    ) => {
      await handleMessageEventRepairWorkerToMain({
        event,
        isComponentMountedRef,
        repairMetricsDispatch,
        showBoundary,
      });
    };

    return () => {
      newRepairChartsWorker.terminate();
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateRepairChartsCards() {
      repairMetricsDispatch({
        action: repairMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        // const { currentYear, previousYear } =
        //   await createRepairMetricsCalendarCharts(
        //     calendarView,
        //     selectedDateRepairMetrics,
        //     selectedYYYYMMDD,
        //   );

        // const repairMetricsCharts = await createRepairMetricsCharts({
        //   repairMetricsDocument,
        //   months: MONTHS,
        //   selectedDateRepairMetrics,
        // });

        const repairMetricsCards = await createRepairMetricsCards({
          cardBgGradient,
          greenColorShade,
          redColorShade,
          selectedDateRepairMetrics,
        });

        if (!isMounted) {
          return;
        }

        // repairMetricsDispatch({
        //   action: repairMetricsAction.setCalendarChartsData,
        //   payload: {
        //     currentYear,
        //     previousYear,
        //   },
        // });

        repairMetricsDispatch({
          action: repairMetricsAction.setCards,
          payload: repairMetricsCards,
        });

        // repairMetricsDispatch({
        //   action: repairMetricsAction.setCharts,
        //   payload: repairMetricsCharts,
        // });

        repairMetricsDispatch({
          action: repairMetricsAction.setIsGenerating,
          payload: false,
        });
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        showBoundary(error);
      }
    }

    if (repairMetricsDocument || !cards || !charts) {
      generateRepairChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
  }, [
    calendarView,
    selectedYYYYMMDD,
    storeLocationView,
    repairMetricCategory,
    repairMetricsDocument,
    themeObject,
  ]);

  if (!repairMetricsDocument || !cards || !charts) {
    return null;
  }

  const overviewMetrics = returnOverviewRepairMetrics(
    repairMetricsDocument,
    selectedYYYYMMDD,
    repairMetricCategory,
  );

  const overviewCards = createOverviewRepairMetricsCards({
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocationView,
  });

  const revenueUnitsSold = (
    <RepairRUS
      calendarChartsData={calendarChartsData}
      calendarView={calendarView}
      day={selectedDate}
      metricsView="Repairs"
      month={selectedYYYYMMDD.split("-")[1]}
      repairCategory={repairMetricCategory}
      repairMetricsCards={cards}
      repairMetricsCharts={charts}
      repairOverviewCards={overviewCards[calendarView]}
      storeLocation={storeLocationView}
      year={selectedYear}
    />
  );

  const repairMetrics = (
    <Stack w="100%">
      {revenueUnitsSold}
    </Stack>
  );

  return repairMetrics;
}

export { RepairMetrics };
