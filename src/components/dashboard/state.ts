import type { DashboardState, Year } from "./types";

// const initialSelectedDate = (new Date().getDate()).toString().padStart(
//   2,
//   "0",
// );
// const initialSelectedMonth = (new Date().getMonth() + 1).toString().padStart(
//   2,
//   "0",
// );
// const initialSelectedYear = new Date().getFullYear().toString() as Year;

const initialDashboardState: DashboardState = {
  productMetricCategory: "All Products",
  productSubMetricCategory: "revenue",
  repairMetricCategory: "All Repairs",
  financialMetricCategory: "profit",
  customerMetricsCategory: "new",
  storeLocationView: "All Locations",
  // selectedYYYYMMDD:
  //   `${initialSelectedYear}-${initialSelectedMonth}-${initialSelectedDate}`,
  selectedYYYYMMDD: "2025-03-31",
  isLoading: false,
  loadingMessage: "Generating metrics... Please wait...",
};

export { initialDashboardState };
