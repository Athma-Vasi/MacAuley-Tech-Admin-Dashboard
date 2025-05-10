import { ProductMetricsState } from "./types";

const initialProductMetricsState: ProductMetricsState = {
  calendarChartsData: {
    currentYear: null,
    previousYear: null,
  },
  cards: null,
  charts: null,
  isGenerating: false,
  productChartsWorker: null,
};

export { initialProductMetricsState };
