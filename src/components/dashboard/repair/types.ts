import { RepairCategory } from "../types";
import { RepairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricsCharts } from "./chartsData";

type RepairSubMetric = "revenue" | "unitsRepaired";
type RepairMetricCategory = RepairCategory | "All Repairs";

type RepairMetricsState = {
  cards: RepairMetricsCards | null;
  charts: RepairMetricsCharts | null;
  isGenerating: boolean;
  repairCategory: RepairMetricCategory;
  subMetric: RepairSubMetric;
};

type RepairMetricsDispatch =
  | {
      action: RepairMetricsAction["setCards"];
      payload: RepairMetricsCards;
    }
  | {
      action: RepairMetricsAction["setSubMetric"];
      payload: RepairSubMetric;
    }
  | {
      action: RepairMetricsAction["setCharts"];
      payload: RepairMetricsCharts;
    }
  | {
      action: RepairMetricsAction["setRepairCategory"];
      payload: RepairMetricCategory;
    }
  | {
      action: RepairMetricsAction["setIsGenerating"];
      payload: boolean;
    };

export type {
  RepairMetricCategory,
  RepairMetricsDispatch,
  RepairMetricsState,
  RepairSubMetric,
};
