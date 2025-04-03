import { ProductCategory } from "../types";
import { ProductMetricsAction } from "./actions";
import { ProductMetricsCards } from "./cards";
import {
  ProductMetricsCalendarCharts,
  ProductMetricsCharts,
} from "./chartsData";

type ProductSubMetric = "revenue" | "unitsSold";
type ProductMetricCategory = ProductCategory | "All Products";

type ProductMetricsState = {
  calendarChartsData: {
    currentYear: ProductMetricsCalendarCharts | null;
    previousYear: ProductMetricsCalendarCharts | null;
  };
  cards: ProductMetricsCards | null;
  charts: ProductMetricsCharts | null;
  isGenerating: boolean;
};

type ProductMetricsDispatch =
  | {
    action: ProductMetricsAction["setCalendarChartsData"];
    payload: {
      currentYear: ProductMetricsCalendarCharts;
      previousYear: ProductMetricsCalendarCharts;
    };
  }
  | {
    action: ProductMetricsAction["setCards"];
    payload: ProductMetricsCards;
  }
  | {
    action: ProductMetricsAction["setCharts"];
    payload: ProductMetricsCharts;
  }
  | {
    action: ProductMetricsAction["setIsGenerating"];
    payload: boolean;
  };

export type {
  ProductMetricCategory,
  ProductMetricsDispatch,
  ProductMetricsState,
  ProductSubMetric,
};
