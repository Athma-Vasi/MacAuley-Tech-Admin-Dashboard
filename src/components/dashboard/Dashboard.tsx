import {
  Accordion,
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  ACCORDION_BREAKPOINT,
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  FETCH_REQUEST_TIMEOUT,
  METRICS_URL,
} from "../../constants";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
import {
  getForageItemSafe,
  returnThemeColors,
  setForageItemSafe,
} from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { dashboardAction } from "./actions";
import {
  CALENDAR_VIEW_DATA,
  MONTHS,
  REPAIR_METRICS_DATA,
  STORE_LOCATION_VIEW_DATA,
} from "./constants";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "./customer/constants";
import { CustomerMetrics } from "./customer/CustomerMetrics";
import { FINANCIAL_METRICS_CATEGORY_DATA } from "./financial/constants";
import { FinancialMetrics } from "./financial/FinancialMetrics";
import { handleStoreCategoryClick } from "./handlers";
import {
  PRODUCT_METRIC_CATEGORY_DATA,
  PRODUCT_METRICS_SUB_CATEGORY_DATA,
} from "./product/constants";
import { ProductMetrics } from "./product/ProductMetrics";
import { ProductMetricCategory } from "./product/types";
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
  const { authState: { userDocument } } = useAuth();

  const { windowWidth } = useWindowSize();
  const navigateFn = useNavigate();

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
      storeLocationView,
      themeObject,
    },
    globalDispatch,
  } = useGlobalState();

  const { authState: { accessToken }, authDispatch } = useAuth();

  const { metricsView } = useParams();

  const { showBoundary } = useErrorBoundary();

  const { primaryColor } = themeObject;
  const { bgGradient, stickyHeaderBgGradient } = returnThemeColors(
    {
      colorsSwatches: COLORS_SWATCHES,
      themeObject,
    },
  );

  const {
    calendarView,
    isLoading,
    loadingMessage,
    selectedYYYYMMDD,
  } = dashboardState;

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAbortControllerRef?.current?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortControllerRef?.current?.abort("Component unmounted");
      isComponentMountedRef.current = false;
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
          action: globalAction.setSelectedYYYYMMDD,
          payload: value,
        });
      }}
      type="date"
      value={selectedYYYYMMDD}
    />
  );

  const isStoreLocationSegmentDisabled = (storeLocationView === "Vancouver" &&
    Number(selectedYear) < 2019) ||
    (storeLocationView === "Calgary" && Number(selectedYear) < 2017) ||
    (storeLocationView === "Edmonton" && Number(selectedYear) < 2013);

  const storeLocationSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: STORE_LOCATION_VIEW_DATA,
        disabled: isStoreLocationSegmentDisabled,
        name: "storeLocation",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) =>
          await handleStoreCategoryClick({
            accessToken,
            authDispatch,
            dashboardDispatch,
            fetchAbortControllerRef,
            getForageItemSafe,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            navigateFn,
            productMetricCategory,
            repairMetricCategory,
            setForageItemSafe,
            showBoundary,
            storeLocationView: event.currentTarget
              .value as AllStoreLocations,
          }),
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setStoreLocationView,
        value: storeLocationView,
      }}
    />
  );

  const repairMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_DATA,
        name: "repairs",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) =>
          await handleStoreCategoryClick({
            accessToken,
            authDispatch,
            dashboardDispatch,
            fetchAbortControllerRef,
            getForageItemSafe,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            navigateFn,
            productMetricCategory,
            repairMetricCategory: event.currentTarget
              .value as RepairMetricCategory,
            setForageItemSafe,
            showBoundary,
            storeLocationView,
          }),
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setRepairMetricCategory,
        value: repairMetricCategory,
      }}
    />
  );

  const productSubMetricCategorySelectInput = (
    <AccessibleSelectInput
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
    <AccessibleSelectInput
      attributes={{
        data: PRODUCT_METRIC_CATEGORY_DATA,
        name: "product metrics",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) =>
          await handleStoreCategoryClick({
            accessToken,
            authDispatch,
            dashboardDispatch,
            fetchAbortControllerRef,
            getForageItemSafe,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            navigateFn,
            productMetricCategory: event.currentTarget
              .value as ProductMetricCategory,
            repairMetricCategory,
            setForageItemSafe,
            showBoundary,
            storeLocationView,
          }),
        parentDispatch: globalDispatch,
        validValueAction: globalAction.setProductMetricCategory,
        value: productMetricCategory,
      }}
    />
  );

  const financialMetricCategorySelectInput = (
    <AccessibleSelectInput
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
    <AccessibleSelectInput
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
        value: dashboardState.calendarView,
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
        financialMetricsDocument={financialMetricsDocument as FinancialMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocationView={storeLocationView}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "customers"
    ? (
      <CustomerMetrics
        calendarView={calendarView}
        customerMetricsCategory={customerMetricsCategory}
        customerMetricsDocument={customerMetricsDocument as CustomerMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocationView={storeLocationView}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "products"
    ? (
      <ProductMetrics
        calendarView={calendarView}
        productMetricCategory={productMetricCategory}
        productMetricsDocument={productMetricsDocument as ProductMetricsDocument}
        productSubMetricCategory={productSubMetricCategory}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocationView={storeLocationView}
      />
    )
    : (
      <RepairMetrics
        calendarView={calendarView}
        repairMetricCategory={repairMetricCategory}
        repairMetricsDocument={repairMetricsDocument as RepairMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
        storeLocationView={storeLocationView}
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
