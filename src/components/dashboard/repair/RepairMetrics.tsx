import { Box, Group, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  METRICS_HEADER_HEIGHT,
  METRICS_HEADER_HEIGHT_MOBILE,
  MOBILE_BREAKPOINT,
} from "../../../constants";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { RepairMetricsDocument } from "../../../types";
import { returnThemeColors } from "../../../utils";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { CALENDAR_VIEW_TABS_DATA, MONTHS } from "../constants";
import type { BusinessMetricStoreLocation, Month, Year } from "../types";
import { repairMetricsAction } from "./actions";
import { createRepairMetricsCards } from "./cards";
import {
  createRepairMetricsCalendarCharts,
  createRepairMetricsCharts,
  returnSelectedDateRepairMetrics,
} from "./chartsData";
import { REPAIR_METRICS_DATA } from "./constants";
import { repairMetricsReducer } from "./reducers";
import { RepairRUS } from "./repairRUS/RepairRUS";
import { initialRepairMetricsState } from "./state";
import {
  createOverviewRepairMetricsCards,
  returnOverviewRepairMetrics,
} from "./utils";

type RepairMetricsProps = {
  repairMetricsDocument: RepairMetricsDocument;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function RepairMetrics({
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
    repairCategory,
  } = repairMetricsState;

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const { windowWidth } = useWindowSize();

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
          selectedRepairCategory: repairCategory,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createRepairMetricsCalendarCharts(selectedDateRepairMetrics);

        const repairMetricsCharts = await createRepairMetricsCharts({
          repairMetricsDocument,
          months: MONTHS,
          selectedRepairCategory: repairCategory,
          selectedDateRepairMetrics,
        });

        const repairMetricsCards = await createRepairMetricsCards({
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
  }, [selectedYYYYMMDD, storeLocationView, repairCategory]);

  if (!repairMetricsDocument || !cards || !charts) {
    return null;
  }

  const repairCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_DATA,
        name: "Repairs",
        parentDispatch: repairMetricsDispatch,
        validValueAction: repairMetricsAction.setRepairCategory,
        value: repairCategory,
      }}
    />
  );

  const repairMetricsHeader = (
    <Group
      h={windowWidth < MOBILE_BREAKPOINT
        ? METRICS_HEADER_HEIGHT_MOBILE
        : METRICS_HEADER_HEIGHT}
      opacity={0.97}
      px="md"
      style={{
        position: "sticky",
        top: windowWidth < MOBILE_BREAKPOINT
          ? DASHBOARD_HEADER_HEIGHT_MOBILE
          : DASHBOARD_HEADER_HEIGHT,
        zIndex: 3,
        backgroundColor,
      }}
    >
      {repairCategorySelectInput}
    </Group>
  );

  const overviewMetrics = returnOverviewRepairMetrics(
    repairMetricsDocument,
    selectedYYYYMMDD,
    repairCategory,
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
        repairCategory={repairCategory}
        repairMetricsCards={cards}
        repairMetricsCharts={charts}
        repairOverviewCards={overviewCards[calendarView]}
        storeLocation={storeLocationView}
        year={selectedYear}
      />
    </Box>
  ));

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

  const repairMetrics = (
    <Stack w="100%">
      {loadingOverlay}
      {repairMetricsHeader}
      {revenueUnitsSold}
    </Stack>
  );

  return repairMetrics;
}

export { RepairMetrics };
