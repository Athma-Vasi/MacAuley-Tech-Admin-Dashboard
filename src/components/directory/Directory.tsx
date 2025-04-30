import { Box, Group, Stack } from "@mantine/core";
import { useEffect, useReducer, useRef, useState } from "react";

import { useErrorBoundary } from "react-error-boundary";
import {
  COLORS_SWATCHES,
  FETCH_REQUEST_TIMEOUT,
  STORE_LOCATIONS,
} from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import type { CheckboxRadioSelectData, UserDocument } from "../../types";
import {
  createSafeBoxResult,
  getItemForageSafe,
  returnThemeColors,
} from "../../utils";
import { AccessibleSelectInput } from "../accessibleInputs/AccessibleSelectInput";
import { type DirectoryAction, directoryAction } from "./actions";
import { DEPARTMENTS_DATA } from "./constants";
import { D3Tree } from "./d3Tree/D3Tree";
import { buildD3Tree } from "./d3Tree/utils";
import { directoryReducer } from "./reducers";
import { initialDirectoryState } from "./state";
import type {
  DepartmentsWithDefaultKey,
  StoreLocationsWithDefaultKey,
} from "./types";
import { filterEmployees, returnIsStoreLocationDisabled } from "./utils";

function Directory() {
  const [directoryState, directoryDispatch] = useReducer(
    directoryReducer,
    initialDirectoryState,
  );
  const { department, storeLocation } = directoryState;
  const [directory, setDirectory] = useState<UserDocument[]>([]);
  const { showBoundary } = useErrorBoundary();

  const {
    globalState: { themeObject },
  } = useGlobalState();
  const {
    themeColorShade,
    cardBgGradient,
  } = returnThemeColors({ colorsSwatches: COLORS_SWATCHES, themeObject });

  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(false);

  useEffect(() => {
    async function forageDirectory() {
      fetchAbortControllerRef.current?.abort("Previous request cancelled");
      fetchAbortControllerRef.current = new AbortController();
      const fetchAbortController = fetchAbortControllerRef.current;

      isComponentMountedRef.current = true;
      const isComponentMounted = isComponentMountedRef.current;

      try {
        const forageResult = await getItemForageSafe<UserDocument[]>(
          "directory",
        );

        if (!isComponentMounted) {
          return createSafeBoxResult({
            message: "Component unmounted",
          });
        }

        if (forageResult.err) {
          return createSafeBoxResult({
            message: forageResult.val.message ?? "Error getting directory",
          });
        }

        const { kind, message, data } = forageResult.safeUnwrap();
        if (kind === "notFound") {
          return createSafeBoxResult({
            message: message ?? "No directory found",
          });
        }

        if (data === undefined) {
          return createSafeBoxResult({
            message: "Data is undefined",
          });
        }

        setDirectory(data);
        return createSafeBoxResult({
          message: "Directory fetched successfully",
        });
      } catch (error) {
        if (
          !isComponentMounted || fetchAbortController?.signal.aborted
        ) {
          return createSafeBoxResult({
            message: "Component unmounted or request aborted",
          });
        }

        showBoundary(error);
        return createSafeBoxResult({
          message: "Unknown error",
        });
      }
    }

    forageDirectory();

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

  const departmentData = [
    { label: "All Departments", value: "All Departments" },
    ...DEPARTMENTS_DATA,
  ] as CheckboxRadioSelectData<DepartmentsWithDefaultKey>;

  const departmentSelectInput = (
    <AccessibleSelectInput<
      DirectoryAction["setDepartment"],
      DepartmentsWithDefaultKey
    >
      attributes={{
        data: departmentData,
        name: "department",
        value: department,
        parentDispatch: directoryDispatch,
        validValueAction: directoryAction.setDepartment,
      }}
    />
  );

  const isStoreLocationDisabled = returnIsStoreLocationDisabled(department);
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
        name: "storeLocation",
        value: storeLocation,
        parentDispatch: directoryDispatch,
        validValueAction: directoryAction.setStoreLocation,
      }}
    />
  );

  const filteredEmployees = filterEmployees({
    department,
    directory,
    isStoreLocationDisabled,
    storeLocation,
  });

  const d3Tree = (
    <D3Tree data={buildD3Tree(filteredEmployees, themeColorShade)} />
  );

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
