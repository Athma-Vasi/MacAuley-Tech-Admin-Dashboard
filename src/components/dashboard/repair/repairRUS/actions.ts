import { Prettify } from "../../../../types";
import { RepairRUSState } from "./types";

type RepairRUSAction = Prettify<
  {
    [K in keyof RepairRUSState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const repairRUSAction: RepairRUSAction = {
  setYAxisKey: "setYAxisKey",
};

export { repairRUSAction };
export type { RepairRUSAction };
