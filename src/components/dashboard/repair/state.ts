import { RepairMetricsState } from "./types";

const initialRepairMetricsState: RepairMetricsState = {
  calendarChartsData: {
    currentYear: null,
    previousYear: null,
  },
  cards: null,
  charts: null,
  isGenerating: false,
  repairCategory: "All Repairs",
  subMetric: "revenue",
};

export { initialRepairMetricsState };
