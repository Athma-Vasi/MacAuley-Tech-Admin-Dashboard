import { CheckboxRadioSelectData } from "../../../types";
import { ChartsToYAxisKeysMap } from "../types";
import {
  CustomerChurnRetentionCalendarChartsKey,
  CustomerMetricsChurnRetentionChartsKey,
  CustomerMetricsNewReturningChartsKey,
} from "./chartsData";
import { CustomerMetricsCategory, CustomerNewReturningYAxisKey } from "./types";

const CUSTOMER_METRICS_CATEGORY_DATA: CheckboxRadioSelectData<
  CustomerMetricsCategory
> = [
  { label: "New", value: "new" },
  { label: "Returning", value: "returning" },
  { label: "Churn", value: "churn" },
];

const CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerMetricsChurnRetentionChartsKey
> = [
  { label: "Overview", value: "overview" },
  { label: "Churn Rate", value: "churnRate" },
  { label: "Retention Rate", value: "retentionRate" },
];

const CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP = new Map<
  CustomerChurnRetentionCalendarChartsKey,
  Set<string>
>([
  ["churnRate", new Set(["Churn Rate"])],
  ["retentionRate", new Set(["Retention Rate"])],
]);

const CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP = new Map<
  CustomerMetricsNewReturningChartsKey,
  Set<string>
>([
  ["overview", new Set(["Total New", "Sales", "Repair"])],
  [
    "all",
    new Set(["Total New", "Sales", "Sales Online", "Sales In-Store", "Repair"]),
  ],
  ["total", new Set(["Total New"])],
  ["sales", new Set(["Sales", "Sales Online", "Sales In-Store"])],
  ["online", new Set(["Sales Online"])],
  ["inStore", new Set(["Sales In-Store"])],
  ["repair", new Set(["Repair"])],
]);

const CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP = new Map<
  CustomerMetricsNewReturningChartsKey,
  Set<string>
>([
  ["overview", new Set(["Total Returning", "Sales", "Repair"])],
  [
    "all",
    new Set([
      "Total Returning",
      "Sales",
      "Sales Online",
      "Sales In-Store",
      "Repair",
    ]),
  ],
  ["total", new Set(["Total Returning"])],
  ["sales", new Set(["Sales", "Sales Online", "Sales In-Store"])],
  ["online", new Set(["Sales Online"])],
  ["inStore", new Set(["Sales In-Store"])],
  ["repair", new Set(["Repair"])],
]);

const CUSTOMER_CHARTS_CHURN_TO_Y_AXIS_KEYS_MAP: ChartsToYAxisKeysMap = {
  bar: new Set([
    "churnRate",
    "retentionRate",
    "overview",
  ]),
  line: new Set([
    "churnRate",
    "retentionRate",
    "overview",
  ]),
  radial: new Set([
    "churnRate",
    "retentionRate",
    "overview",
  ]),
  pie: new Set([]),
  calendar: new Set([
    "churnRate",
    "retentionRate",
  ]),
};

const CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP: ChartsToYAxisKeysMap = {
  bar: new Set([
    "total",
    "all",
    "overview",
    "repair",
    "sales",
    "inStore",
    "online",
  ]),
  line: new Set([
    "total",
    "all",
    "overview",
    "repair",
    "sales",
    "inStore",
    "online",
  ]),
  radial: new Set([
    "total",
    "all",
    "overview",
    "repair",
    "sales",
    "inStore",
    "online",
  ]),
  pie: new Set([
    "overview",
    "all",
  ]),
  calendar: new Set([
    "total",
    "repair",
    "sales",
    "inStore",
    "online",
  ]),
};

const CUSTOMER_NEW_RETURNING_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerNewReturningYAxisKey
> = [
  { label: "Total", value: "total" },
  { label: "All", value: "all" },
  { label: "Overview", value: "overview" },
  { label: "Sales", value: "sales" },
  { label: "Online", value: "online" },
  { label: "In Store", value: "inStore" },
  { label: "Repair", value: "repair" },
];

export {
  CUSTOMER_CHARTS_CHURN_TO_Y_AXIS_KEYS_MAP,
  CUSTOMER_CHARTS_TO_Y_AXIS_KEYS_MAP,
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
  CUSTOMER_METRICS_CATEGORY_DATA,
  CUSTOMER_NEW_RETURNING_Y_AXIS_DATA,
  CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
  CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
};
