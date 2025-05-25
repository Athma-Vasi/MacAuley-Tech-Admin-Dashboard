import type { DashboardState } from "./types";

const initialDashboardState: DashboardState = {
  calendarView: "Daily",
  currentSelectedInput: "",
  dashboardFetchWorker: null,
  isLoading: false,
  loadingMessage: "Generating metrics... Please wait...",
};

export { initialDashboardState };
