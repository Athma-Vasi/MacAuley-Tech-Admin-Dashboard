import { Group, Loader, Space, Stack, Text } from "@mantine/core";
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
import { MessageEventDirectoryFetchWorkerToMain } from "../../workers/directoryFetchWorker";
import DirectoryFetchWorker from "../../workers/directoryFetchWorker?worker";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { MessageEventMetricsWorkerToMain } from "../../workers/metricsParseWorker";
import MetricsParseWorker from "../../workers/metricsParseWorker?worker";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";
import { sidebarAction } from "./actions";
import {
  handleDirectoryNavClick,
  handleLogoutClick,
  handleMessageEventDirectoryFetchWorkerToMain,
  handleMessageEventLogoutFetchWorkerToMain,
  handleMessageEventMetricsFetchWorkerToMain,
  handleMetricCategoryNavClick,
} from "./handlers";
import { sidebarReducer } from "./reducers";
import { initialSidebarState } from "./state";

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
    storeLocation,
    isFetching,
    selectedYYYYMMDD,
  } = globalState;
  const {
    clickedNavlink,
    directoryFetchWorker,
    logoutFetchWorker,
    metricsFetchWorker,
  } = sidebarState;

  useEffect(() => {
    const newMetricsFetchWorker = new MetricsParseWorker();
    sidebarDispatch({
      action: sidebarAction.setMetricsFetchWorker,
      payload: newMetricsFetchWorker,
    });

    newMetricsFetchWorker.onmessage = async (
      event: MessageEventMetricsWorkerToMain,
    ) => {
      await handleMessageEventMetricsFetchWorkerToMain({
        authDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        metricsUrl: METRICS_URL,
        navigate,
        showBoundary,
      });
    };

    const newDirectoryFetchWorker = new DirectoryFetchWorker();
    sidebarDispatch({
      action: sidebarAction.setDirectoryFetchWorker,
      payload: newDirectoryFetchWorker,
    });

    newDirectoryFetchWorker.onmessage = async (
      event: MessageEventDirectoryFetchWorkerToMain,
    ) => {
      await handleMessageEventDirectoryFetchWorkerToMain({
        authDispatch,
        directoryUrl: API_URL,
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
      event: MessageEventFetchWorkerToMain<boolean>,
    ) => {
      await handleMessageEventLogoutFetchWorkerToMain({
        event,
        globalDispatch,
        isComponentMountedRef,
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
        dataTestId: "products-navlink",
        description: "Products",
        icon: clickedNavlink === "products" && isFetching
          ? <Loader data-testid={"products-navlink-loader-icon"} size={18} />
          : <TbAffiliate size={18} />,
        name: "Products",
        onClick: async () => {
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
            storeLocation,
            toLocation: "/dashboard/products",
          });

          setOpened(false);
        },
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        dataTestId: "financials-navlink",
        description: "Financials",
        icon: clickedNavlink === "financials" && isFetching
          ? <Loader size={18} />
          : <TbReportMoney size={18} />,
        name: "Financials",
        onClick: async () => {
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
            storeLocation,
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
        dataTestId: "customers-navlink",
        description: "Customers",
        icon: clickedNavlink === "customers" && isFetching
          ? <Loader size={18} />
          : <TbUser size={18} />,
        name: "Customers",
        onClick: async () => {
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
            storeLocation,
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
        dataTestId: "repairs-navlink",
        description: "Repairs",
        icon: clickedNavlink === "repairs" && isFetching
          ? <Loader size={18} />
          : <TbTools size={18} />,
        name: "Repairs",
        onClick: async () => {
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
            storeLocation,
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
        dataTestId: "directory-navlink",
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
            isComponentMountedRef,
            navigate,
            showBoundary,
            toLocation: "/dashboard/directory",
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
        dataTestId: "testing-navlink",
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
        dataTestId: "users-navlink",
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
        dataTestId: "logout-button",
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
          }).then((result) => {
            console.log("handleLogoutClick result:", result);
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
