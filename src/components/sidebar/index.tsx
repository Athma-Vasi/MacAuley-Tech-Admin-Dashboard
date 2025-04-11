import { Space, Stack, Text } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
  TbAffiliate,
  TbFileDatabase,
  TbReportMoney,
  TbTools,
  TbUser,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  FETCH_REQUEST_TIMEOUT,
  LOGOUT_URL,
  METRICS_URL,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";
import {
  handleLogoutButtonClick,
  handleMetricCategoryNavlinkClick,
} from "./utils";

type SidebarProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ opened, setOpened }: SidebarProps) {
  const { authState: { accessToken }, authDispatch } = useAuth();
  const {
    globalState: { themeObject, productMetricCategory, repairMetricCategory },
    globalDispatch,
  } = useGlobalState();
  const navigateFn = useNavigate();
  const { showBoundary } = useErrorBoundary();

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

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: <TbAffiliate />,
        name: "Products",
        onClick: async () => {
          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "products",
            navigateFn,
            navigateTo: "/dashboard/products",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView: "All Locations",
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
        icon: <TbReportMoney />,
        name: "Financials",
        onClick: async () => {
          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "financials",
            navigateFn,
            navigateTo: "/dashboard/financials",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView: "All Locations",
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
        icon: <TbUser />,
        name: "Customers",
        onClick: async () => {
          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "customers",
            navigateFn,
            navigateTo: "/dashboard/customers",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView: "All Locations",
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
        icon: <TbTools />,
        name: "Repairs",
        onClick: async () => {
          await handleMetricCategoryNavlinkClick({
            accessToken,
            authDispatch,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            metricsUrl: METRICS_URL,
            metricsView: "repairs",
            navigateFn,
            navigateTo: "/dashboard/repairs",
            productMetricCategory,
            repairMetricCategory,
            showBoundary,
            storeLocationView: "All Locations",
          });
          setOpened(false);
        },
      }}
    />
  );

  const directoryNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Directory",
        icon: <TbFileDatabase />,
        name: "Directory",
        onClick: () => {
          navigateFn("/dashboard/directory");
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
            isComponentMountedRef,
            logoutUrl: LOGOUT_URL,
            navigateFn,
            showBoundary,
          });
        },
      }}
    />
  );

  return (
    <Stack
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
      <Text size={18} weight={400}>
        Metrics
      </Text>
      {financialsNavlink}
      {productsNavlink}
      {customersNavlink}
      {repairsNavlink}
      <Text size={18} weight={400} pt="xl">
        Directory
      </Text>
      {directoryNavlink}
      <Space h="xl" />
      {logoutButton}
    </Stack>
  );
}

export default Sidebar;
