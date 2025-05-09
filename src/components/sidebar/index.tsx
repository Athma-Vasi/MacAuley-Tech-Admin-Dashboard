import { Group, Loader, Space, Stack, Text } from "@mantine/core";
import localforage from "localforage";
import React, { useEffect } from "react";
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
import { globalAction } from "../../context/globalProvider";
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
  handleLogoutClick,
  handleLogoutClickOnmessageCallback,
  handleMetricCategoryNavClick,
  handleMetricCategoryOnmessageCallback,
} from "./handlers";
import { sidebarReducer } from "./reducers";
import { initialSidebarState } from "./state";
import {
  DirectoryMessageEvent,
  LogoutMessageEvent,
  MetricsMessageEvent,
} from "./types";

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

  const isComponentMountedRef = useMountedRef();

  console.log("globalState in sidebar:", globalState);

  const {
    themeObject,
    productMetricCategory,
    repairMetricCategory,
    storeLocationView,
    isFetching,
  } = globalState;
  const {
    clickedNavlink,
    directoryFetchWorker,
    logoutFetchWorker,
    metricsFetchWorker,
    metricsView,
  } = sidebarState;

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
        event,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
        navigate,
        toLocation: "/dashboard/directory",
      });
    };

    const newLogoutFetchWorker = new FetchParseWorker();
    sidebarDispatch({
      action: sidebarAction.setLogoutFetchWorker,
      payload: newLogoutFetchWorker,
    });

    newLogoutFetchWorker.onmessage = async (
      event: LogoutMessageEvent,
    ) => {
      await handleLogoutClickOnmessageCallback({
        event,
        globalDispatch,
        isComponentMountedRef,
        localforage,
        navigate,
        showBoundary,
      });
    };

    return () => {
      isComponentMountedRef.current = false;
      newMetricsFetchWorker.terminate();
      newDirectoryFetchWorker.terminate();
      newLogoutFetchWorker.terminate();
    };
  }, []);

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: clickedNavlink === "products" && isFetching
          ? <Loader size={18} />
          : <TbAffiliate size={18} />,
        name: "Products",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "products",
          });
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
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

          setOpened(false);
        },
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: clickedNavlink === "financials" && isFetching
          ? <Loader size={18} />
          : <TbReportMoney size={18} />,
        name: "Financials",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "financials",
          });
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
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

          setOpened(false);
        },
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: clickedNavlink === "customers" && isFetching
          ? <Loader size={18} />
          : <TbUser size={18} />,
        name: "Customers",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "customers",
          });
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
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

          setOpened(false);
        },
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: clickedNavlink === "repairs" && isFetching
          ? <Loader size={18} />
          : <TbTools size={18} />,
        name: "Repairs",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setMetricsView,
            payload: "repairs",
          });
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
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

          setOpened(false);
        },
      }}
    />
  );

  const directoryNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Directory",
        icon: clickedNavlink === "directory" && isFetching
          ? <Loader size={18} />
          : <TbFileDatabase size={18} />,
        name: "Directory",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
            payload: "directory",
          });

          globalDispatch({
            action: globalAction.setIsFetching,
            payload: true,
          });

          await handleDirectoryNavClick({
            accessToken,
            department: "Executive Management",
            directoryFetchWorker,
            directoryUrl: API_URL,
            globalDispatch,
            storeLocation: "All Locations",
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

  const { bgGradient } = returnThemeColors({
    colorsSwatches: COLORS_SWATCHES,
    themeObject,
  });

  const logoutButton = (
    <AccessibleButton
      attributes={{
        enabledScreenreaderText: "Logout",
        kind: "logout",
        leftIcon: clickedNavlink === "logout" && isFetching
          ? (
            <Loader
              size={18}
              color={themeObject.colorScheme === "light" ? "white" : ""}
            />
          )
          : null,
        name: "logout",
        onClick: async () => {
          sidebarDispatch({
            action: sidebarAction.setClickedNavlink,
            payload: "logout",
          });

          await handleLogoutClick({
            accessToken,
            globalDispatch,
            logoutFetchWorker,
            logoutUrl: LOGOUT_URL,
          });
        },
      }}
    />
  );

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
