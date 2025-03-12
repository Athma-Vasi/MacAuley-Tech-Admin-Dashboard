import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import { COLORS_SWATCHES } from "../../../constants/data";
import { useGlobalState } from "../../../hooks";
import { logState, returnThemeColors } from "../../../utils";
import { AccessibleSegmentedControl } from "../../accessibleInputs/AccessibleSegmentedControl";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { MONTHS } from "../constants";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  Month,
  Year,
} from "../types";
import { RepairRUS } from "./RepairRUS";
import { repairMetricsAction } from "./actions";
import { returnRepairMetricsCards } from "./cards";
import {
  createRepairMetricsCharts,
  returnSelectedDateRepairMetrics,
} from "./chartsData";
import {
  REPAIR_METRICS_DATA,
  REPAIR_METRICS_SUB_CATEGORY_DATA,
} from "./constants";
import { repairMetricsReducer } from "./reducers";
import { initialRepairMetricsState } from "./state";

type RepairMetricsProps = {
  businessMetrics: BusinessMetric[];
  calendarView: DashboardCalendarView;
  selectedDate: string;
  selectedMonth: Month;
  storeLocationView: BusinessMetricStoreLocation;
  selectedYear: Year;
  selectedYYYYMMDD: string;
};

function RepairMetrics({
  businessMetrics,
  calendarView,
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
  const { cards, charts, isGenerating, repairCategory, subMetric } =
    repairMetricsState;

  const {
    globalState: { themeObject, width },
  } = useGlobalState();

  const { showBoundary } = useErrorBoundary();

  const {
    generalColors: { redColorShade, greenColorShade },
    appThemeColors: { borderColor },
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

        const repairMetricsCharts = await createRepairMetricsCharts({
          businessMetrics,
          months: MONTHS,
          selectedRepairCategory: repairCategory,
          selectedDateRepairMetrics,
          storeLocation: storeLocationView,
        });

        const repairMetricsCards = await returnRepairMetricsCards({
          greenColorShade,
          redColorShade,
          selectedDateRepairMetrics,
          width,
        });

        if (!isMounted) {
          return;
        }

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

  logState({
    state: repairMetricsState,
    groupLabel: "RepairMetrics",
  });

  const subMetricSegmentedControl = (
    <AccessibleSegmentedControl
      attributes={{
        data: REPAIR_METRICS_SUB_CATEGORY_DATA as any,
        name: "category",
        parentDispatch: repairMetricsDispatch,
        validValueAction: repairMetricsAction.setSubMetric,
        value: subMetric,
      }}
    />
  );

  const repairCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_DATA,
        name: "category",
        parentDispatch: repairMetricsDispatch,
        validValueAction: repairMetricsAction.setRepairCategory,
        value: repairCategory,
      }}
    />
  );

  const revenueUnitsSold = (
    <RepairRUS
      borderColor={borderColor}
      calendarView={calendarView}
      chartHeight={382}
      chartWidth={612}
      repairMetricsCards={cards}
      repairMetricsCharts={charts}
      day={selectedDate}
      month={selectedYYYYMMDD.split("-")[1]}
      subMetric={subMetric}
      metricsView="Repairs"
      storeLocation={storeLocationView}
      width={width}
      year={selectedYear}
    />
  );

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
      {subMetricSegmentedControl}
      {repairCategorySelectInput}
      {revenueUnitsSold}
    </Stack>
  );

  logState({
    state: repairMetricsState,
    groupLabel: "RepairMetrics",
  });

  return repairMetrics;
}

export { RepairMetrics };
