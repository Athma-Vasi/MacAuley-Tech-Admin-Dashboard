import { Prettify } from "../../../types";
import { ProductMetricsState } from "./types";

type ProductMetricsAction = Prettify<
  {
    [K in keyof ProductMetricsState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const productMetricsAction: ProductMetricsAction = {
  setCalendarChartsData: "setCalendarChartsData",
  setCards: "setCards",
  setCharts: "setCharts",
  setIsGenerating: "setIsGenerating",
  setProductChartsWorker: "setProductChartsWorker",
};

export { productMetricsAction };
export type { ProductMetricsAction };
