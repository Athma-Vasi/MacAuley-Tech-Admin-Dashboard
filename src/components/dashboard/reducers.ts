import { BusinessMetricsDocument } from "../../types";
import { dashboardAction } from "./actions";
import { CustomerMetricsCategory } from "./customer/types";
import { FinancialMetricCategory } from "./financial/types";
import { ProductMetricCategory, ProductSubMetric } from "./product/types";
import { RepairMetricCategory } from "./repair/types";
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
  [
    dashboardAction.setProductMetricCategory,
    dashboardReducer_setProductMetricCategory,
  ],
  [
    dashboardAction.setProductSubMetricCategory,
    dashboardReducer_setProductSubMetricCategory,
  ],
  [
    dashboardAction.setRepairMetricCategory,
    dashboardReducer_setRepairMetricCategory,
  ],
  [
    dashboardAction.setFinancialMetricCategory,
    dashboardReducer_setFinancialMetricCategory,
  ],
  [
    dashboardAction.setCustomerMetricsCategory,
    dashboardReducer_setCustomerMetricsCategory,
  ],
  [dashboardAction.setSelectedYYYYMMDD, dashboardReducer_setSelectedYYYYMMDD],
  [
    dashboardAction.setStoreLocationView,
    dashboardReducer_setStoreLocationView,
  ],
  [dashboardAction.setIsLoading, dashboardReducer_setIsLoading],
  [dashboardAction.setLoadingMessage, dashboardReducer_setLoadingMessage],
]);

function dashboardReducer_setProductMetricCategory(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    productMetricCategory: dispatch.payload as ProductMetricCategory,
  };
}

function dashboardReducer_setProductSubMetricCategory(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    productSubMetricCategory: dispatch.payload as ProductSubMetric,
  };
}

function dashboardReducer_setRepairMetricCategory(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    repairMetricCategory: dispatch.payload as RepairMetricCategory,
  };
}

function dashboardReducer_setFinancialMetricCategory(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    financialMetricCategory: dispatch.payload as FinancialMetricCategory,
  };
}

function dashboardReducer_setCustomerMetricsCategory(
  state: DashboardState,
  dispatch: DashboardDispatch,
): DashboardState {
  return {
    ...state,
    customerMetricsCategory: dispatch.payload as CustomerMetricsCategory,
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
