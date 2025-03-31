import { Space, Stack, Text } from "@mantine/core";
import localforage from "localforage";
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
import { FETCH_REQUEST_TIMEOUT } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import { fetchSafe } from "../../utils";
import { AccessibleButton } from "../accessibleInputs/AccessibleButton";
import { AccessibleNavLink } from "../accessibleInputs/AccessibleNavLink";

function Sidebar() {
  const { authState: { accessToken } } = useAuth();
  const { globalState: { themeObject } } = useGlobalState();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [triggerFormSubmit, setTriggerFormSubmit] = React.useState(false);
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    fetchAbortControllerRef.current?.abort("Previous request cancelled");
    fetchAbortControllerRef.current = new AbortController();
    const fetchAbortController = fetchAbortControllerRef.current;

    isComponentMountedRef.current = true;
    const isComponentMounted = isComponentMountedRef.current;

    async function logoutFormSubmit() {
      const LOGOUT_URL = "http://localhost:5000/auth/logout";

      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        mode: "cors",
        signal: fetchAbortController.signal,
      };

      try {
        const responseResult = await fetchSafe(LOGOUT_URL, requestInit);

        if (!isComponentMounted) {
          return;
        }

        if (responseResult.err) {
          showBoundary(responseResult.val.data);
          return;
        }

        setTriggerFormSubmit(false);
        navigate("/");
      } catch (error: unknown) {
        if (
          !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
          return;
        }
        showBoundary(error);
      }
    }

    if (triggerFormSubmit) {
      logoutFormSubmit();
    }

    const timerId = setTimeout(() => {
      fetchAbortController?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortController?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, [triggerFormSubmit]);

  const productsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Products",
        icon: <TbAffiliate />,
        name: "Products",
        onClick: () => navigate("/dashboard/products"),
      }}
    />
  );

  const financialsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Financials",
        icon: <TbReportMoney />,
        name: "Financials",
        onClick: () => navigate("/dashboard/financials"),
      }}
    />
  );

  const customersNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Customers",
        icon: <TbUser />,
        name: "Customers",
        onClick: () => navigate("/dashboard/customers"),
      }}
    />
  );

  const repairsNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Repairs",
        icon: <TbTools />,
        name: "Repairs",
        onClick: () => navigate("/dashboard/repairs"),
      }}
    />
  );

  const directoryNavlink = (
    <AccessibleNavLink
      attributes={{
        description: "Directory",
        icon: <TbFileDatabase />,
        name: "Directory",
        onClick: () => navigate("/dashboard/directory"),
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
          setTriggerFormSubmit(true);
          localforage.removeItem("businessMetrics");
        },
      }}
    />
  );

  return (
    <Stack
      w="100%"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 2,
      }}
      pt="xl"
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
