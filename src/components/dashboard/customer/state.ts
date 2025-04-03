import { CustomerMetricsState } from "./types";

const initialCustomerMetricsState: CustomerMetricsState = {
  calendarChartsData: {
    currentYear: null,
    previousYear: null,
  },
  cards: null,
  charts: null,
  isGenerating: false,
};

export { initialCustomerMetricsState };
