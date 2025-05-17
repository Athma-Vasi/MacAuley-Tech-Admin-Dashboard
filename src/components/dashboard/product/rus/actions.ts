import { Prettify } from "../../../../types";
import { RUSState } from "./types";

type RUSAction = Prettify<
  {
    [K in keyof RUSState as `set${Capitalize<string & K>}`]: `set${Capitalize<
      string & K
    >}`;
  }
>;

const rusAction: RUSAction = {
  setYAxisKey: "setYAxisKey",
};

export { rusAction };
export type { RUSAction };
