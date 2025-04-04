import { CheckboxRadioSelectData } from "../../../types";
import {
  CustomerChurnRetentionCalendarChartsKey,
  CustomerMetricsChurnRetentionChartsKey,
  CustomerMetricsNewReturningChartsKey,
  CustomerMetricsNewReturningPieChartsKey,
  CustomerNewReturningCalendarChartsKey,
} from "./chartsData";
import { CustomerMetricsCategory } from "./types";

const CUSTOMER_METRICS_CATEGORY_DATA: CheckboxRadioSelectData<
  CustomerMetricsCategory
> = [
  { label: "New", value: "new" },
  { label: "Returning", value: "returning" },
  { label: "Churn", value: "churn" },
];

const CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerMetricsNewReturningChartsKey
> = [
  { label: "Total", value: "total" },
  { label: "All", value: "all" },
  { label: "Overview", value: "overview" },
  { label: "Sales", value: "sales" },
  { label: "Online", value: "online" },
  { label: "In Store", value: "inStore" },
  { label: "Repair", value: "repair" },
];

const CUSTOMER_CHURN_RETENTION_CALENDAR_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerChurnRetentionCalendarChartsKey
> = [
  { label: "Churn Rate", value: "churnRate" },
  { label: "Retention Rate", value: "retentionRate" },
];

const CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerNewReturningCalendarChartsKey
> = [
  { label: "Total", value: "total" },
  { label: "Sales", value: "sales" },
  { label: "Online", value: "online" },
  { label: "In Store", value: "inStore" },
  { label: "Repair", value: "repair" },
];

const CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerMetricsNewReturningPieChartsKey
> = [
  { label: "Overview", value: "overview" },
  { label: "All", value: "all" },
  { label: "Sales", value: "sales" },
];

const CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA: CheckboxRadioSelectData<
  CustomerMetricsChurnRetentionChartsKey
> = [
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

export {
  CUSTOMER_CHURN_RETENTION_CALENDAR_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_Y_AXIS_DATA,
  CUSTOMER_CHURN_RETENTION_YAXIS_KEY_TO_CARDS_KEY_MAP,
  CUSTOMER_METRICS_CATEGORY_DATA,
  CUSTOMER_NEW_RETURNING_CALENDAR_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_LINE_BAR_Y_AXIS_DATA,
  CUSTOMER_NEW_RETURNING_PIE_Y_AXIS_DATA,
  CUSTOMER_NEW_YAXIS_KEY_TO_CARDS_KEY_MAP,
  CUSTOMER_RETURNING_YAXIS_KEY_TO_CARDS_KEY_MAP,
};
