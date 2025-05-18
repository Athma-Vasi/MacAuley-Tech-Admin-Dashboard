import { parseSafeSync } from "../../utils";
import { dashboardAction } from "./actions";
import {
  setCalendarViewDashboardDispatchZod,
  setDashboardFetchWorkerDashboardDispatchZod,
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
    dashboardAction.setDashboardFetchWorker,
    dashboardReducer_setDashboardFetchWorker,
  ],
]);

function dashboardReducer_setIsLoading(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setIsLoadingDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    isLoading: parsedResult.val.data.val.payload as boolean,
  };
}

function dashboardReducer_setLoadingMessage(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setLoadingMessageDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    loadingMessage: parsedResult.val.data.val.payload as string,
  };
}

function dashboardReducer_setCalendarView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setCalendarViewDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    calendarView: parsedResult.val.data.val
      .payload as DashboardCalendarView,
  };
}

function dashboardReducer_setDashboardFetchWorker(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  const parsedResult = parseSafeSync({
    object: dispatch,
    zSchema: setDashboardFetchWorkerDashboardDispatchZod,
  });

  if (parsedResult.err || parsedResult.val.data.none) {
    return state;
  }

  return {
    ...state,
    dashboardFetchWorker: parsedResult.val.data.val.payload as Worker,
  };
}

export {
  dashboardReducer,
  dashboardReducer_setCalendarView,
  dashboardReducer_setDashboardFetchWorker,
  dashboardReducer_setIsLoading,
  dashboardReducer_setLoadingMessage,
};
