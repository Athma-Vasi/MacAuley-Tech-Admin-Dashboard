import type { CheckboxRadioSelectData } from "../../types";
import { RepairMetricCategory } from "./repair/types";
import type {
  AllStoreLocations,
  ChartKindSegment,
  DashboardCalendarView,
  DashboardCustomerMetric,
  DashboardFinancialMetric,
  DashboardMetricsView,
  DashboardProductMetric,
  Month,
  ProductCategory,
  RepairCategory,
} from "./types";

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MONTHS: Month[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Accessory",
  "Central Processing Unit (CPU)",
  "Computer Case",
  "Desktop Computer",
  "Display",
  "Graphics Processing Unit (GPU)",
  "Headphone",
  "Keyboard",
  "Memory (RAM)",
  "Microphone",
  "Motherboard",
  "Mouse",
  "Power Supply Unit (PSU)",
  "Speaker",
  "Storage",
  "Webcam",
];

const PRODUCT_CATEGORIES_DATA: CheckboxRadioSelectData<ProductCategory> = [
  ...PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
];

const REPAIR_CATEGORIES: RepairCategory[] = [
  "Accessory",
  "Audio/Video",
  "Computer Component",
  "Electronic Device",
  "Mobile Device",
  "Peripheral",
];

const CALENDAR_VIEW_DATA: CheckboxRadioSelectData<DashboardCalendarView> = [
  { label: "Daily", value: "Daily" },
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

const FINANCIALS_METRICS_DATA: CheckboxRadioSelectData<
  DashboardFinancialMetric
> = [
  { label: "Profit", value: "Profit" },
  { label: "Revenue", value: "Revenue" },
  { label: "Expenses", value: "Expenses" },
  { label: "Transactions", value: "Transactions" },
  { label: "Other Metrics", value: "Other Metrics" },
];

const CUSTOMER_METRICS_DATA: CheckboxRadioSelectData<DashboardCustomerMetric> =
  [
    { label: "Overview", value: "Overview" },
    { label: "New", value: "New" },
    { label: "Returning", value: "Returning" },
    { label: "Other Metrics", value: "Other Metrics" },
  ];

const PRODUCT_METRICS_DATA: CheckboxRadioSelectData<DashboardProductMetric> = [
  { label: "All Products", value: "All Products" },
  ...PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
];

const REPAIR_METRICS_DATA: CheckboxRadioSelectData<RepairMetricCategory> = [
  { label: "All Repairs", value: "All Repairs" },
  ...REPAIR_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
];

const METRICS_VIEW_TABS_DATA: DashboardMetricsView[] = [
  "Financials",
  "Customers",
  "Products",
  "Repairs",
];

const STORE_LOCATION_VIEW_DATA: CheckboxRadioSelectData<
  AllStoreLocations
> = [
  { label: "All Locations", value: "All Locations" },
  { label: "Edmonton", value: "Edmonton" },
  { label: "Calgary", value: "Calgary" },
  { label: "Vancouver", value: "Vancouver" },
];

const BUSINESS_METRIC_STORE_LOCATIONS: AllStoreLocations[] = [
  "All Locations",
  "Edmonton",
  "Calgary",
  "Vancouver",
];

const YEARS_SET = new Set([
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
]);

const PERCENTAGE_METRICS_SET = new Set([
  "Net Profit Margin",
  "Conversion Rate",
  "Churn Rate",
  "Retention Rate",
]);

const UNITLESS_METRICS_SET = new Set(["Units Sold", "Units Repaired"]);

const CHART_KIND_DATA: CheckboxRadioSelectData<ChartKindSegment> = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
  { label: "Radial", value: "radial" },
];

export {
  BUSINESS_METRIC_STORE_LOCATIONS,
  CALENDAR_VIEW_DATA,
  CHART_KIND_DATA,
  CUSTOMER_METRICS_DATA,
  DAYS_PER_MONTH,
  FINANCIALS_METRICS_DATA,
  METRICS_VIEW_TABS_DATA,
  MONTHS,
  PERCENTAGE_METRICS_SET,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORIES_DATA,
  PRODUCT_METRICS_DATA,
  REPAIR_CATEGORIES,
  REPAIR_METRICS_DATA,
  STORE_LOCATION_VIEW_DATA,
  UNITLESS_METRICS_SET,
  YEARS_SET,
};
