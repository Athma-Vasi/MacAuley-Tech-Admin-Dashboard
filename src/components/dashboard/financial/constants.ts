import { CheckboxRadioSelectData } from "../../../types";
import { ChartsToYAxisKeysMap } from "../types";
import {
  FinancialMetricsBarLineChartsKey,
  FinancialMetricsCalendarChartsKeyPERT,
  FinancialMetricsOtherMetricsChartsKey,
  FinancialMetricsPieChartsKey,
} from "./chartsData";
import { FinancialMetricCategory } from "./types";

const FINANCIAL_PERT_PIE_Y_AXIS_DATA: CheckboxRadioSelectData<
  FinancialMetricsPieChartsKey
> = [
  { label: "Overview", value: "overview" },
  { label: "All", value: "all" },
  { label: "Sales", value: "sales" },
];

const FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA: CheckboxRadioSelectData<
  FinancialMetricsBarLineChartsKey
> = [
  { label: "Total", value: "total" },
  { label: "All", value: "all" },
  { label: "Overview", value: "overview" },
  { label: "Repair", value: "repair" },
  { label: "Sales", value: "sales" },
  { label: "In-Store", value: "inStore" },
  { label: "Online", value: "online" },
];

const FINANCIAL_PERT_CALENDAR_Y_AXIS_DATA: CheckboxRadioSelectData<
  FinancialMetricsCalendarChartsKeyPERT
> = [
  { label: "Total", value: "total" },
  { label: "Repair", value: "repair" },
  { label: "Sales", value: "sales" },
  { label: "In-Store", value: "inStore" },
  { label: "Online", value: "online" },
];

const FINANCIAL_PERT_Y_AXIS_DATA: CheckboxRadioSelectData<
  | FinancialMetricsPieChartsKey
  | FinancialMetricsBarLineChartsKey
  | FinancialMetricsCalendarChartsKeyPERT
> = [
  { label: "Total", value: "total" }, // blr, calendar
  { label: "All", value: "all" }, // pie, blr
  { label: "Overview", value: "overview" }, // pie, blr
  { label: "Repair", value: "repair" }, // blr, calendar
  { label: "Sales", value: "sales" }, // blr, calendar
  { label: "In-Store", value: "inStore" }, // blr, calendar
  { label: "Online", value: "online" }, // blr, calendar
];

const FINANCIAL_OTHERS_Y_AXIS_DATA: CheckboxRadioSelectData<
  FinancialMetricsOtherMetricsChartsKey
> = [
  { label: "Net Profit Margin", value: "netProfitMargin" },
  { label: "Average Order Value", value: "averageOrderValue" },
  { label: "Conversion Rate", value: "conversionRate" },
];

const FINANCIAL_METRICS_CATEGORY_DATA: CheckboxRadioSelectData<
  FinancialMetricCategory
> = [
  { label: "Profit", value: "profit" },
  { label: "Revenue", value: "revenue" },
  { label: "Expenses", value: "expenses" },
  { label: "Transactions", value: "transactions" },
  { label: "Other Metrics", value: "otherMetrics" },
];

const PERT_SET = new Set<Omit<FinancialMetricCategory, "otherMetrics">>([
  "profit",
  "expenses",
  "revenue",
  "transactions",
]);

const MONEY_SYMBOL_CATEGORIES = new Set([
  "profit",
  "revenue",
  "average order value",
  "expenses",
]);
const PERCENTAGE_SYMBOL_CATEGORIES = new Set([
  "conversion rate",
  "net profit margin",
]);

const FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP = new Map<
  | FinancialMetricsBarLineChartsKey
  | FinancialMetricsOtherMetricsChartsKey
  | FinancialMetricsPieChartsKey,
  Set<string>
>([
  ["overview", new Set(["Total", "Sales Total", "Repair"])],
  [
    "all",
    new Set([
      "Total",
      "Sales Total",
      "Repair",
      "Sales In-Store",
      "Sales Online",
    ]),
  ],
  ["sales", new Set(["Sales Total", "Sales In-Store", "Sales Online"])],
  ["inStore", new Set(["Sales In-Store"])],
  ["online", new Set(["Sales Online"])],
  ["repair", new Set(["Repair"])],
  ["total", new Set(["Total"])],
  ["netProfitMargin", new Set(["Net Profit Margin"])],
  ["averageOrderValue", new Set(["Average Order Value"])],
  ["conversionRate", new Set(["Conversion Rate"])],
]);

const FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP: ChartsToYAxisKeysMap = {
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
    "sales",
  ]),
  calendar: new Set([
    "total",
    "repair",
    "sales",
    "inStore",
    "online",
  ]),
};

export {
  FINANCIAL_CHARTS_TO_Y_AXIS_KEYS_MAP,
  FINANCIAL_METRICS_CATEGORY_DATA,
  FINANCIAL_OTHERS_Y_AXIS_DATA,
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_CALENDAR_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  FINANCIAL_PERT_Y_AXIS_DATA,
  FINANCIAL_YAXIS_KEY_TO_CARDS_KEY_MAP,
  MONEY_SYMBOL_CATEGORIES,
  PERCENTAGE_SYMBOL_CATEGORIES,
  PERT_SET,
};
