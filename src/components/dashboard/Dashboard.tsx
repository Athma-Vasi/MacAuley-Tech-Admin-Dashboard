import {
  Accordion,
  Box,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  ACCORDION_BREAKPOINT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  METRICS_URL,
} from "../../constants";
import {
  GlobalAction,
  globalAction,
} from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";

import React from "react";
import { useParams } from "react-router-dom";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
import { makeTransition, returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { dashboardAction } from "./actions";
import { MessageEventDashboardCacheWorkerToMain } from "./cacheWorker";
import DashboardCacheWorker from "./cacheWorker?worker";
import {
  CALENDAR_VIEW_DATA,
  MONTHS,
  REPAIR_METRICS_DATA,
  STORE_LOCATION_VIEW_DATA,
} from "./constants";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "./customer/constants";
import { CustomerMetrics } from "./customer/CustomerMetrics";
import { CustomerMetricsCategory } from "./customer/types";
import { FINANCIAL_METRICS_CATEGORY_DATA } from "./financial/constants";
import { FinancialMetrics } from "./financial/FinancialMetrics";
import { FinancialMetricCategory } from "./financial/types";
import {
  handleMessageEventDashboardCacheWorkerToMain,
  handleStoreAndCategoryClicks,
} from "./handlers";
import {
  PRODUCT_METRIC_CATEGORY_DATA,
  PRODUCT_METRICS_SUB_CATEGORY_DATA,
} from "./product/constants";
import { ProductMetrics } from "./product/ProductMetrics";
import { ProductMetricCategory, ProductSubMetric } from "./product/types";
import { dashboardReducer } from "./reducers";
import { RepairMetrics } from "./repair/RepairMetrics";
import { RepairMetricCategory } from "./repair/types";
import { initialDashboardState } from "./state";
import { AllStoreLocations, DashboardMetricsView } from "./types";
import { splitSelectedCalendarDate } from "./utils";

function Dashboard() {
  const [dashboardState, dashboardDispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );
  const { windowWidth } = useWindowSize();
  const { authState: { userDocument } } = useAuth();
  const { metricsView } = useParams();
  const { showBoundary } = useErrorBoundary();
  const {
    globalState: {
      customerMetricsCategory,
      customerMetricsDocument,
      financialMetricCategory,
      financialMetricsDocument,
      isFetching,
      productMetricCategory,
      productMetricsDocument,
      productSubMetricCategory,
      repairMetricCategory,
      repairMetricsDocument,
      storeLocation,
      themeObject,
      selectedYYYYMMDD,
    },
    globalDispatch,
  } = useGlobalState();
  const deferredCustomerMetricsDocument = React.useDeferredValue(
    customerMetricsDocument,
  );
  const deferredFinancialMetricsDocument = React.useDeferredValue(
    financialMetricsDocument,
  );
  const deferredProductMetricsDocument = React.useDeferredValue(
    productMetricsDocument,
  );
  const deferredRepairMetricsDocument = React.useDeferredValue(
    repairMetricsDocument,
  );

  const { bgGradient, stickyHeaderBgGradient } = returnThemeColors(
    {
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    },
  );

  const {
    calendarView,
    currentSelectedInput,
    dashboardCacheWorker,
    isLoading,
    loadingMessage,
  } = dashboardState;

  const isComponentMountedRef = useMountedRef();

  useEffect(() => {
    const newDashboardCacheWorker = new DashboardCacheWorker();

    dashboardDispatch({
      action: dashboardAction.setDashboardCacheWorker,
      payload: newDashboardCacheWorker,
    });

    newDashboardCacheWorker.onmessage = async (
      event: MessageEventDashboardCacheWorkerToMain,
    ) => {
      await handleMessageEventDashboardCacheWorkerToMain({
        dashboardDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
      });
    };

    return () => {
      isComponentMountedRef.current = false;
      newDashboardCacheWorker.terminate();
    };
  }, []);

  const { selectedDate, selectedMonth, selectedYear } =
    splitSelectedCalendarDate({
      calendarDate: selectedYYYYMMDD,
      months: MONTHS,
    });

  const createdYYYYMMDDInput = (
    <TextInput
      aria-label='Please enter date in format "date-date-month-month-year-year-year-year"'
      className="accessible-input"
      aria-description="View metrics for selected calendar date."
      label="Calendar Date"
      max={"2025-03-31"}
      min={storeLocation === "Vancouver"
        ? new Date(2019, 0, 1).toISOString().split("T")[0]
        : storeLocation === "Calgary"
        ? new Date(2017, 0, 1).toISOString().split("T")[0]
        : new Date(2013, 0, 1).toISOString().split("T")[0]}
      onChange={(event) => {
        const { value } = event.currentTarget;

        makeTransition(() => {
          globalDispatch({
            action: globalAction.setSelectedYYYYMMDD,
            payload: value,
          });
        });
      }}
      type="date"
      value={selectedYYYYMMDD}
    />
  );

  const isStoreLocationSegmentDisabled = (storeLocation === "Vancouver" &&
    Number(selectedYear) < 2019) ||
    (storeLocation === "Calgary" && Number(selectedYear) < 2017) ||
    (storeLocation === "Edmonton" && Number(selectedYear) < 2013);

  const storeLocationSelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setStoreLocation"],
      AllStoreLocations
    >
      attributes={{
        data: STORE_LOCATION_VIEW_DATA,
        disabled: isStoreLocationSegmentDisabled,
        label: (
          <Group spacing="xs">
            <Text>Store Location</Text>
            {currentSelectedInput === "storeLocation" && isLoading
              ? <Loader size="xs" />
              : null}
          </Group>
        ),
        name: "storeLocation",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          if (isLoading || isFetching) {
            return;
          }
          dashboardDispatch({
            action: dashboardAction.setCurrentSelectedInput,
            payload: "storeLocation",
          });

          await handleStoreAndCategoryClicks({
            dashboardDispatch,
            dashboardCacheWorker,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocation: event.currentTarget
              .value as AllStoreLocations,
          });
        },
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setStoreLocation,
        value: storeLocation,
      }}
    />
  );

  const repairMetricCategorySelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setRepairMetricCategory"],
      RepairMetricCategory
    >
      attributes={{
        data: REPAIR_METRICS_DATA,
        label: (
          <Group spacing="xs">
            <Text>Repair Metrics</Text>
            {currentSelectedInput === "repairs" && isLoading
              ? <Loader size="xs" />
              : null}
          </Group>
        ),
        name: "repairs",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          if (isLoading || isFetching) {
            return;
          }
          dashboardDispatch({
            action: dashboardAction.setCurrentSelectedInput,
            payload: "repairs",
          });

          await handleStoreAndCategoryClicks({
            dashboardDispatch,
            dashboardCacheWorker,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            productMetricCategory,
            repairMetricCategory: event.currentTarget
              .value as RepairMetricCategory,
            showBoundary,
            storeLocation,
          });
        },
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setRepairMetricCategory,
        value: repairMetricCategory,
      }}
    />
  );

  const productSubMetricCategorySelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setProductSubMetricCategory"],
      ProductSubMetric
    >
      attributes={{
        data: PRODUCT_METRICS_SUB_CATEGORY_DATA,
        name: "product sub-metrics",
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setProductSubMetricCategory,
        value: productSubMetricCategory,
      }}
    />
  );

  const productMetricCategorySelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setProductMetricCategory"],
      ProductMetricCategory
    >
      attributes={{
        data: PRODUCT_METRIC_CATEGORY_DATA,
        label: (
          <Group spacing="xs">
            <Text>Product Metrics</Text>
            {currentSelectedInput === "product metrics" && isLoading
              ? <Loader size="xs" />
              : null}
          </Group>
        ),
        name: "product metrics",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          if (isLoading || isFetching) {
            return;
          }
          dashboardDispatch({
            action: dashboardAction.setCurrentSelectedInput,
            payload: "product metrics",
          });

          await handleStoreAndCategoryClicks({
            dashboardDispatch,
            dashboardCacheWorker,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            productMetricCategory: event.currentTarget
              .value as ProductMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocation,
          });
        },
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setProductMetricCategory,
        value: productMetricCategory,
      }}
    />
  );

  const financialMetricCategorySelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setFinancialMetricCategory"],
      FinancialMetricCategory
    >
      attributes={{
        data: FINANCIAL_METRICS_CATEGORY_DATA,
        name: "financial metrics",
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setFinancialMetricCategory,
        value: financialMetricCategory,
      }}
    />
  );

  const customerMetricCategorySelectInput = (
    <AccessibleSelectInput<
      GlobalAction["setCustomerMetricsCategory"],
      CustomerMetricsCategory
    >
      attributes={{
        data: CUSTOMER_METRICS_CATEGORY_DATA,
        name: "customer metrics",
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setCustomerMetricsCategory,
        value: customerMetricsCategory,
      }}
    />
  );

  const calendarViewSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: CALENDAR_VIEW_DATA,
        name: "calendar view",
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setCalendarView,
        value: calendarView,
      }}
    />
  );

  const headerInputs = (
    <>
      {storeLocationSelectInput}
      {createdYYYYMMDDInput}
      {metricsView === "products"
        ? (
          <>
            {productMetricCategorySelectInput}
            {productSubMetricCategorySelectInput}
          </>
        )
        : null}
      {metricsView === "customers" ? customerMetricCategorySelectInput : null}
      {metricsView === "financials" ? financialMetricCategorySelectInput : null}
      {metricsView === "repairs" ? repairMetricCategorySelectInput : null}
      {calendarViewSelectInput}
    </>
  );

  const dashboardHeader = (
    <Stack
      align="flex-end"
      p="md"
      style={{
        background: stickyHeaderBgGradient,
        position: "sticky",
        top: 0,
        zIndex: 3,
        borderRadius: "0px 0px 0.5em 0.5em",
      }}
      spacing="xl"
      opacity={0.97}
    >
      <Group w="100%" position="left" align="flex-end" spacing="xl">
        {headerInputs}
      </Group>
    </Stack>
  );

  const dashboardHeaderAccordion = (
    <Group
      h={DASHBOARD_HEADER_HEIGHT_MOBILE}
      py="sm"
      style={{
        background: stickyHeaderBgGradient,
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
      opacity={0.97}
      w="100%"
    >
      <Accordion w="100%">
        <Accordion.Item value="Parameters">
          <Accordion.Control>
            <Text weight={500} size="md">Parameters</Text>
          </Accordion.Control>
          <Accordion.Panel bg={bgGradient}>
            <Group w="100%" position="left" align="flex-end" spacing="xl">
              {headerInputs}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Group>
  );

  const displayMetricsView = metricsView === "financials"
    ? (
      <FinancialMetrics
        calendarView={calendarView}
        financialMetricCategory={financialMetricCategory}
        financialMetricsDocument={deferredFinancialMetricsDocument as FinancialMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocation={storeLocation}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "customers"
    ? (
      <CustomerMetrics
        calendarView={calendarView}
        customerMetricsCategory={customerMetricsCategory}
        customerMetricsDocument={deferredCustomerMetricsDocument as CustomerMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocation={storeLocation}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "products"
    ? (
      <ProductMetrics
        calendarView={calendarView}
        productMetricCategory={productMetricCategory}
        productMetricsDocument={deferredProductMetricsDocument as ProductMetricsDocument}
        productSubMetricCategory={productSubMetricCategory}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocation={storeLocation}
      />
    )
    : (
      <RepairMetrics
        calendarView={calendarView}
        repairMetricCategory={repairMetricCategory}
        repairMetricsDocument={deferredRepairMetricsDocument as RepairMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocation={storeLocation}
      />
    );

  const dashboard = (
    <Box bg={bgGradient}>
      {windowWidth > ACCORDION_BREAKPOINT
        ? dashboardHeader
        : dashboardHeaderAccordion}

      <Stack align="flex-start" p="md">
        <Title order={2} size={32}>DASHBOARD</Title>
        <Text size="md">
          Welcome to your dashboard{`, ${userDocument?.firstName ?? ""}`}
        </Text>
      </Stack>
      {displayMetricsView}
    </Box>
  );

  return dashboard;
}

export default Dashboard;
