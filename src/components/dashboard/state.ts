import type { DashboardState } from "./types";

const initialDashboardState: DashboardState = {
  dashboardFetchWorker: null,
  isLoading: false,
  loadingMessage: "Generating metrics... Please wait...",
  calendarView: "Daily",
};

export { initialDashboardState };
