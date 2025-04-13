import { ChartKindSegment } from "../../types";
import { RepairSubMetric } from "../types";
import { RepairRUSAction } from "./actions";

type RepairRUSState = {
  barLineRadialChartKind: ChartKindSegment;
  yAxisKey: RepairSubMetric;
};

type RepairRUSDispatch =
  | {
    action: RepairRUSAction["setBarLineRadialChartKind"];
    payload: ChartKindSegment;
  }
  | {
    action: RepairRUSAction["setYAxisKey"];
    payload: RepairSubMetric;
  };

export type { RepairRUSDispatch, RepairRUSState };
