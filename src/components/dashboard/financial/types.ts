import { FinancialMetricsAction } from "./actions";
import { FinancialMetricsCards } from "./cards";
import { FinancialMetricsCharts } from "./chartsData";

type FinancialMetricCategory =
  | "profit"
  | "revenue"
  | "expenses"
  | "transactions"
  | "otherMetrics";

type FinancialMetricsState = {
  cards: FinancialMetricsCards | null;
  category: FinancialMetricCategory;
  charts: FinancialMetricsCharts | null;
  isGenerating: boolean;
};

type FinancialMetricsDispatch =
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

export type { FinancialMetricCategory, FinancialMetricsDispatch, FinancialMetricsState };
