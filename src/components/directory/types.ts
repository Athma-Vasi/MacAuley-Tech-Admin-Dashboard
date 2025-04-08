import { Department, StoreLocation } from "../../types";
import { DirectoryAction } from "./actions";

type DirectoryState = {
  department: DepartmentsWithDefaultKey;
  storeLocation: StoreLocationsWithDefaultKey;
};

// default keys needed for select inputs
type DepartmentsWithDefaultKey = Department | "All Departments";
type StoreLocationsWithDefaultKey = StoreLocation | "All Locations";

type DirectoryDispatch =
  | {
    action: DirectoryAction["setDepartment"];
    payload: DepartmentsWithDefaultKey;
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
