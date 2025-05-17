import { Prettify } from "../../../../types";
import { NewState } from "./types";

type NewAction = Prettify<
  {
    [K in keyof NewState as `set${Capitalize<string & K>}`]: `set${Capitalize<
      string & K
    >}`;
  }
>;

const newAction: NewAction = {
  setYAxisKey: "setYAxisKey",
};

export { newAction };
export type { NewAction };
