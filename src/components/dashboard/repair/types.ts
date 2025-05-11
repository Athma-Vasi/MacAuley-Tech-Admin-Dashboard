import { RepairCategory } from "../types";
import { RepairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import { RepairMetricCalendarCharts, RepairMetricsCharts } from "./chartsData";

type RepairSubMetric = "revenue" | "unitsRepaired";
type RepairMetricCategory = RepairCategory | "All Repairs";

type RepairMetricsState = {
  calendarChartsData: {
    currentYear: RepairMetricCalendarCharts | null;
    previousYear: RepairMetricCalendarCharts | null;
  };
  cards: RepairMetricsCards | null;
  charts: RepairMetricsCharts | null;
  isGenerating: boolean;
  repairChartsWorker: Worker | null;
};

type RepairMetricsDispatch =
  | {
    action: RepairMetricsAction["setCalendarChartsData"];
    payload: {
      currentYear: RepairMetricCalendarCharts;
      previousYear: RepairMetricCalendarCharts;
    };
  }
  | {
    action: RepairMetricsAction["setCards"];
    payload: RepairMetricsCards;
  }
  | {
    action: RepairMetricsAction["setCharts"];
    payload: RepairMetricsCharts;
  }
  | {
    action: RepairMetricsAction["setRepairChartsWorker"];
    payload: Worker;
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
