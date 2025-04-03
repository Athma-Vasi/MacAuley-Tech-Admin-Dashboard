import { FinancialMetricsState } from "./types";

const initialFinancialMetricsState: FinancialMetricsState = {
  calendarChartsData: {
    currentYear: null,
    previousYear: null,
  },
  cards: null,
  charts: null,
  isGenerating: false,
};

export { initialFinancialMetricsState };
