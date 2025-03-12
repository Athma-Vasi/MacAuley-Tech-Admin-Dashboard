import {
  Accordion,
  Group,
  LoadingOverlay,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import localforage from "localforage";
import React, { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { COLORS_SWATCHES, STORE_LOCATION_DATA } from "../../constants/data";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks";

import { returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { dashboardAction } from "./actions";
import {
  CALENDAR_VIEW_TABS_DATA,
  CUSTOMER_METRICS_DATA,
  DAYS_PER_MONTH,
  FINANCIALS_METRICS_DATA,
  METRICS_VIEW_TABS_DATA,
  MONTHS,
  PRODUCT_CATEGORIES,
  PRODUCT_METRICS_DATA,
  REPAIR_CATEGORIES,
  REPAIR_METRICS_DATA,
  STORE_LOCATION_VIEW_TABS_DATA,
} from "./constants";
import { CustomerMetrics } from "./customer/CustomerMetrics";
import { FinancialMetrics } from "./financial/FinancialMetrics";
import { ProductMetrics } from "./product/ProductMetrics";
import { dashboardReducer } from "./reducers";
import { RepairMetrics } from "./repair/RepairMetrics";
import { initialDashboardState } from "./state";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardCalendarView,
  DashboardMetricsView,
} from "./types";
import {
  createRandomBusinessMetrics,
  returnIsTabDisabled,
  splitSelectedCalendarDate,
} from "./utils";

function Dashboard() {
  const [dashboardState, dashboardDispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );

  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const {
    appThemeColors: { backgroundColor },
  } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    businessMetrics,
    calendarView,
    customerMetric,
    financialMetric,
    metricsView,
    productMetric,
    repairMetric,
    storeLocationView,
    selectedYYYYMMDD,
    isLoading,
    loadingMessage,
  } = dashboardState;

  const isComponentMountedRef = React.useRef(false);
  useEffect(() => {
    isComponentMountedRef.current = true;
    const isMounted = isComponentMountedRef.current;

    async function createBusinessMetrics() {
      try {
        if (businessMetrics?.length) {
          return;
        }

        dashboardDispatch({
          action: dashboardAction.setIsLoading,
          payload: true,
        });

        const existingMetrics = await localforage.getItem<BusinessMetric[]>(
          "businessMetrics",
        );
        if (existingMetrics && isMounted) {
          dashboardDispatch({
            action: dashboardAction.setBusinessMetrics,
            payload: existingMetrics,
          });

          dashboardDispatch({
            action: dashboardAction.setIsLoading,
            payload: false,
          });

          return;
        }

        console.time("createRandomBusinessMetrics");

        const createdBusinessMetrics = await createRandomBusinessMetrics({
          daysPerMonth: DAYS_PER_MONTH,
          months: MONTHS,
          productCategories: PRODUCT_CATEGORIES,
          repairCategories: REPAIR_CATEGORIES,
          storeLocations: STORE_LOCATION_DATA.map((obj) => obj.value),
        });

        console.timeEnd("createRandomBusinessMetrics");

        if (!isMounted) {
          return;
        }

        dashboardDispatch({
          action: dashboardAction.setBusinessMetrics,
          payload: createdBusinessMetrics,
        });

        localforage.setItem<BusinessMetric[]>(
          "businessMetrics",
          createdBusinessMetrics,
        );

        dashboardDispatch({
          action: dashboardAction.setIsLoading,
          payload: false,
        });
      } catch (error: any) {
        if (!isMounted) {
          return;
        }
        showBoundary(error);
      }
    }

    createBusinessMetrics();

    return () => {
      isComponentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayLoadingOverlay = (
    <LoadingOverlay
      visible={isLoading}
      zIndex={2}
      overlayBlur={9}
      overlayOpacity={0.99}
      radius={4}
      transitionDuration={500}
    />
  );

  if (!businessMetrics?.length) {
    return displayLoadingOverlay;
  }

  const { selectedDate, selectedMonth, selectedYear } =
    splitSelectedCalendarDate({
      calendarDate: selectedYYYYMMDD,
      months: MONTHS,
    });

  const isTabDisabled = returnIsTabDisabled(storeLocationView, selectedYear);

  const createdMetricsTabs = (
    <Tabs
      value={metricsView}
      onTabChange={(value) => {
        dashboardDispatch({
          action: dashboardAction.setMetricsView,
          payload: value as DashboardMetricsView,
        });
      }}
    >
      <Tabs.List>
        {METRICS_VIEW_TABS_DATA.map((metricsView, idx) => (
          <Tabs.Tab
            key={`${idx}-${metricsView}`}
            value={metricsView}
            disabled={isTabDisabled}
          >
            {metricsView}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );

  const createdCalendarTabs = (
    <Tabs
      value={calendarView}
      onTabChange={(value) => {
        dashboardDispatch({
          action: dashboardAction.setCalendarView,
          payload: value as DashboardCalendarView,
        });
      }}
    >
      <Tabs.List>
        {CALENDAR_VIEW_TABS_DATA.map((calendarView, idx) => (
          <Tabs.Tab
            key={`${idx}-${calendarView}`}
            value={calendarView}
            disabled={isTabDisabled}
          >
            {calendarView}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );

  const createdYYYYMMDDInput = (
    <TextInput
      aria-label='Please enter date in format "date-date-month-month-year-year-year-year"'
      description="View metrics for selected calendar date."
      label="Calendar Date"
      max={new Date().toISOString().split("T")[0]}
      min={storeLocationView === "Vancouver"
        ? new Date(2019, 0, 1).toISOString().split("T")[0]
        : storeLocationView === "Calgary"
        ? new Date(2017, 0, 1).toISOString().split("T")[0]
        : new Date(2013, 0, 1).toISOString().split("T")[0]}
      onChange={(event) => {
        const { value } = event.currentTarget;
        dashboardDispatch({
          action: dashboardAction.setSelectedYYYYMMDD,
          payload: value,
        });

        globalDispatch({
          action: globalAction.setCustomizeChartsPageDataSelectedYYYYMMDD,
          payload: value,
        });
      }}
      type="date"
      value={selectedYYYYMMDD}
    />
  );
  const displayYYYYMMDDInput = <Group w={330}>{createdYYYYMMDDInput}</Group>;

  const financialMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: FINANCIALS_METRICS_DATA,
        name: "category",
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setFinancialMetric,
        value: financialMetric,
      }}
    />
  );

  const filteredCustomerMetricsSelectInputData = CUSTOMER_METRICS_DATA.filter(
    (data) => calendarView === "Daily" ? data.value !== "Other Metrics" : true,
  );

  const customerMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: filteredCustomerMetricsSelectInputData,
        name: "category",
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setCustomerMetric,
        value: customerMetric,
      }}
    />
  );

  const productMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRICS_DATA,
        name: "category",
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setProductMetric,
        value: productMetric,
      }}
    />
  );

  const repairMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_DATA,
        name: "category",
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setRepairMetric,
        value: repairMetric,
      }}
    />
  );

  const metricCategorySelectInput = metricsView === "Financials"
    ? financialMetricCategorySelectInput
    : metricsView === "Customers"
    ? customerMetricCategorySelectInput
    : metricsView === "Products"
    ? productMetricCategorySelectInput
    : repairMetricCategorySelectInput;

  const createdStoreLocationTabs = (
    <Accordion
      w="100%"
      bg={backgroundColor}
      style={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        position: "sticky",
        top: 0,
        zIndex: 4,
      }}
    >
      <Accordion.Item value="Refine Metrics View">
        <Accordion.Control>
          <Title order={5}>Refine Metrics View</Title>
        </Accordion.Control>

        <Accordion.Panel>
          <Group position="apart">
            <Stack w={500}>
              <Tabs
                value={storeLocationView}
                onTabChange={(value) => {
                  dashboardDispatch({
                    action: dashboardAction.setStoreLocationView,
                    payload: value as BusinessMetricStoreLocation,
                  });
                }}
              >
                <Tabs.List>
                  {STORE_LOCATION_VIEW_TABS_DATA.map(
                    (storeLocationView, idx) => {
                      const isStoreLocationTabDisabled =
                        (storeLocationView === "Vancouver" &&
                          Number(selectedYear) < 2019) ||
                        (storeLocationView === "Calgary" &&
                          Number(selectedYear) < 2017) ||
                        (storeLocationView === "Edmonton" &&
                          Number(selectedYear) < 2013);

                      return (
                        <Tabs.Tab
                          key={`${idx}-${storeLocationView}`}
                          value={storeLocationView}
                          disabled={isStoreLocationTabDisabled}
                        >
                          {storeLocationView}
                        </Tabs.Tab>
                      );
                    },
                  )}
                </Tabs.List>
              </Tabs>

              {createdMetricsTabs}

              {createdCalendarTabs}
            </Stack>
            <Group w={400} align="flex-end">
              {metricCategorySelectInput}
              {displayYYYYMMDDInput}
            </Group>
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );

  const displayMetricsView = metricsView === "Financials"
    ? (
      <FinancialMetrics
        businessMetrics={businessMetrics}
        calendarView={calendarView}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocationView={storeLocationView}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "Customers"
    ? (
      <CustomerMetrics
        businessMetrics={businessMetrics}
        calendarView={calendarView}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocationView={storeLocationView}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "Products"
    ? (
      <ProductMetrics
        businessMetrics={businessMetrics}
        calendarView={calendarView}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocationView={storeLocationView}
      />
    )
    : (
      <RepairMetrics
        businessMetrics={businessMetrics}
        calendarView={calendarView}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocationView={storeLocationView}
      />
    );

  const dashboard = (
    <Stack w="100%">
      <Title order={2}>Dashboard</Title>
      <Text size="sm">Welcome to your dashboard</Text>
      {displayLoadingOverlay}
      {createdStoreLocationTabs}
      {displayMetricsView}
    </Stack>
  );

  return dashboard;
}

export default Dashboard;
