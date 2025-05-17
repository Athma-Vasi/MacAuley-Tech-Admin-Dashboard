import { Prettify } from "../../../../types";
import { ChurnRetentionState } from "./types";

type ChurnRetentionAction = Prettify<
  {
    [K in keyof ChurnRetentionState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const churnRetentionAction: ChurnRetentionAction = {
  setYAxisKey: "setYAxisKey",
};

export { churnRetentionAction };
export type { ChurnRetentionAction };
