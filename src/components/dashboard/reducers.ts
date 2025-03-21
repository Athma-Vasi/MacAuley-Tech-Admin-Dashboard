import { dashboardAction } from "./actions";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardAction,
  DashboardDispatch,
  DashboardMetricsView,
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
  [dashboardAction.setBusinessMetrics, dashboardReducer_setBusinessMetrics],
  [dashboardAction.setSelectedYYYYMMDD, dashboardReducer_setSelectedYYYYMMDD],
  [
    dashboardAction.setStoreLocationView,
    dashboardReducer_setStoreLocationView,
  ],
  [dashboardAction.setIsLoading, dashboardReducer_setIsLoading],
  [dashboardAction.setLoadingMessage, dashboardReducer_setLoadingMessage],
]);

function dashboardReducer_setBusinessMetrics(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    businessMetrics: dispatch.payload as BusinessMetric[],
  };
}

function dashboardReducer_setSelectedYYYYMMDD(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    selectedYYYYMMDD: dispatch.payload as string,
  };
}

function dashboardReducer_setStoreLocationView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    storeLocationView: dispatch.payload as BusinessMetricStoreLocation,
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

export { dashboardReducer };
