import { Prettify } from "../../../types";
import { RepairMetricsState } from "./types";

type RepairMetricsAction = Prettify<
  {
    [K in keyof RepairMetricsState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const repairMetricsAction: RepairMetricsAction = {
  setCalendarChartsData: "setCalendarChartsData",
  setCards: "setCards",
  setCharts: "setCharts",
  setIsGenerating: "setIsGenerating",
  setRepairChartsWorker: "setRepairChartsWorker",
};

export { repairMetricsAction };
export type { RepairMetricsAction };
