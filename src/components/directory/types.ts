import { Orientation } from "react-d3-tree";
import { Department, StoreLocation } from "../../types";
import { DirectoryAction } from "./actions";

type DirectoryClickedInput = "department" | "storeLocation" | "";

type DirectoryState = {
  clickedInput: DirectoryClickedInput;
  department: DepartmentsWithDefaultKey;
  directoryFetchWorker: Worker | null;
  isLoading: boolean;
  orientation: Orientation;
  storeLocation: StoreLocationsWithDefaultKey;
};

// default keys needed for select inputs
type DepartmentsWithDefaultKey = Department | "All Departments";
type StoreLocationsWithDefaultKey = StoreLocation | "All Locations";

type DirectoryDispatch =
  | {
    action: DirectoryAction["setClickedInput"];
    payload: DirectoryClickedInput;
  }
  | {
    action: DirectoryAction["setDepartment"];
    payload: DepartmentsWithDefaultKey;
  }
  | {
    action: DirectoryAction["setDirectoryFetchWorker"];
    payload: Worker;
  }
  | {
    action: DirectoryAction["setIsLoading"];
    payload: boolean;
  }
  | {
    action: DirectoryAction["setOrientation"];
    payload: Orientation;
  }
  | {
    action: DirectoryAction["setStoreLocation"];
    payload: StoreLocationsWithDefaultKey;
  };

export type {
  DepartmentsWithDefaultKey,
  DirectoryAction,
  DirectoryDispatch,
  DirectoryState,
  StoreLocationsWithDefaultKey,
};
