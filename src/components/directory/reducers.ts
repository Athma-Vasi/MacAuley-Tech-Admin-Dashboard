import { UserDocument } from "../../types";
import { directoryAction } from "./actions";
import {
  DepartmentsWithDefaultKey,
  DirectoryAction,
  DirectoryDispatch,
  DirectoryState,
  StoreLocationsWithDefaultKey,
} from "./types";
import { returnIsStoreLocationDisabled } from "./utils";

function directoryReducer(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const reducer = directoryReducers.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const directoryReducers = new Map<
  DirectoryAction[keyof DirectoryAction],
  (state: DirectoryState, dispatch: DirectoryDispatch) => DirectoryState
>([
  [directoryAction.setDepartment, directoryReducer_setDepartment],
  [directoryAction.setDirectory, directoryReducer_setDirectory],
  [directoryAction.setStoreLocation, directoryReducer_setStoreLocation],
]);

function directoryReducer_setDepartment(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const isStoreLocationDisabled = returnIsStoreLocationDisabled(
    dispatch.payload as DepartmentsWithDefaultKey,
  );
  const department = dispatch.payload as DepartmentsWithDefaultKey;

  console.log(
    "directoryReducer_setDepartment department ::",
    department,
    "isStoreLocationDisabled ::",
    isStoreLocationDisabled,
  );

  // if (isStoreLocationDisabled) {
  //   return {
  //     ...state,
  //     department,
  //     storeLocation: "All Locations" as StoreLocationsWithDefaultKey,
  //   };
  // }

  return {
    ...state,
    // storeLocation: "Edmonton" as StoreLocationsWithDefaultKey,
    department,
  };
}

function directoryReducer_setDirectory(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  return {
    ...state,
    directory: dispatch.payload as UserDocument[],
  };
}

function directoryReducer_setStoreLocation(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  return {
    ...state,
    storeLocation: dispatch.payload as StoreLocationsWithDefaultKey,
  };
}

export { directoryReducer };
