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
  MOBILE_BREAKPOINT,
} from "../../constants";
import { globalAction } from "../../context/globalProvider/actions";
import { useGlobalState } from "../../hooks/useGlobalState";

import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  BusinessMetricsDocument,
  FinancialMetricsDocument,
  HttpServerResponse,
} from "../../types";
import { fetchSafe, responseToJSONSafe, returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { dashboardAction } from "./actions";
import { MONTHS, STORE_LOCATION_VIEW_DATA } from "./constants";
import { FinancialMetrics } from "./financial/FinancialMetrics";
import { dashboardReducer } from "./reducers";
import { initialDashboardState } from "./state";
import {
  excludeTodayFromCalendarView,
  splitSelectedCalendarDate,
} from "./utils";

function Dashboard() {
  const [dashboardState, dashboardDispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );

  const { windowWidth } = useWindowSize();

  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();

  const { authState: { accessToken } } = useAuth();

  const { metricsView } = useParams();

  const { showBoundary } = useErrorBoundary();

  const { primaryColor } = themeObject;
  const { backgroundColor } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const {
    businessMetrics,
    storeLocationView,
    selectedYYYYMMDD,
    isLoading,
    loadingMessage,
  } = dashboardState;

  // const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    // fetchAbortControllerRef.current?.abort("Previous request cancelled");
    // fetchAbortControllerRef.current = new AbortController();
    // const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    async function fetchMetrics() {
      const url =
        `http://localhost:5000/api/v1/metrics/${metricsView}/?&storeLocation[$eq]=${storeLocationView}`;

      const requestInit: RequestInit = {
        method: "GET",
        // signal: fetchAbortController.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const responseResult = await fetchSafe(url, requestInit);
        if (!isComponentMounted) {
          return;
        }

        if (responseResult.err) {
          showBoundary(responseResult.val.data);
          return;
        }

        const responseUnwrapped = responseResult.safeUnwrap().data;

        if (responseUnwrapped === undefined) {
          showBoundary(new Error("No data returned from server"));
          return;
        }

        const jsonResult = await responseToJSONSafe<
          HttpServerResponse<BusinessMetricsDocument>
        >(
          responseUnwrapped,
        );

        if (!isComponentMounted) {
          return;
        }

        if (jsonResult.err) {
          showBoundary(jsonResult.val.data);
          return;
        }

        const serverResponse = jsonResult.safeUnwrap().data;

        if (serverResponse === undefined) {
          showBoundary(new Error("No data returned from server"));
          return;
        }

        dashboardDispatch({
          action: dashboardAction.setBusinessMetrics,
          payload: serverResponse.data[0],
        });

        console.group("fetchMetrics");
        console.log("serverResponse", serverResponse);
        console.groupEnd();
      } catch (error: unknown) {
        // if (
        //   !isComponentMounted || fetchAbortController?.signal.aborted
        // ) {
        //   return;
        // }
        showBoundary(error);
      }
    }

    fetchMetrics();

    // const timerId = setTimeout(() => {
    //   fetchAbortController?.abort("Request timed out");
    // }, FETCH_REQUEST_TIMEOUT);

    return () => {
      // clearTimeout(timerId);
      // fetchAbortController?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, []);

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

  if (businessMetrics === null || businessMetrics === undefined) {
    return displayLoadingOverlay;
  }

  console.group("Dashboard");
  console.log("businessMetrics", businessMetrics);
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
      max={excludeTodayFromCalendarView()}
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
        parentDispatch: dashboardDispatch,
        validValueAction: dashboardAction.setStoreLocationView,
        value: storeLocationView,
      }}
    />
  );

  const dashboardHeader = (
    <Group
      align="flex-end"
      h={DASHBOARD_HEADER_HEIGHT}
      py="sm"
      position="left"
      style={{
        backgroundColor,
        position: "sticky",
        top: 0,
        zIndex: 3,
      }}
      spacing="xl"
      opacity={0.97}
    >
      {storeLocationSelectInput}
      {createdYYYYMMDDInput}
    </Group>
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
        financialMetricsDocument={businessMetrics as FinancialMetricsDocument}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        storeLocationView={storeLocationView}
        selectedYYYYMMDD={selectedYYYYMMDD}
        selectedYear={selectedYear}
      />
    )
    : metricsView === "customers"
    ? (
      null
      // <CustomerMetrics
      //   businessMetrics={businessMetrics}
      //   selectedDate={selectedDate}
      //   selectedMonth={selectedMonth}
      //   storeLocationView={storeLocationView}
      //   selectedYYYYMMDD={selectedYYYYMMDD}
      //   selectedYear={selectedYear}
      // />
    )
    : metricsView === "products"
    ? (
      null
      // <ProductMetrics
      //   businessMetrics={businessMetrics}
      //   selectedDate={selectedDate}
      //   selectedMonth={selectedMonth}
      //   selectedYYYYMMDD={selectedYYYYMMDD}
      //   selectedYear={selectedYear}
      //   storeLocationView={storeLocationView}
      // />
    )
    : (
      null
      // <RepairMetrics
      //   businessMetrics={businessMetrics}
      //   selectedDate={selectedDate}
      //   selectedMonth={selectedMonth}
      //   selectedYYYYMMDD={selectedYYYYMMDD}
      //   selectedYear={selectedYear}
      //   storeLocationView={storeLocationView}
      // />
    );

  const dashboard = (
    <Stack w="100%" py="sm">
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
