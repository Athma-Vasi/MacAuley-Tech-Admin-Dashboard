import { ChartKindSegment } from "../../types";
import { RepairSubMetric } from "../types";
import { RepairRUSAction } from "./actions";

type RepairRUSState = {
  barLineRadialChartKind: ChartKindSegment;
  barLineRadialChartYAxis: RepairSubMetric;
  calendarChartYAxis: RepairSubMetric;
};

type RepairRUSDispatch = {
  action: RepairRUSAction["setBarLineRadialChartKind"];
  payload: ChartKindSegment;
} | {
  action: RepairRUSAction["setBarLineRadialChartYAxis"];
  payload: RepairSubMetric;
} | {
  action: RepairRUSAction["setCalendarChartYAxis"];
  payload: RepairSubMetric;
};

export type { RepairRUSDispatch, RepairRUSState };
