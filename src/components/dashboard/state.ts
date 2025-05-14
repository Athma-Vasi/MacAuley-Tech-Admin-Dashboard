import type { DashboardState } from "./types";

const initialDashboardState: DashboardState = {
  dashboardFetchWorker: null,
  selectedYYYYMMDD: "2025-03-31",
  isLoading: false,
  loadingMessage: "Generating metrics... Please wait...",
  calendarView: "Daily",
};

export { initialDashboardState };
