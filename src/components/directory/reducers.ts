import { Orientation } from "react-d3-tree";
import { parseSyncSafe } from "../../utils";
import { directoryAction } from "./actions";
import {
  setDepartmentDirectoryDispatchZod,
  setDirectoryFetchWorkerDirectoryDispatchZod,
  setOrientationDirectoryDispatchZod,
  setStoreLocationDirectoryDispatchZod,
} from "./schemas";
import {
  DepartmentsWithDefaultKey,
  DirectoryAction,
  DirectoryDispatch,
  DirectoryState,
  StoreLocationsWithDefaultKey,
} from "./types";

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
  [
    directoryAction.setDirectoryFetchWorker,
    directoryReducer_setDirectoryFetchWorker,
  ],
  [directoryAction.setOrientation, directoryReducer_setOrientation],
  [directoryAction.setStoreLocation, directoryReducer_setStoreLocation],
]);

function directoryReducer_setDepartment(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setDepartmentDirectoryDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    department: parsedResult.val.val
      .payload as DepartmentsWithDefaultKey,
  };
}

function directoryReducer_setDirectoryFetchWorker(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setDirectoryFetchWorkerDirectoryDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    directoryFetchWorker: parsedResult.val.val.payload as Worker,
  };
}

function directoryReducer_setOrientation(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setOrientationDirectoryDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    orientation: parsedResult.val.val.payload as Orientation,
  };
}

function directoryReducer_setStoreLocation(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setStoreLocationDirectoryDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    storeLocation: parsedResult.val.val
      .payload as StoreLocationsWithDefaultKey,
  };
}

export {
  directoryReducer,
  directoryReducer_setDepartment,
  directoryReducer_setDirectoryFetchWorker,
  directoryReducer_setOrientation,
  directoryReducer_setStoreLocation,
};
