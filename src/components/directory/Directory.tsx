import { Box, Group, Stack } from "@mantine/core";
import { useEffect, useReducer, useRef } from "react";

import { useErrorBoundary } from "react-error-boundary";
import {
  API_URL,
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
  STORE_LOCATIONS,
} from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData } from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AllStoreLocations } from "../dashboard/types";
import { handleDirectoryClicks } from "../sidebar/handlers";
import { directoryAction } from "./actions";
import { ALL_DEPARTMENTS_DATA } from "./constants";
import { D3Tree } from "./d3Tree/D3Tree";
import { buildD3Tree } from "./d3Tree/utils";
import { directoryReducer } from "./reducers";
import { initialDirectoryState } from "./state";
import type {
  DepartmentsWithDefaultKey,
  StoreLocationsWithDefaultKey,
} from "./types";
import { forageDirectory, returnIsStoreLocationDisabled } from "./utils";

function Directory() {
  const [directoryState, directoryDispatch] = useReducer(
    directoryReducer,
    initialDirectoryState,
  );
  const {
    directory,
    department,
    storeLocation,
  } = directoryState;
  const { showBoundary } = useErrorBoundary();
  const { authState: { accessToken }, authDispatch } = useAuth();

  const {
    globalState: { themeObject },
    globalDispatch,
  } = useGlobalState();
  const {
    themeColorShade,
    cardBgGradient,
  } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    forageDirectory({
      directoryDispatch,
      fetchAbortControllerRef,
      isComponentMountedRef,
      showBoundary,
    });

    const timerId = setTimeout(() => {
      fetchAbortControllerRef?.current?.abort("Request timed out");
    }, FETCH_REQUEST_TIMEOUT);

    return () => {
      clearTimeout(timerId);
      fetchAbortControllerRef?.current?.abort("Component unmounted");
      isComponentMountedRef.current = false;
    };
  }, []);

  if (directory === null || directory === undefined || directory.length === 0) {
    return null;
  }

  const departmentSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: ALL_DEPARTMENTS_DATA,
        name: "department",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          const isStoreLocationDisabled = returnIsStoreLocationDisabled(
            event.currentTarget.value as DepartmentsWithDefaultKey,
          );
          await handleDirectoryClicks({
            accessToken,
            authDispatch,
            department: event.currentTarget.value as DepartmentsWithDefaultKey,
            directoryDispatch,
            directoryUrl: API_URL,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            showBoundary,
            storeLocation: isStoreLocationDisabled
              ? "All Locations"
              : "Edmonton" as AllStoreLocations,
          });
        },
        value: department,
        parentDispatch: directoryDispatch,
        validValueAction: directoryAction.setDepartment,
      }}
    />
  );

  const isStoreLocationDisabled = returnIsStoreLocationDisabled(
    department,
  );
  const storeLocationData = isStoreLocationDisabled
    ? ([
      {
        label: "All Locations",
        value: "All Locations",
      },
    ] as CheckboxRadioSelectData<StoreLocationsWithDefaultKey>)
    : (STORE_LOCATIONS as CheckboxRadioSelectData<
      StoreLocationsWithDefaultKey
    >);

  const storeLocationSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: storeLocationData,
        disabled: isStoreLocationDisabled,
        name: "storeLocation",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          await handleDirectoryClicks({
            accessToken,
            authDispatch,
            department,
            directoryDispatch,
            directoryUrl: API_URL,
            fetchAbortControllerRef,
            globalDispatch,
            isComponentMountedRef,
            showBoundary,
            storeLocation: isStoreLocationDisabled
              ? "All Locations"
              : event.currentTarget.value as AllStoreLocations,
          });
        },
        value: storeLocation,
        parentDispatch: directoryDispatch,
        validValueAction: directoryAction.setStoreLocation,
      }}
    />
  );

  // const filteredEmployees = filterEmployees({
  //   department: directoryDepartment,
  //   directory,
  //   isStoreLocationDisabled,
  //   storeLocation: directoryStoreLocation,
  // });

  // console.log("filteredEmployees", filteredEmployees);

  const d3Tree = directory.length > 0
    ? <D3Tree data={buildD3Tree(directory, themeColorShade)} />
    : null;

  return (
    <Stack w="100%" align="center" bg={cardBgGradient}>
      <Group w="100%" position="center" py="md" align="baseline">
        {departmentSelectInput}
        {storeLocationSelectInput}
      </Group>
      <Box>{d3Tree}</Box>
    </Stack>
  );
}

export default Directory;
