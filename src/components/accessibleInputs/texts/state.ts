import { AccessibleTextInputsState } from "./types";

const initialAccessibleTextInputsState: AccessibleTextInputsState = {
  textValues: [""],
  pagesInError: new Set<number>(),
};

export { initialAccessibleTextInputsState };
