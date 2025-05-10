import { RepairMetricsDocument, SafeBoxResult } from "../../../types";
import { DashboardCalendarView, RepairCategory } from "../types";
import { RepairMetricsAction } from "./actions";
import { RepairMetricsCards } from "./cards";
import {
  RepairMetricCalendarCharts,
  RepairMetricsCharts,
  SelectedDateRepairMetrics,
} from "./chartsData";

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

type MessageEventRepairWorkerToMain = MessageEvent<
  SafeBoxResult<
    {
      currentYear: RepairMetricCalendarCharts;
      previousYear: RepairMetricCalendarCharts;
      repairMetricsCharts: RepairMetricsCharts;
    }
  >
>;
type MessageEventRepairMainToWorker = MessageEvent<
  {
    calendarView: DashboardCalendarView;
    repairMetricsDocument: RepairMetricsDocument;
    selectedDateRepairMetrics: SelectedDateRepairMetrics;
    selectedYYYYMMDD: string;
  }
>;

export type {
  MessageEventRepairMainToWorker,
  MessageEventRepairWorkerToMain,
  RepairMetricCategory,
  RepairMetricsDispatch,
  RepairMetricsState,
  RepairSubMetric,
};
