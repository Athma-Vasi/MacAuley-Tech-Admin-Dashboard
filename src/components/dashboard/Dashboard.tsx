import {
  Accordion,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";

import {
  COLORS_SWATCHES,
  DASHBOARD_HEADER_HEIGHT,
  DASHBOARD_HEADER_HEIGHT_MOBILE,
  FETCH_REQUEST_TIMEOUT,
  METRICS_URL,
  MOBILE_BREAKPOINT,
} from "../../constants";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";

import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  CustomerMetricsDocument,
  FinancialMetricsDocument,
  ProductMetricsDocument,
  RepairMetricsDocument,
} from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { dashboardAction } from "./actions";
import {
  MONTHS,
  REPAIR_METRICS_DATA,
  STORE_LOCATION_VIEW_DATA,
} from "./constants";
import { CUSTOMER_METRICS_CATEGORY_DATA } from "./customer/constants";
import { CustomerMetrics } from "./customer/CustomerMetrics";
import { FINANCIAL_METRICS_CATEGORY_DATA } from "./financial/constants";
import { FinancialMetrics } from "./financial/FinancialMetrics";
import {
  PRODUCT_METRIC_CATEGORY_DATA,
  PRODUCT_METRICS_SUB_CATEGORY_DATA,
} from "./product/constants";
import { ProductMetrics } from "./product/ProductMetrics";
import { dashboardReducer } from "./reducers";
import { RepairMetrics } from "./repair/RepairMetrics";
import { initialDashboardState } from "./state";
import { DashboardMetricsView } from "./types";
import {
  handleMetricCategorySelectInputClick,
  splitSelectedCalendarDate,
} from "./utils";

function Dashboard() {
  const [dashboardState, dashboardDispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );

  const { windowWidth } = useWindowSize();

  const {
    globalState: {
      customerMetricsCategory,
      financialMetricCategory,
      productMetricCategory,
      productSubMetricCategory,
      repairMetricCategory,
      customerMetricsDocument,
      financialMetricsDocument,
      productMetricsDocument,
      repairMetricsDocument,
      themeObject,
    },
    globalDispatch,
  } = useGlobalState();

  const { authState: { accessToken }, authDispatch } = useAuth();

  const { metricsView } = useParams();

  const { showBoundary } = useErrorBoundary();

  const { primaryColor } = themeObject;
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    isLoading,
    loadingMessage,
    selectedYYYYMMDD,
    storeLocationView,
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

  // if (
  //   (metricsView === "financials" && financialMetricsDocument === null) ||
  //   (metricsView === "products" && productMetricsDocument === null) ||
  //   (metricsView === "customers" && customerMetricsDocument === null) ||
  //   (metricsView === "repairs" && repairMetricsDocument === null)
  // ) {
  //   return displayLoadingOverlay;
  // }

  console.group("Dashboard");
  console.log("storeLocationView", storeLocationView);
  console.log("metricsView", metricsView);
  console.log("productMetricCategory", productMetricCategory);
  console.log("productSubMetricCategory", productSubMetricCategory);
  console.log("repairMetricCategory", repairMetricCategory);
  console.log("financialMetricCategory", financialMetricCategory);
  console.log("customerMetricsCategory", customerMetricsCategory);
  console.log("selectedYYYYMMDD", selectedYYYYMMDD);
  console.log("financialMetricsDocument", financialMetricsDocument);
  console.log("productMetricsDocument", productMetricsDocument);
  console.log("customerMetricsDocument", customerMetricsDocument);
  console.log("repairMetricsDocument", repairMetricsDocument);
  console.groupEnd();

  const { selectedDate, selectedMonth, selectedYear } =
    splitSelectedCalendarDate({
      calendarDate: selectedYYYYMMDD,
      months: MONTHS,
    });

  const createdYYYYMMDDInput = (
    <TextInput
      aria-label='Please enter date in format "date-date-month-month-year-year-year-year"'
      description="View metrics for selected calendar date."
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
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
          event.preventDefault();
          const metricCategory = metricsView === "products"
            ? productMetricCategory
            : metricsView === "customers"
            ? customerMetricsCategory
            : metricsView === "financials"
            ? financialMetricCategory
            : repairMetricCategory;

          const url = new URL(
            `${METRICS_URL}/${metricsView}/?&storeLocation[$eq]=${event.currentTarget.value}&productMetricCategory[$eq]=${metricCategory}&year[$eq]=${
              selectedYYYYMMDD.split("-")[0]
            }${
              productSubMetricCategory
                ? `&productSubMetricCategory[$eq]=${productSubMetricCategory}`
                : ""
            }`,
          );

          handleMetricCategorySelectInputClick({
            accessToken,
            authDispatch,
            dashboardDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricCategory,
            metricsView: metricsView as Lowercase<DashboardMetricsView>,
            showBoundary,
            storeLocationView,
            url,
          });
        },
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setStoreLocationView,
        value: storeLocationView,
      }}
    />
  );

  const repairMetricCategorySelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: REPAIR_METRICS_DATA,
        name: "repairs",
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

  const dashboardHeader = (
    <Stack
      align="flex-end"
      h={DASHBOARD_HEADER_HEIGHT}
      p="md"
      style={{
        backgroundColor,
        position: "sticky",
        top: 0,
        zIndex: 3,
      }}
      spacing="xl"
      opacity={0.97}
    >
      <Group w="100%" position="left" align="flex-end" spacing="xl">
        {storeLocationSelectInput}
        {createdYYYYMMDDInput}
      </Group>

      <Group w="100%" position="left" align="flex-end" spacing="xl">
        {metricsView === "products"
          ? [
            productMetricCategorySelectInput,
            productSubMetricCategorySelectInput,
          ]
          : null}
        {metricsView === "customers" ? customerMetricCategorySelectInput : null}
        {metricsView === "financials"
          ? financialMetricCategorySelectInput
          : null}
        {metricsView === "repairs" ? repairMetricCategorySelectInput : null}
      </Group>
    </Stack>
  );

  const dashboardHeaderAccordion = (
    <Group
      h={DASHBOARD_HEADER_HEIGHT_MOBILE}
      py="sm"
      style={{
        backgroundColor: backgroundColor,
        position: "sticky",
        top: 0,
        zIndex: 4,
      }}
      opacity={0.97}
      w="100%"
    >
      <Accordion bg={backgroundColor} w="100%">
        <Accordion.Item value="Location and Date">
          <Accordion.Control>
            <Text weight={500} size="md">Location and Date</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group w="100%" position="left" align="flex-end" spacing="xl">
              {storeLocationSelectInput}
              {createdYYYYMMDDInput}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Group>
  );

  const displayMetricsView = metricsView === "financials"
    ? (
      <FinancialMetrics
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
    <Stack w="100%" py="sm" pos="relative">
      {displayLoadingOverlay}
      <Stack align="flex-start" spacing={2} bg={backgroundColor} px="md">
        <Title order={1}>DASHBOARD</Title>
        <Text size="sm">Welcome to your dashboard</Text>
      </Stack>
      {windowWidth < MOBILE_BREAKPOINT
        ? dashboardHeaderAccordion
        : dashboardHeader}
      {displayMetricsView}
    </Stack>
  );

  return dashboard;
}

export default Dashboard;

// const isComponentMountedRef = React.useRef(false);
// useEffect(() => {
//   isComponentMountedRef.current = true;
//   const isMounted = isComponentMountedRef.current;

//   async function createBusinessMetrics() {
//     try {
//       if (businessMetrics?.length) {
//         return;
//       }

//       dashboardDispatch({
//         action: dashboardAction.setIsLoading,
//         payload: true,
//       });

//       const existingMetrics = await localforage.getItem<BusinessMetric[]>(
//         "businessMetrics",
//       );
//       if (existingMetrics && isMounted) {
//         dashboardDispatch({
//           action: dashboardAction.setBusinessMetrics,
//           payload: existingMetrics,
//         });

//         dashboardDispatch({
//           action: dashboardAction.setIsLoading,
//           payload: false,
//         });

//         return;
//       }

//       console.time("createRandomBusinessMetrics");

//       const createdBusinessMetrics = await createRandomBusinessMetrics({
//         daysPerMonth: DAYS_PER_MONTH,
//         months: MONTHS,
//         productCategories: PRODUCT_CATEGORIES,
//         repairCategories: REPAIR_CATEGORIES,
//         storeLocations: STORE_LOCATION_DATA.map((obj) => obj.value),
//       });

//       console.timeEnd("createRandomBusinessMetrics");

//       if (!isMounted) {
//         return;
//       }

//       dashboardDispatch({
//         action: dashboardAction.setBusinessMetrics,
//         payload: createdBusinessMetrics,
//       });

//       localforage.setItem<BusinessMetric[]>(
//         "businessMetrics",
//         createdBusinessMetrics,
//       );

//       dashboardDispatch({
//         action: dashboardAction.setIsLoading,
//         payload: false,
//       });
//     } catch (error: any) {
//       if (!isMounted) {
//         return;
//       }
//       showBoundary(error);
//     }
//   }

//   createBusinessMetrics();

//   return () => {
//     isComponentMountedRef.current = false;
//   };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);
