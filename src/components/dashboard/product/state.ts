import { ProductMetricsState } from "./types";

const initialProductMetricsState: ProductMetricsState = {
  cards: null,
  charts: null,
  isGenerating: false,
  productCategory: "All Products",
  subMetric: "revenue",
};

export { initialProductMetricsState };
