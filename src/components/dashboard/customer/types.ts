import { CustomerMetricsAction } from "./actions";
import { CustomerMetricsCards } from "./cards";
import {
  CustomerMetricsCalendarCharts,
  CustomerMetricsCharts,
} from "./chartsData";

type CustomerMetricsCategory = "new" | "returning" | "churn";

type CustomerMetricsState = {
  calendarChartsData: {
    currentYear: CustomerMetricsCalendarCharts | null;
    previousYear: CustomerMetricsCalendarCharts | null;
  };
  cards: CustomerMetricsCards | null;
  charts: CustomerMetricsCharts | null;
  isGenerating: boolean;
};

type CustomerMetricsDispatch =
  | {
    action: CustomerMetricsAction["setCalendarChartsData"];
    payload: {
      currentYear: CustomerMetricsCalendarCharts;
      previousYear: CustomerMetricsCalendarCharts;
    };
  }
  | {
    action: CustomerMetricsAction["setCards"];
    payload: CustomerMetricsCards;
  }
  | {
    action: CustomerMetricsAction["setCharts"];
    payload: CustomerMetricsCharts;
  }
  | {
    action: CustomerMetricsAction["setIsGenerating"];
    payload: boolean;
  };

export type {
  CustomerMetricsCategory,
  CustomerMetricsDispatch,
  CustomerMetricsState,
};
