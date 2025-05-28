import { parseSyncSafe } from "../../utils";
import { dashboardAction } from "./actions";
import {
  setCalendarViewDashboardDispatchZod,
  setCurrentSelectedInputDashboardDispatchZod,
  setDashboardCacheWorkerDashboardDispatchZod,
  setIsLoadingDashboardDispatchZod,
  setLoadingMessageDashboardDispatchZod,
} from "./schemas";
import type {
  DashboardAction,
  DashboardCalendarView,
  DashboardDispatch,
  DashboardState,
} from "./types";

function dashboardReducer(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const reducer = dashboardReducersMap.get(dispatch.action);
  return reducer ? reducer(state, dispatch) : state;
}

const dashboardReducersMap = new Map<
  DashboardAction[keyof DashboardAction],
  (state: DashboardState, dispatch: DashboardDispatch) => DashboardState
>([
  [dashboardAction.setIsLoading, dashboardReducer_setIsLoading],
  [dashboardAction.setLoadingMessage, dashboardReducer_setLoadingMessage],
  [dashboardAction.setCalendarView, dashboardReducer_setCalendarView],
  [
    dashboardAction.setDashboardCacheWorker,
    dashboardReducer_setDashboardCacheWorker,
  ],
  [
    dashboardAction.setCurrentSelectedInput,
    dashboardReducer_setCurrentSelectedInput,
  ],
]);

function dashboardReducer_setIsLoading(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setIsLoadingDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    isLoading: parsedResult.val.val.payload as boolean,
  };
}

function dashboardReducer_setLoadingMessage(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setLoadingMessageDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    loadingMessage: parsedResult.val.val.payload as string,
  };
}

function dashboardReducer_setCalendarView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setCalendarViewDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    calendarView: parsedResult.val.val
      .payload as DashboardCalendarView,
  };
}

function dashboardReducer_setDashboardCacheWorker(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setDashboardCacheWorkerDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    dashboardCacheWorker: parsedResult.val.val.payload as Worker,
  };
}

function dashboardReducer_setCurrentSelectedInput(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSyncSafe({
    object: dispatch,
    zSchema: setCurrentSelectedInputDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.none) {
    return state;
  }

  return {
    ...state,
    currentSelectedInput: parsedResult.val.val.payload as string,
  };
}

export {
  dashboardReducer,
  dashboardReducer_setCalendarView,
  dashboardReducer_setDashboardCacheWorker,
  dashboardReducer_setIsLoading,
  dashboardReducer_setLoadingMessage,
};
