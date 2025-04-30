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
  FETCH_REQUEST_TIMEOUT,
  LOGOUT_URL,
  METRICS_URL,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";
import { DashboardMetricsView } from "../dashboard/types";
import {
  handleDirectoryNavlinkClick,
  handleLogoutButtonClick,
  handleMetricCategoryNavlinkClick,
} from "./handlers";

type SidebarProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ opened, setOpened }: SidebarProps) {
  const { authState: { accessToken }, authDispatch } = useAuth();
  const {
    globalState: {
      themeObject,
      productMetricCategory,
      repairMetricCategory,
      storeLocationView,
      isFetching,
    },
    globalDispatch,
  } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);
  const [clickedKind, setClickedKind] = React.useState<
    "" | DashboardMetricsView
  >("");

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

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: clickedKind === "Products" && isFetching
          ? <Loader size={18} />
          : <TbAffiliate size={18} />,
        name: "Products",
        onClick: async () => {
          setClickedKind("Products");

          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "products",
            navigate,
            toLocation: "/dashboard/products",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
          });

          setOpened(false);
        },
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: clickedKind === "Financials" && isFetching
          ? <Loader size={18} />
          : <TbReportMoney size={18} />,
        name: "Financials",
        onClick: async () => {
          setClickedKind("Financials");

          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "financials",
            navigate,
            toLocation: "/dashboard/financials",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
          });

          setOpened(false);
        },
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: clickedKind === "Customers" && isFetching
          ? <Loader size={18} />
          : <TbUser size={18} />,
        name: "Customers",
        onClick: async () => {
          setClickedKind("Customers");

          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "customers",
            navigate,
            toLocation: "/dashboard/customers",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
          });

          setOpened(false);
        },
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: clickedKind === "Repairs" && isFetching
          ? <Loader size={18} />
          : <TbTools size={18} />,
        name: "Repairs",
        onClick: async () => {
          setClickedKind("Repairs");

          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "repairs",
            navigate,
            toLocation: "/dashboard/repairs",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView,
          });
          return;

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
          // navigate("/dashboard/directory");

          await handleDirectoryNavlinkClick({
            accessToken,
            authDispatch,
            directoryDepartment,
            directoryStoreLocation,
            directoryUrl: API_URL,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            navigate,
            showBoundary,
            toLocation: "/dashboard/directory",
          });
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
