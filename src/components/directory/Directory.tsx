import { Box, Group, Loader, Stack, Text } from "@mantine/core";
import { useEffect, useReducer } from "react";

import { Orientation } from "react-d3-tree";
import { useErrorBoundary } from "react-error-boundary";
import { API_URL, COLORS_SWATCHES, STORE_LOCATIONS } from "../../constants";
import { useMountedRef } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData } from "../../types";
import { returnThemeColors } from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { AllStoreLocations } from "../dashboard/types";
import {
  handleMessageEventDirectoryFetchWorkerToMain,
} from "../sidebar/handlers";
import { directoryAction } from "./actions";
import { ALL_DEPARTMENTS_DATA, ORIENTATIONS_DATA } from "./constants";
import { D3Tree } from "./d3Tree/D3Tree";
import { buildD3Tree } from "./d3Tree/utils";
import { MessageEventDirectoryFetchWorkerToMain } from "./fetchWorker";
import DirectoryFetchWorker from "./fetchWorker?worker";
import { handleDirectoryDepartmentAndLocationClicks } from "./handlers";
import { directoryReducer } from "./reducers";
import { initialDirectoryState } from "./state";
import type {
  DepartmentsWithDefaultKey,
  DirectoryAction,
  StoreLocationsWithDefaultKey,
} from "./types";
import { returnIsStoreLocationDisabled } from "./utils";

function Directory() {
  const [directoryState, directoryDispatch] = useReducer(
    directoryReducer,
    initialDirectoryState,
  );
  const {
    clickedInput,
    directoryFetchWorker,
    department,
    isLoading,
    orientation,
    storeLocation,
  } = directoryState;
  const { showBoundary } = useErrorBoundary();
  const { authState, authDispatch } = useAuth();
  const { accessToken, decodedToken } = authState;
  const {
    globalState: { themeObject, directory },
    globalDispatch,
  } = useGlobalState();
  const {
    themeColorShade,
    cardBgGradient,
  } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

  const isComponentMountedRef = useMountedRef();

  console.log("auth state inside Directory:", authState);

  useEffect(() => {
    const newDirectoryFetchWorker = new DirectoryFetchWorker();

    directoryDispatch({
      action: directoryAction.setDirectoryFetchWorker,
      payload: newDirectoryFetchWorker,
    });

    newDirectoryFetchWorker.onmessage = async (
      event: MessageEventDirectoryFetchWorkerToMain,
    ) => {
      await handleMessageEventDirectoryFetchWorkerToMain({
        authDispatch,
        event,
        globalDispatch,
        isComponentMountedRef,
        showBoundary,
      });

      directoryDispatch({
        action: directoryAction.setIsLoading,
        payload: false,
      });
    };

    return () => {
      isComponentMountedRef.current = false;
      newDirectoryFetchWorker.terminate();
    };
  }, []);

  if (directory === null || directory === undefined || directory.length === 0) {
    return null;
  }

  const departmentSelectInput = (
    <AccessibleSelectInput<
      DirectoryAction["setDepartment"],
      DepartmentsWithDefaultKey
    >
      attributes={{
        data: ALL_DEPARTMENTS_DATA,
        label: (
          <Group spacing="xs">
            <Text>Department</Text>
            {clickedInput === "department" && isLoading
              ? <Loader size="xs" />
              : null}
          </Group>
        ),
        name: "department",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          if (!decodedToken || isLoading) {
            return;
          }
          const isStoreLocationDisabled = returnIsStoreLocationDisabled(
            event.currentTarget.value as DepartmentsWithDefaultKey,
          );

          directoryDispatch({
            action: directoryAction.setClickedInput,
            payload: "department",
          });

          await handleDirectoryDepartmentAndLocationClicks({
            accessToken,
            department: event.currentTarget.value as DepartmentsWithDefaultKey,
            directoryDispatch,
            directoryFetchWorker,
            directoryUrl: API_URL,
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
    <AccessibleSelectInput<
      DirectoryAction["setStoreLocation"],
      StoreLocationsWithDefaultKey
    >
      attributes={{
        data: storeLocationData,
        disabled: isStoreLocationDisabled,
        label: (
          <Group spacing="xs">
            <Text>Store Location</Text>
            {clickedInput === "storeLocation" && isLoading
              ? <Loader size="xs" />
              : null}
          </Group>
        ),
        name: "storeLocation",
        onChange: async (event: React.ChangeEvent<HTMLSelectElement>) => {
          if (!decodedToken || isLoading) {
            return;
          }

          directoryDispatch({
            action: directoryAction.setClickedInput,
            payload: "storeLocation",
          });

          await handleDirectoryDepartmentAndLocationClicks({
            accessToken,
            department,
            directoryDispatch,
            directoryFetchWorker,
            directoryUrl: API_URL,
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

  const orientationSelectInput = (
    <AccessibleSelectInput<
      DirectoryAction["setOrientation"],
      Orientation
    >
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
