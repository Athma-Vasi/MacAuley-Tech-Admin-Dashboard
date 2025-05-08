import { Group, Loader, Space, Stack, Text } from "@mantine/core";
import localforage from "localforage";
import React, { useEffect, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
  TbAffiliate,
  TbFileDatabase,
  TbReportMoney,
  TbTestPipe,
  TbTools,
  TbUser,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  COLORS_SWATCHES,
  LOGOUT_URL,
  METRICS_URL,
} from "../../constants";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";
import { sidebarAction } from "./actions";
import {
  handleDirectoryNavClick,
  handleDirectoryOnmessageCallback,
  handleLogoutButtonClick,
  handleMetricCategoryNavClick,
  handleMetricCategoryOnmessageCallback,
} from "./handlers";
import { sidebarReducer } from "./reducers";
import { initialSidebarState } from "./state";
import { DirectoryMessageEvent, MetricsMessageEvent } from "./types";

type SidebarProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ opened, setOpened }: SidebarProps) {
  const { authState: { accessToken }, authDispatch } = useAuth();
  const {
    globalState,
    globalDispatch,
  } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [sidebarState, sidebarDispatch] = React.useReducer(
    sidebarReducer,
    initialSidebarState,
  );
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useMountedRef();

  console.log("globalState in sidebar:", globalState);

  const {
    themeObject,
    productMetricCategory,
    repairMetricCategory,
    storeLocationView,
    isFetching,
  } = globalState;
  const { directoryFetchWorker, metricsFetchWorker, metricsView } =
    sidebarState;

  useEffect(() => {
    const newMetricsFetchWorker = new FetchParseWorker();
    sidebarDispatch({
      action: sidebarAction.setMetricsFetchWorker,
      payload: newMetricsFetchWorker,
    });

    newMetricsFetchWorker.onmessage = async (
      event: MetricsMessageEvent,
    ) => {
      await handleMetricCategoryOnmessageCallback({
        authDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        navigate,
        productMetricCategory,
        repairMetricCategory,
        showBoundary,
        storeLocationView,
      });
    };

    const newDirectoryFetchWorker = new FetchParseWorker();
    sidebarDispatch({
      action: sidebarAction.setDirectoryFetchWorker,
      payload: newDirectoryFetchWorker,
    });

    newDirectoryFetchWorker.onmessage = async (
      event: DirectoryMessageEvent,
    ) => {
      await handleDirectoryOnmessageCallback({
        authDispatch,
        department: "Executive Management",
        event,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
        storeLocation: "All Locations",
        navigate,
        toLocation: "/dashboard/directory",
      });
    };

    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: metricsView === "products" && isFetching
          ? <Loader size={18} />
          : <TbAffiliate size={18} />,
        name: "Products",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "products",
          });

          await handleMetricCategoryNavClick({
            accessToken,
            metricsFetchWorker,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "products",
            navigate,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
            toLocation: "/dashboard/products",
          }).then((result) => {
            console.log("Result:", result);
          });

          // const urlWithQuery = new URL(
          //   `${METRICS_URL}/products/?${storeLocationQuery}&metricCategory[$eq]=${productMetricCategory}`,
          // );

          // metricsFetchWorker?.postMessage({
          //   requestInit,
          //   url: urlWithQuery,
          //   routesZodSchemaMapKey: "productMetrics",
          // });

          // await handleMetricCategoryNavlinkClick({
          //   accessToken,
          //   authDispatch,
          //   fetchAbortControllerRef,
          //   globalDispatch,
          //   isComponentMountedRef,
          //   metricsUrl: METRICS_URL,
          //   metricsView: "products",
          //   navigate,
          //   toLocation: "/dashboard/products",
          //   productMetricCategory,
          //   repairMetricCategory,
          //   showBoundary,
          //   storeLocationView,
          // });

          setOpened(false);
        },
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: metricsView === "financials" && isFetching
          ? <Loader size={18} />
          : <TbReportMoney size={18} />,
        name: "Financials",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "financials",
          });

          await handleMetricCategoryNavClick({
            accessToken,
            metricsFetchWorker,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "financials",
            navigate,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
            toLocation: "/dashboard/financials",
          });

          // const urlWithQuery = new URL(
          //   `${METRICS_URL}/financials/?${storeLocationQuery}`,
          // );

          // metricsFetchWorker?.postMessage({
          //   requestInit,
          //   url: urlWithQuery,
          //   routesZodSchemaMapKey: "financialMetrics",
          // });

          // await handleMetricCategoryNavlinkClick({
          //   accessToken,
          //   authDispatch,
          //   fetchAbortControllerRef,
          //   globalDispatch,
          //   isComponentMountedRef,
          //   metricsUrl: METRICS_URL,
          //   metricsView: "financials",
          //   navigate,
          //   toLocation: "/dashboard/financials",
          //   productMetricCategory,
          //   repairMetricCategory,
          //   showBoundary,
          //   storeLocationView,
          // });

          setOpened(false);
        },
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: metricsView === "customers" && isFetching
          ? <Loader size={18} />
          : <TbUser size={18} />,
        name: "Customers",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "customers",
          });

          await handleMetricCategoryNavClick({
            accessToken,
            metricsFetchWorker,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "customers",
            navigate,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
            toLocation: "/dashboard/customers",
          });

          // const urlWithQuery = new URL(
          //   `${METRICS_URL}/customers/?${storeLocationQuery}`,
          // );

          // metricsFetchWorker?.postMessage({
          //   requestInit,
          //   url: urlWithQuery,
          //   routesZodSchemaMapKey: "customerMetrics",
          // });

          // await handleMetricCategoryNavlinkClick({
          //   accessToken,
          //   authDispatch,
          //   fetchAbortControllerRef,
          //   globalDispatch,
          //   isComponentMountedRef,
          //   metricsUrl: METRICS_URL,
          //   metricsView: "customers",
          //   navigate,
          //   toLocation: "/dashboard/customers",
          //   productMetricCategory,
          //   repairMetricCategory,
          //   showBoundary,
          //   storeLocationView,
          // });

          setOpened(false);
        },
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: metricsView === "repairs" && isFetching
          ? <Loader size={18} />
          : <TbTools size={18} />,
        name: "Repairs",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "repairs",
          });

          await handleMetricCategoryNavClick({
            accessToken,
            metricsFetchWorker,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "repairs",
            navigate,
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
            toLocation: "/dashboard/repairs",
          });

          // const urlWithQuery = new URL(
          //   `${METRICS_URL}/repairs/?${storeLocationQuery}&metricCategory[$eq]=${repairMetricCategory}`,
          // );

          // metricsFetchWorker?.postMessage({
          //   requestInit,
          //   url: urlWithQuery,
          //   routesZodSchemaMapKey: "repairMetrics",
          // });

          // await handleMetricCategoryNavlinkClick({
          //   accessToken,
          //   authDispatch,
          //   fetchAbortControllerRef,
          //   globalDispatch,
          //   isComponentMountedRef,
          //   metricsUrl: METRICS_URL,
          //   metricsView: "repairs",
          //   navigate,
          //   toLocation: "/dashboard/repairs",
          //   productMetricCategory,
          //   repairMetricCategory,
          //   showBoundary,
          //   storeLocationView,
          // });

          setOpened(false);
        },
      }}
    />
  );

  const directoryNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Directory",
        icon: <TbFileDatabase size={18} />,
        name: "Directory",
        onClick: async () => {
          await handleDirectoryNavClick({
            accessToken,
            department: "Executive Management",
            directoryFetchWorker,
            directoryUrl: API_URL,
            globalDispatch,
            isComponentMountedRef,
            navigate,
            showBoundary,
            storeLocation: "All Locations",
            toLocation: "/dashboard/directory",
          });

          // await handleDirectoryClicks({
          //   accessToken,
          //   authDispatch,
          //   department: "Executive Management",
          //   storeLocation: "All Locations",
          //   directoryUrl: API_URL,
          //   fetchAbortControllerRef,
          //   globalDispatch,
          //   isComponentMountedRef,
          //   navigate,
          //   showBoundary,
          //   toLocation: "/dashboard/directory",
          // });
          setOpened(false);
        },
      }}
    />
  );

  const testingNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Testing",
        icon: <TbTestPipe size={18} />,
        name: "Testing",
        onClick: async () => {
          navigate("/testing");
          setOpened(false);
        },
      }}
    />
  );

  const usersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Users",
        icon: <TbUser size={18} />,
        name: "Users",
        onClick: () => {
          navigate("/dashboard/users");
          setOpened(false);
        },
      }}
    />
  );

  const logoutButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Logout",
        kind: "logout",
        name: "logout",
        onClick: async () => {
          await handleLogoutButtonClick({
            accessToken,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            localforage,
            logoutUrl: LOGOUT_URL,
            navigate,
            showBoundary,
          });
        },
      }}
    />
  );

  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  return (
    <Stack
      bg={bgGradient}
      className={`sidebar ${opened ? "opened" : ""}`}
      pt="xl"
      w="100%"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 2,
      }}
    >
      <Group w="100%" position="left">
        <Text size={18} weight={400}>
          Metrics
        </Text>
      </Group>
      {financialsNavlink}
      {productsNavlink}
      {customersNavlink}
      {repairsNavlink}
      <Text size={18} weight={400} pt="xl">
        Directory
      </Text>
      {directoryNavlink}
      {usersNavlink}
      <Space h="xl" />
      {logoutButton}
    </Stack>
  );
}

export default Sidebar;
