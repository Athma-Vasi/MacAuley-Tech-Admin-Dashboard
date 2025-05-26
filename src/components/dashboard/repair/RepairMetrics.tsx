import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants";
import { useMountedRef } from "../../../hooks";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { RepairMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import type {
  AllStoreLocations,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { repairMetricsAction } from "./actions";
import { MessageEventRepairWorkerToMain } from "./chartsWorker";
import RepairChartsWorker from "./chartsWorker?worker";
import { handleMessageEventRepairWorkerToMain } from "./handlers";
import { repairMetricsReducer } from "./reducers";
import { RepairRUS } from "./repairRUS/RepairRUS";
import { initialRepairMetricsState } from "./state";
import { RepairMetricCategory } from "./types";
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
  storeLocation: AllStoreLocations;
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
    storeLocation,
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

  const { grayBorderShade, redColorShade, greenColorShade } = returnThemeColors(
    {
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    },
  );

  const isComponentMountedRef = useMountedRef();

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
    if (!repairChartsWorker || !repairMetricsDocument) {
      return;
    }

    repairChartsWorker.postMessage(
      {
        calendarView,
        grayBorderShade,
        greenColorShade,
        redColorShade,
        repairMetricsDocument,
        selectedDate,
        selectedMonth,
        selectedYYYYMMDD,
        selectedYear,
      },
    );
  }, [
    repairChartsWorker,
    calendarView,
    selectedYYYYMMDD,
    storeLocation,
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
  );

  const overviewCards = createOverviewRepairMetricsCards({
    overviewMetrics,
    selectedYYYYMMDD,
    storeLocation,
  });

  return (
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
      storeLocation={storeLocation}
      year={selectedYear}
    />
  );
}

export { RepairMetrics };
