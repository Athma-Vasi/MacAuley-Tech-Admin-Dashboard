import {
  CustomerMetricsChurnRetentionChartsKey,
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
} from "./chartsData";
import { CustomerMetricsCategory } from "./types";

// const CUSTOMER_METRICS_CATEGORY_DATA: CustomerMetricsCategory[] = [
//   "new",
//   "returning",
//   "churn",
// ];

const CUSTOMER_METRICS_CATEGORY_DATA: Array<{
  label: Capitalize<string>;
  value: CustomerMetricsCategory;
}> = [
  { label: "New", value: "new" },
  { label: "Returning", value: "returning" },
  { label: "Churn", value: "churn" },
];

// const CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA: CustomerMetricsNewReturningChartsKey[] =
//   ["total", "all", "overview", "sales", "online", "inStore", "repair"];

const CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA: Array<{
  label: Capitalize<string>;
  value: CustomerMetricsNewReturningChartsKey;
}> = [
  { label: "Total", value: "total" },
  { label: "All", value: "all" },
  { label: "Overview", value: "overview" },
  { label: "Sales", value: "sales" },
  { label: "Online", value: "online" },
  { label: "In Store", value: "inStore" },
  { label: "Repair", value: "repair" },
];

// const CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA: CustomerMetricsNewReturningPieChartsKey[] =
//   ["overview", "all", "sales"];

const CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA: Array<{
  label: Capitalize<string>;
  value: CustomerMetricsNewReturningPieChartsKey;
}> = [
  { label: "Overview", value: "overview" },
  { label: "All", value: "all" },
  { label: "Sales", value: "sales" },
];

// const CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA: CustomerMetricsChurnRetentionChartsKey[] = [
//   "overview",
//   "churnRate",
//   "retentionRate",
// ];

const CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA: Array<{
  label: Capitalize<string>;
  value: CustomerMetricsChurnRetentionChartsKey;
}> = [
  { label: "Overview", value: "overview" },
  { label: "Churn Rate", value: "churnRate" },
  { label: "Retention Rate", value: "retentionRate" },
];

export {
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
  CUSTOMER_METRICS_CATEGORY_DATA,
  CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
};
