import { AccessibleTextAreaInputAction } from "./actions";

type AccessibleTextAreaInputState = {
  textValueBuffer: string;
};

type AccessibleTextAreaInputDispatch = {
  action: AccessibleTextAreaInputAction["setTextValueBuffer"];
  payload: string;
};

export type { AccessibleTextAreaInputDispatch, AccessibleTextAreaInputState };
