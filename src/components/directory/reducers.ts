import { Orientation } from "react-d3-tree";
import { parseSafeSync } from "../../utils";
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
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setDepartmentDirectoryDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    department: parsedResult.safeUnwrap().data
      ?.payload as DepartmentsWithDefaultKey,
  };
}

function directoryReducer_setDirectoryFetchWorker(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setDirectoryFetchWorkerDirectoryDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    directoryFetchWorker: parsedResult.safeUnwrap().data?.payload as Worker,
  };
}

function directoryReducer_setOrientation(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setOrientationDirectoryDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
    orientation: parsedResult.safeUnwrap().data?.payload as Orientation,
  };
}

function directoryReducer_setStoreLocation(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setStoreLocationDirectoryDispatchZod,
  });

  if (parsedResult.err) {
    return state;
  }

  return {
    ...state,
  };
}

export { directoryReducer };
