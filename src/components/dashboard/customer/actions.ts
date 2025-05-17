import { Prettify } from "../../../types";
import { CustomerMetricsState } from "./types";

type CustomerMetricsAction = Prettify<
  {
    [K in keyof CustomerMetricsState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const customerMetricsAction: CustomerMetricsAction = {
  setCalendarChartsData: "setCalendarChartsData",
  setCards: "setCards",
  setCharts: "setCharts",
  setCustomerChartsWorker: "setCustomerChartsWorker",
  setIsGenerating: "setIsGenerating",
};

export { customerMetricsAction };
export type { CustomerMetricsAction };
