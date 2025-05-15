import { Box, Group, Stack } from "@mantine/core";
import { useEffect, useReducer } from "react";

import { useErrorBoundary } from "react-error-boundary";
import { API_URL, COLORS_SWATCHES, STORE_LOCATIONS } from "../../constants";
import { useFetchAbortControllerRef, useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData, UserDocument } from "../../types";
import { returnThemeColors } from "../../utils";
import { MessageEventFetchWorkerToMain } from "../../workers/fetchParseWorker";
import FetchParseWorker from "../../workers/fetchParseWorker?worker";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AllStoreLocations } from "../dashboard/types";
import {
  handleDirectoryNavClick,
  handleMessageEventDirectoryFetchWorkerToMain,
} from "../sidebar/handlers";
import { directoryAction } from "./actions";
import { ALL_DEPARTMENTS_DATA, ORIENTATIONS_DATA } from "./constants";
import { D3Tree } from "./d3Tree/D3Tree";
import { buildD3Tree } from "./d3Tree/utils";
import { directoryReducer } from "./reducers";
import { initialDirectoryState } from "./state";
import type {
  DepartmentsWithDefaultKey,
  StoreLocationsWithDefaultKey,
} from "./types";
import { returnIsStoreLocationDisabled } from "./utils";

function Directory() {
  const [directoryState, directoryDispatch] = useReducer(
    directoryReducer,
    initialDirectoryState,
  );
  const {
    directoryFetchWorker,
    department,
    orientation,
    storeLocation,
  } = directoryState;
  const { showBoundary } = useErrorBoundary();
  const { authState: { accessToken }, authDispatch } = useAuth();

  const {
    globalState: { themeObject, directory },
    globalDispatch,
  } = useGlobalState();
  const {
    themeColorShade,
    cardBgGradient,
  } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

  const isComponentMountedRef = useMountedRef();
  const fetchAbortControllerRef = useFetchAbortControllerRef();

  useEffect(() => {
    const newDirectoryFetchWorker = new FetchParseWorker();

    directoryDispatch({
      action: directoryAction.setDirectoryFetchWorker,
      payload: newDirectoryFetchWorker,
    });

    newDirectoryFetchWorker.onmessage = async (
      event: MessageEventFetchWorkerToMain<UserDocument>,
    ) => {
      await handleMessageEventDirectoryFetchWorkerToMain({
        authDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
      });
    };

    return () => {
      isComponentMountedRef.current = false;
      fetchAbortControllerRef.current?.abort("Component unmounted");
      fetchAbortControllerRef.current = null;
      newDirectoryFetchWorker.terminate();
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

          await handleDirectoryNavClick({
            accessToken,
            department: event.currentTarget.value as DepartmentsWithDefaultKey,
            directoryFetchWorker,
            directoryUrl: API_URL,
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
          await handleDirectoryNavClick({
            accessToken,
            department,
            directoryFetchWorker,
            directoryUrl: API_URL,
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

  const orientationSelectInput = (
    <AccessibleSelectInput
      attributes={{
        data: ORIENTATIONS_DATA,
        name: "orientation",
        value: directoryState.orientation,
        parentDispatch: directoryDispatch,
        validValueAction: directoryAction.setOrientation,
      }}
    />
  );

  const d3Tree = directory.length > 0
    ? (
      <D3Tree
        data={buildD3Tree(directory, themeColorShade)}
        orientation={orientation}
      />
    )
    : null;

  return (
    <Stack w="100%" align="center" bg={cardBgGradient}>
      <Group w="100%" position="center" p="md" align="baseline">
        {departmentSelectInput}
        {storeLocationSelectInput}
        {orientationSelectInput}
      </Group>
      <Group w="100%" position="center" py="md" align="baseline">
      </Group>
      <Box>{d3Tree}</Box>
    </Stack>
  );
}

export default Directory;
