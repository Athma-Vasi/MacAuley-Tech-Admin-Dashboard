import { AccessibleTextInputAction } from "./actions";

type AccessibleTextInputState = {
  textValueBuffer: string;
};

type AccessibleTextInputDispatch = {
  action: AccessibleTextInputAction["setTextValueBuffer"];
  payload: string;
};

export type { AccessibleTextInputDispatch, AccessibleTextInputState };
