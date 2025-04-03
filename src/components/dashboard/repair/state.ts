import { RepairMetricsState } from "./types";

const initialRepairMetricsState: RepairMetricsState = {
  calendarChartsData: {
    currentYear: null,
    previousYear: null,
  },
  cards: null,
  charts: null,
  isGenerating: false,
};

export { initialRepairMetricsState };
