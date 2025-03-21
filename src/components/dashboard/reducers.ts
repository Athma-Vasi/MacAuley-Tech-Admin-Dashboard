import { dashboardAction } from "./actions";
import type {
  BusinessMetric,
  BusinessMetricStoreLocation,
  DashboardAction,
  DashboardCalendarView,
  DashboardCustomerMetric,
  DashboardDispatch,
  DashboardFinancialMetric,
  DashboardMetricsView,
  DashboardProductMetric,
  DashboardRepairMetric,
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
  [dashboardAction.setCalendarView, dashboardReducer_setCalendarView],
  [dashboardAction.setMetricsView, dashboardReducer_setMetricsView],
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

function dashboardReducer_setCalendarView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    calendarView: dispatch.payload as DashboardCalendarView,
  };
}

function dashboardReducer_setMetricsView(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    metricsView: dispatch.payload as DashboardMetricsView,
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
