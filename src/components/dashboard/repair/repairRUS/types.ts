import { RepairSubMetric } from "../types";
import { RepairRUSAction } from "./actions";

type RepairRUSState = {
    barLineChartKind: "bar" | "line";
    barLineChartYAxisVariable: RepairSubMetric;
    calendarChartYAxisVariable: RepairSubMetric;
};

type RepairRUSDispatch = {
    action: RepairRUSAction["setBarLineChartKind"];
    payload: "bar" | "line";
} | {
    action: RepairRUSAction["setBarLineChartYAxisVariable"];
    payload: RepairSubMetric;
} | {
    action: RepairRUSAction["setCalendarChartYAxisVariable"];
    payload: RepairSubMetric;
};

export type { RepairRUSDispatch, RepairRUSState };
