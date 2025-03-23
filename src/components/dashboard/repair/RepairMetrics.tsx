import { Group, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import React, { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

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
import { createOverviewRepairMetricCards } from "../utilsTSX";
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
import { returnDailyOverviewRepairMetrics } from "./utils";

type RepairMetricsProps = {
  businessMetrics: BusinessMetric[];
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function RepairMetrics({
  businessMetrics,
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
    subMetric,
  } = repairMetricsState;

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

    async function generateRepairChartsCards() {
      repairMetricsDispatch({
        action: repairMetricsAction.setIsGenerating,
        payload: true,
      });

      try {
        const selectedDateRepairMetrics = returnSelectedDateRepairMetrics({
          businessMetrics,
          day: selectedDate,
          month: selectedMonth,
          months: MONTHS,
          selectedRepairCategory: repairCategory,
          storeLocation: storeLocationView,
          year: selectedYear,
        });

        const { currentYear, previousYear } =
          await createRepairMetricsCalendarCharts(selectedDateRepairMetrics);

        const repairMetricsCharts = await createRepairMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedRepairCategory: repairCategory,
          selectedDateRepairMetrics,
          storeLocation: storeLocationView,
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

    if (businessMetrics?.length || !cards || !charts) {
      generateRepairChartsCards();
    }

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYYYYMMDD, storeLocationView, repairCategory]);

  if (!businessMetrics?.length || !cards || !charts) {
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

  const { repairRevenueOverview, repairUnitsOverview } =
    returnDailyOverviewRepairMetrics(
      businessMetrics,
      storeLocationView,
      selectedYYYYMMDD,
      repairCategory,
    );

  const repairOverviewCards = createOverviewRepairMetricCards(
    repairRevenueOverview,
    repairUnitsOverview,
    selectedYYYYMMDD,
    storeLocationView,
  );

  const revenueUnitsSold = CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
    <React.Fragment key={idx}>
      <RepairRUS
        calendarChartsData={calendarChartsData}
        calendarView={calendarView}
        day={selectedDate}
        metricsView="Repairs"
        month={selectedYYYYMMDD.split("-")[1]}
        repairCategory={repairCategory}
        repairMetricsCards={cards}
        repairMetricsCharts={charts}
        repairOverviewCards={repairOverviewCards}
        storeLocation={storeLocationView}
        subMetric={subMetric}
        year={selectedYear}
      />
    </React.Fragment>
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
    <Stack>
      {loadingOverlay}
      <Group
        h={METRICS_HEADER_HEIGHT}
        opacity={0.97}
        py="sm"
        style={{
          position: "sticky",
          top: APP_HEADER_HEIGHT + DASHBOARD_HEADER_HEIGHT,
          zIndex: 3,
          backgroundColor,
        }}
      >
        {repairCategorySelectInput}
      </Group>
      {revenueUnitsSold}
    </Stack>
  );

  return repairMetrics;
}

export { RepairMetrics };
