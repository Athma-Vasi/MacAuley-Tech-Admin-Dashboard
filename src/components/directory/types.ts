import { Orientation } from "react-d3-tree";
import { Department, StoreLocation, UserDocument } from "../../types";
import { DirectoryAction } from "./actions";

type DirectoryState = {
  department: DepartmentsWithDefaultKey;
  directory: UserDocument[];
  orientation: Orientation;
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
    action: DirectoryAction["setDirectory"];
    payload: UserDocument[];
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
