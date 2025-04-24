import { dashboardAction } from "./actions";
import type {
  AllStoreLocations,
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
  [dashboardAction.setSelectedYYYYMMDD, dashboardReducer_setSelectedYYYYMMDD],
  [dashboardAction.setIsLoading, dashboardReducer_setIsLoading],
  [dashboardAction.setLoadingMessage, dashboardReducer_setLoadingMessage],
  [dashboardAction.setCalendarView, dashboardReducer_setCalendarView],
]);

function dashboardReducer_setSelectedYYYYMMDD(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    selectedYYYYMMDD: dispatch.payload as string,
  };
}

function dashboardReducer_setIsLoading(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    isLoading: dispatch.payload as boolean,
  };
}

function dashboardReducer_setLoadingMessage(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    loadingMessage: dispatch.payload as string,
  };
}

function dashboardReducer_setCalendarView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    calendarView: dispatch.payload as DashboardCalendarView,
  };
}

export { dashboardReducer };
