import { Box, Overlay, Stack } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  COLORS_SWATCHES,
  OVERLAY_BLUR,
  OVERLAY_OPACITY,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { RepairMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type { BusinessMetricStoreLocation, Month, Year } from "../types";
import { repairMetricsAction } from "./actions";
import { createRepairMetricsCards } from "./cards";
import {
  createRepairMetricsCalendarCharts,
  createRepairMetricsCharts,
  returnSelectedDateRepairMetrics,
} from "./chartsData";
import { repairMetricsReducer } from "./reducers";
import { RepairRUS } from "./repairRUS/RepairRUS";
import { initialRepairMetricsState } from "./state";
import { RepairMetricCategory } from "./types";
import {
  createOverviewRepairMetricsCards,
  returnOverviewRepairMetrics,
} from "./utils";

type RepairMetricsProps = {
  repairMetricCategory: RepairMetricCategory;
  repairMetricsDocument: RepairMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function RepairMetrics({
  repairMetricCategory,
  repairMetricsDocument,
  selectedDate,
  selectedMonth,
  selectedYYYYMMDD,
  selectedYear,
  storeLocationView,
}: RepairMetricsProps) {
  const [repairMetricsState, repairMetricsDispatch] = useReducer(
    repairMetricsReducer,
    initialRepairMetricsState,
  );
  const {
    calendarChartsData,
    cards,
    charts,
    isGenerating,
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

  const isComponentMountedRef = useRef(false);
  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function generateRepairChartsCards() {
      repairMetricsDispatch({
        action: repairMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
          repairMetricsDocument,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createRepairMetricsCalendarCharts(selectedDateRepairMetrics);

        const repairMetricsCharts = await createRepairMetricsCharts({
          repairMetricsDocument,
          months: MONTHS,
          selectedDateRepairMetrics,
        });

        const repairMetricsCards = await createRepairMetricsCards({
          cardBgGradient,
          greenColorShade,
          redColorShade,
          selectedDateRepairMetrics,
        });

        if (!isMounted) {
          return;
        }

        repairMetricsDispatch({
          action: repairMetricsAction.setCalendarChartsData,
          payload: {
            currentYear,
            previousYear,
          },
        });

        repairMetricsDispatch({
          action: repairMetricsAction.setCards,
          payload: repairMetricsCards,
        });

        repairMetricsDispatch({
          action: repairMetricsAction.setCharts,
          payload: repairMetricsCharts,
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView, repairMetricCategory]);

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

  const revenueUnitsSold = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <Box key={idx} w="100%">
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
    </Box>
  ));

  const repairMetrics = (
    <Stack w="100%" pos="relative">
      {isGenerating
        ? <Overlay opacity={OVERLAY_OPACITY} blur={OVERLAY_BLUR} />
        : null}
      {revenueUnitsSold}
    </Stack>
  );

  return repairMetrics;
}

export { RepairMetrics };
