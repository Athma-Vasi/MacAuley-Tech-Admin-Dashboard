import { Prettify } from "../../../../types";
import { ReturningState } from "./types";

type ReturningAction = Prettify<
  {
    [K in keyof ReturningState as `set${Capitalize<string & K>}`]:
      `set${Capitalize<string & K>}`;
  }
>;

const returningAction: ReturningAction = {
  setYAxisKey: "setYAxisKey",
};

export { returningAction };
export type { ReturningAction };
