import { CheckboxRadioSelectData } from "../../../types";
import { ChartsToYAxisKeysMap } from "../types";
import { RepairMetricCategory, RepairSubMetric } from "./types";

const REPAIR_METRICS_SUB_CATEGORY_DATA: CheckboxRadioSelectData<
  RepairSubMetric
> = [
  { label: "Revenue", value: "revenue" },
  { label: "Units Repaired", value: "unitsRepaired" },
];

const REPAIR_METRICS_DATA: CheckboxRadioSelectData<RepairMetricCategory> = [
  { label: "All Repairs", value: "All Repairs" },
  { label: "Accessory", value: "Accessory" },
  { label: "Audio/Video", value: "Audio/Video" },
  { label: "Computer Component", value: "Computer Component" },
  { label: "Electronic Device", value: "Electronic Device" },
  { label: "Mobile Device", value: "Mobile Device" },
  { label: "Peripheral", value: "Peripheral" },
];

const REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP = new Map<
  RepairSubMetric,
  Set<string>
>([
  ["revenue", new Set(["Revenue"])],
  ["unitsRepaired", new Set(["Units Repaired"])],
]);

const REPAIR_CHARTS_TO_Y_AXIS_KEYS_MAP: ChartsToYAxisKeysMap = {
  bar: new Set([
    "revenue",
    "unitsRepaired",
  ]),
  calendar: new Set([
    "revenue",
    "unitsRepaired",
  ]),
  pie: new Set([]),
  radial: new Set([
    "revenue",
    "unitsRepaired",
  ]),
  line: new Set([
    "revenue",
    "unitsRepaired",
  ]),
};

export {
  REPAIR_CHARTS_TO_Y_AXIS_KEYS_MAP,
  REPAIR_METRICS_DATA,
  REPAIR_METRICS_SUB_CATEGORY_DATA,
  REPAIR_YAXIS_KEY_TO_CARDS_KEY_MAP,
};
