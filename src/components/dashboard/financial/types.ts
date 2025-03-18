import { FinancialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
} from "./chartsData";

type FinancialMetricCategory =
  | "profit"
  | "revenue"
  | "expenses"
  | "transactions"
  | "otherMetrics";

type FinancialMetricsState = {
  calendarChartsData: {
    currentYear: FinancialMetricsCalendarCharts | null;
    previousYear: FinancialMetricsCalendarCharts | null;
  };
  cards: FinancialMetricsCards | null;
  category: FinancialMetricCategory;
  charts: FinancialMetricsCharts | null;
  isGenerating: boolean;
};

type FinancialMetricsDispatch =
  | {
    action: FinancialMetricsAction["setCalendarChartsData"];
    payload: {
      currentYear: FinancialMetricsCalendarCharts;
      previousYear: FinancialMetricsCalendarCharts;
    };
  }
  | {
    action: FinancialMetricsAction["setCards"];
    payload: FinancialMetricsCards;
  }
  | {
    action: FinancialMetricsAction["setCategory"];
    payload: FinancialMetricCategory;
  }
  | {
    action: FinancialMetricsAction["setCharts"];
    payload: FinancialMetricsCharts;
  }
  | {
    action: FinancialMetricsAction["setIsGenerating"];
    payload: boolean;
  };

type FinancialCardsAndStatisticsKeyPERT =
  | "Total"
  | "Sales In-Store"
  | "Sales Online"
  | "Sales Total"
  | "Repair";

type FinancialCardsAndStatisticsKeyOtherMetrics =
  | "Average Order Value"
  | "Conversion Rate"
  | "Net Profit Margin";

type FinancialYAxisVariables =
  | "total"
  | "all"
  | "overview"
  | "repair"
  | "sales"
  | "inStore"
  | "online"
  | "averageOrderValue"
  | "conversionRate"
  | "netProfitMargin";

export type {
  FinancialCardsAndStatisticsKeyOtherMetrics,
  FinancialCardsAndStatisticsKeyPERT,
  FinancialMetricCategory,
  FinancialMetricsDispatch,
  FinancialMetricsState,
  FinancialYAxisVariables,
};
