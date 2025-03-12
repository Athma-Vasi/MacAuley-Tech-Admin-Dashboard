import { RepairMetricsState } from "./types";

const initialRepairMetricsState: RepairMetricsState = {
  cards: null,
  charts: null,
  isGenerating: false,
  repairCategory: "All Repairs",
  subMetric: "revenue",
};

export { initialRepairMetricsState };
