import { FinancialMetricCategory } from "./types";

const FINANCIAL_PERT_PIE_Y_AXIS_DATA = [
  { label: "Overview", value: "overview" },
  { label: "All", value: "all" },
  { label: "Sales", value: "sales" },
];

const FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA = [
  { label: "Total", value: "total" },
  { label: "All", value: "all" },
  { label: "Overview", value: "overview" },
  { label: "Repair", value: "repair" },
  { label: "Sales", value: "sales" },
  { label: "In-Store", value: "inStore" },
  { label: "Online", value: "online" },
];

const FINANCIAL_OTHERS_Y_AXIS_DATA = [
  { label: "Net Profit Margin", value: "netProfitMargin" },
  { label: "Average Order Value", value: "averageOrderValue" },
  { label: "Conversion Rate", value: "conversionRate" },
];

const FINANCIAL_METRICS_CATEGORY_DATA = [
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

export {
  FINANCIAL_METRICS_CATEGORY_DATA,
  FINANCIAL_OTHERS_Y_AXIS_DATA,
  FINANCIAL_PERT_BAR_LINE_Y_AXIS_DATA,
  FINANCIAL_PERT_PIE_Y_AXIS_DATA,
  PERT_SET,
};
