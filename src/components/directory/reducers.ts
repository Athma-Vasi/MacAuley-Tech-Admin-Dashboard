import { UserDocument } from "../../types";
import { directoryAction } from "./actions";
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
  [directoryAction.setDirectory, directoryReducer_setDirectory],
  [directoryAction.setStoreLocation, directoryReducer_setStoreLocation],
]);

function directoryReducer_setDepartment(
  state: DirectoryState,
  dispatch: DirectoryDispatch,
): DirectoryState {
  return {
    ...state,
    department: dispatch.payload as DepartmentsWithDefaultKey,
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
