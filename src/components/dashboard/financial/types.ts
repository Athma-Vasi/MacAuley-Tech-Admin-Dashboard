import { FinancialMetricsDocument, SafeBoxResult } from "../../../types";
import { AllStoreLocations, DashboardCalendarView } from "../types";
import { FinancialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import {
  FinancialMetricsCalendarCharts,
  FinancialMetricsCharts,
  SelectedDateFinancialMetrics,
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
  charts: FinancialMetricsCharts | null;
  financialChartsWorker: Worker | null;
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
    action: FinancialMetricsAction["setCharts"];
    payload: FinancialMetricsCharts;
  }
  | {
    action: FinancialMetricsAction["setFinancialChartsWorker"];
    payload: Worker;
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
