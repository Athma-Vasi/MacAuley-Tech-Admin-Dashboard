import type { DashboardState, Year } from "./types";

const initialSelectedDate = new Date().getDate().toString().padStart(2, "0");
const initialSelectedMonth = (new Date().getMonth() + 1).toString().padStart(
  2,
  "0",
);
const initialSelectedYear = new Date().getFullYear().toString() as Year;

const initialDashboardState: DashboardState = {
  businessMetrics: [],
  calendarView: "Daily",
  customerMetric: "Overview",
  financialMetric: "Profit",
  metricsView: "Financials",
  productMetric: "All Products",
  repairMetric: "All Repairs",
  storeLocationView: "All Locations",
  selectedYYYYMMDD:
    `${initialSelectedYear}-${initialSelectedMonth}-${initialSelectedDate}`,
  isLoading: false,
  loadingMessage: "Generating metrics... Please wait...",
};

export { initialDashboardState };
