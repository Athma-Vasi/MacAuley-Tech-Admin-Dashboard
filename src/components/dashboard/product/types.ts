import { ProductMetricsDocument, SafeBoxResult } from "../../../types";
import { DashboardCalendarView, ProductCategory } from "../types";
import { ProductMetricsAction } from "./actions";
import { ProductMetricsCards } from "./cards";
import {
  ProductMetricsCalendarCharts,
  ProductMetricsCharts,
  SelectedDateProductMetrics,
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
  productChartsWorker: Worker | null;
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
  }
  | {
    action: ProductMetricsAction["setProductChartsWorker"];
    payload: Worker;
  };

type MessageEventProductWorkerToMain = MessageEvent<
  SafeBoxResult<
    {
      currentYear: ProductMetricsCalendarCharts;
      previousYear: ProductMetricsCalendarCharts;
      productMetricsCharts: ProductMetricsCharts;
    }
  >
>;
type MessageEventProductMainToWorker = MessageEvent<
  {
    calendarView: DashboardCalendarView;
    productMetricsDocument: ProductMetricsDocument;
    selectedDateProductMetrics: SelectedDateProductMetrics;
    selectedYYYYMMDD: string;
  }
>;

export type {
  MessageEventProductMainToWorker,
  MessageEventProductWorkerToMain,
  ProductMetricCategory,
  ProductMetricsDispatch,
  ProductMetricsState,
  ProductSubMetric,
};
