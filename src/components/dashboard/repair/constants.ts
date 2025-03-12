import { CheckboxRadioSelectData } from "../../../types";
import { RepairMetricCategory } from "./types";

const REPAIR_METRICS_SUB_CATEGORY_DATA: CheckboxRadioSelectData = [
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

export { REPAIR_METRICS_DATA, REPAIR_METRICS_SUB_CATEGORY_DATA };
