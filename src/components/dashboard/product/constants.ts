import { CheckboxRadioSelectData } from "../../../types";
import { ProductMetricCategory } from "./types";

const PRODUCT_METRICS_SUB_CATEGORY_DATA: CheckboxRadioSelectData = [
  { label: "Revenue", value: "revenue" },
  { label: "Units Sold", value: "unitsSold" },
];

const PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA: CheckboxRadioSelectData = [
  { label: "Total", value: "total" },
  { label: "Overview", value: "overview" },
  { label: "Online", value: "online" },
  { label: "In Store", value: "inStore" },
];

const PRODUCT_METRIC_CATEGORY_DATA: CheckboxRadioSelectData<ProductMetricCategory> = [
  { label: "All Products", value: "All Products" },
  { label: "Accessory", value: "Accessory" },
  { label: "Central Processing Unit (CPU)", value: "Central Processing Unit (CPU)" },
  { label: "Computer Case", value: "Computer Case" },
  { label: "Display", value: "Display" },
  { label: "Graphics Processing Unit (GPU)", value: "Graphics Processing Unit (GPU)" },
  { label: "Headphone", value: "Headphone" },
  { label: "Keyboard", value: "Keyboard" },
  { label: "Memory (RAM)", value: "Memory (RAM)" },
  { label: "Microphone", value: "Microphone" },
  { label: "Motherboard", value: "Motherboard" },
  { label: "Mouse", value: "Mouse" },
  { label: "Power Supply Unit (PSU)", value: "Power Supply Unit (PSU)" },
  { label: "Speaker", value: "Speaker" },
  { label: "Storage", value: "Storage" },
  { label: "Webcam", value: "Webcam" },
];

export {
  PRODUCT_METRIC_CATEGORY_DATA,
  PRODUCT_METRICS_BAR_LINE_Y_AXIS_DATA,
  PRODUCT_METRICS_SUB_CATEGORY_DATA,
};
