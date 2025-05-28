import { Prettify } from "../../types";
import { DashboardState } from "./types";

type DashboardAction = Prettify<
  {
    [K in keyof DashboardState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const dashboardAction: DashboardAction = {
  setCurrentSelectedInput: "setCurrentSelectedInput",
  setCalendarView: "setCalendarView",
  setDashboardCacheWorker: "setDashboardCacheWorker",
  setIsLoading: "setIsLoading",
  setLoadingMessage: "setLoadingMessage",
};

export { dashboardAction };
export type { DashboardAction };
